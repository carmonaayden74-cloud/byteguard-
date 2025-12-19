"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { useDefense } from "../../context/DefenseContext";

export default function Steganography() {
    const { notify } = useDefense();
    const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [outputImage, setOutputImage] = useState(null);
    const [decodedMessage, setDecodedMessage] = useState('');
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processStep, setProcessStep] = useState(0);
    const canvasRef = useRef(null);

    // --- CRYPTO UTILS (Internal) ---
    const deriveKey = async (password, salt) => {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
        );
        return window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    };

    const encryptMessage = async (text, password) => {
        const enc = new TextEncoder();
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv }, key, enc.encode(text)
        );
        const buffer = new Uint8Array(16 + 12 + encrypted.byteLength);
        buffer.set(salt, 0);
        buffer.set(iv, 16);
        buffer.set(new Uint8Array(encrypted), 28);
        return buffer;
    };

    const decryptMessage = async (buffer, password) => {
        try {
            const salt = buffer.slice(0, 16);
            const iv = buffer.slice(16, 28);
            const data = buffer.slice(28);
            const key = await deriveKey(password, salt);
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv }, key, data
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            throw new Error("AUTHENTICATION_FAILURE: Incorrect key or corrupted stream.");
        }
    };

    // --- STEGANOGRAPHY CORE ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new window.Image();
                img.onload = () => {
                    setImage(img);
                    setOutputImage(null);
                    setDecodedMessage('');
                    setStatus('');
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const runForge = async () => {
        if (!image || !password || (mode === 'encode' && !message)) {
            setStatus('REQUIRED_FIELD_MISSING: Credentials or data empty.');
            return;
        }

        setProcessing(true);
        setProcessStep(1);
        setStatus('');

        // Step Simulation
        const steps = mode === 'encode'
            ? ['Deriving Entropy...', 'Injecting Ciphertext...', 'Lossless Reconstruction...', 'Finalizing Matrix...']
            : ['Scanning Pixels...', 'Header Validation...', 'Entropy Extraction...', 'AES-256 Decryption...'];

        for (let i = 0; i < steps.length; i++) {
            setStatus(steps[i]);
            setProcessStep(i + 1);
            await new Promise(r => setTimeout(r, 600));
        }

        if (mode === 'encode') {
            await encode();
        } else {
            await decode();
        }

        setProcessing(false);
    };

    const encode = async () => {
        try {
            const encryptedData = await encryptMessage(message, password);
            const magic = new TextEncoder().encode("BGST");
            const lengthBuffer = new ArrayBuffer(4);
            new DataView(lengthBuffer).setUint32(0, encryptedData.length);

            const totalData = new Uint8Array(4 + 4 + encryptedData.length);
            totalData.set(magic, 0);
            totalData.set(new Uint8Array(lengthBuffer), 4);
            totalData.set(encryptedData, 8);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
            ctx.imageSmoothingEnabled = false;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;

            if (totalData.length * 8 > pixels.length / 4) {
                setStatus('IMAGE_CAPACITY_EXCEEDED: Binary stream too large for matrix.');
                return;
            }

            for (let i = 0; i < totalData.length; i++) {
                const byte = totalData[i];
                for (let bit = 0; bit < 8; bit++) {
                    const pixelIdx = (i * 8 + bit) * 4;
                    const val = (byte >> (7 - bit)) & 1;
                    pixels[pixelIdx] = (pixels[pixelIdx] & 0xFE) | val;
                    pixels[pixelIdx + 3] = 255;
                }
            }

            ctx.putImageData(imgData, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                setOutputImage(url);
                setStatus('CIPHER_FORGED: Data hidden in matrix.');
                notify('SUCCESS', 'CRYPTOGRAPHIC_FORGE', 'Message successfully embedded in image.');
            }, 'image/png');

        } catch (e) {
            setStatus('ERROR: ' + e.message);
        }
    };

    const decode = async () => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.imageSmoothingEnabled = false;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const readBytes = (offset, count) => {
                const bytes = new Uint8Array(count);
                for (let i = 0; i < count; i++) {
                    let byte = 0;
                    for (let bit = 0; bit < 8; bit++) {
                        const pixelIdx = ((offset + i) * 8 + bit) * 4;
                        const val = pixels[pixelIdx] & 1;
                        byte = (byte << 1) | val;
                    }
                    bytes[i] = byte;
                }
                return bytes;
            };

            const magicBytes = readBytes(0, 4);
            const magicStr = new TextDecoder().decode(magicBytes);

            if (magicStr !== "BGST") {
                throw new Error("INVALID_MATRIX: No ByteGuard signature detected.");
            }

            const lengthBytes = readBytes(4, 4);
            const lengthVal = new DataView(lengthBytes.buffer).getUint32(0);

            if (lengthVal <= 0 || lengthVal > 10000000) {
                throw new Error("STREAM_CORRUPTION: Invalid data length.");
            }

            const data = readBytes(8, lengthVal);
            const text = await decryptMessage(data, password);
            setDecodedMessage(text);
            setStatus('FORGE_UNLOCKED: Ciphertext decrypted.');
            notify('SUCCESS', 'DATA_EXTRACTION', 'Decrypted message extracted from matrix.');
        } catch (e) {
            setStatus('DECRYPT_FAILURE: ' + e.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className={`laser-line ${processing ? 'animate-scan-fast text-blue-500' : ''}`}></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-blue-500/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                CRYPTO_<span className="text-blue-500">FORGE</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className={`w-2 h-2 rounded-full ${processing ? 'bg-blue-500 animate-ping' : 'bg-[#00ff88]'}`}></span>
                                {processing ? 'FORGE_SEQUENCE_ACTIVE' : 'STEGANOGRAPHY_ENGINE // READY'}
                            </div>
                        </div>

                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                            {['encode', 'decode'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`px-8 py-3 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${mode === m
                                        ? 'bg-blue-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-105'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {m === 'encode' ? 'ENCRYPT_HIDE' : 'EXTRACT_DECRYPT'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Control Panel */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="glass-card-extreme p-8 cyber-border-extreme">
                                <h3 className="text-blue-500 text-[10px] font-black uppercase mb-6 tracking-widest">Input_Parameters</h3>
                                <div className="space-y-6">
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center group-hover:border-blue-500/50 transition-all">
                                            <div className="text-3xl mb-2 grayscale group-hover:grayscale-0 transition-all">🖼️</div>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                {image ? 'IMAGE_LOADED_READY' : 'SELECT_LOSSLESS_PNG'}
                                            </div>
                                        </div>
                                    </div>

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="ENCRYPTION_KEY_ [PBKDF2]"
                                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl p-4 text-white text-sm focus:border-blue-500 outline-none transition-all font-bold"
                                    />

                                    {mode === 'encode' && (
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="SECRET_MESSAGE_..."
                                            className="w-full h-32 bg-black/60 border-2 border-white/5 rounded-2xl p-4 text-blue-400 text-sm focus:border-blue-500 outline-none transition-all font-bold resize-none font-mono"
                                        />
                                    )}

                                    <button
                                        onClick={runForge}
                                        disabled={processing}
                                        className="btn-floating-extreme !from-blue-600 !to-blue-800 w-full !py-4 font-black"
                                    >
                                        {processing ? 'SYNCING_ENTROPY...' : 'INITIATE_FORGE_SEQUENCE'}
                                    </button>
                                </div>
                            </div>

                            <TerminalLog />
                        </div>

                        {/* Forge Visualization */}
                        <div className="lg:col-span-7">
                            <div className="glass-card-extreme cyber-border-extreme min-h-[500px] flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                                {processing && (
                                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse z-0"></div>
                                )}

                                <canvas ref={canvasRef} className="hidden" />

                                <div className="z-10 w-full flex flex-col items-center">
                                    {image && !outputImage && !decodedMessage && (
                                        <div className="animate-in fade-in duration-700">
                                            <div className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest text-center">Reference_Matrix</div>
                                            <Image
                                                src={image.src}
                                                alt="Source"
                                                width={500}
                                                height={300}
                                                unoptimized
                                                className={`max-h-72 object-contain rounded-xl border border-white/10 shadow-2xl transition-all ${processing ? 'scale-95 grayscale' : ''}`}
                                            />
                                        </div>
                                    )}

                                    {outputImage && (
                                        <div className="animate-in zoom-in duration-500 text-center w-full">
                                            <div className="text-[10px] font-black text-blue-500 mb-4 uppercase tracking-widest">Finalized_Matrix_Output</div>
                                            <Image
                                                src={outputImage}
                                                alt="Output"
                                                width={500}
                                                height={300}
                                                unoptimized
                                                className="max-h-72 object-contain rounded-xl border-2 border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.3)] mx-auto mb-6 hover:scale-105 transition-transform"
                                            />
                                            <a
                                                href={outputImage}
                                                download="byteguard_stego.png"
                                                className="btn-futuristic !bg-blue-600 !border-blue-600 !px-8"
                                            >
                                                DOWNLOAD_MATRIX_PNG
                                            </a>
                                        </div>
                                    )}

                                    {decodedMessage && (
                                        <div className="animate-in slide-in-from-bottom-10 duration-500 w-full">
                                            <div className="text-[10px] font-black text-[#00ff88] mb-4 uppercase tracking-widest text-center">Extracted_Plaintext</div>
                                            <div className="bg-black/80 border-2 border-[#00ff88]/30 p-8 rounded-3xl text-[#00ff88] font-bold text-lg break-all shadow-[0_0_30px_rgba(0,255,136,0.1)] backdrop-blur-xl">
                                                {decodedMessage}
                                            </div>
                                        </div>
                                    )}

                                    {!image && (
                                        <div className="text-center opacity-30">
                                            <div className="text-8xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-1000">🛠️</div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Awaiting_Source</h3>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                                The forge requires a lossless container to hide data. Loading compressed JPEGs may lead to pixel entropy loss.
                                            </p>
                                        </div>
                                    )}

                                    {status && (
                                        <div className="mt-8 px-6 py-2 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] animate-pulse">
                                            {status}
                                        </div>
                                    )}
                                </div>

                                {/* Processing Steps */}
                                {processing && (
                                    <div className="absolute bottom-8 left-8 right-8 flex gap-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < processStep ? 'bg-blue-500' : 'bg-gray-800'}`}></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-blue-500 text-[9px] font-black uppercase mb-1 tracking-widest">Encryption_Alg</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">AES-256-GCM with PBKDF2 iteration count: 100,000.</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-blue-500 text-[9px] font-black uppercase mb-1 tracking-widest">Injection_Method</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">LSB (Least Significant Bit) manipulation across RGB channels.</div>
                        </div>
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <div className="text-blue-500 text-[9px] font-black uppercase mb-1 tracking-widest">Lossless_Requirement</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">PNG format ensures pixel-perfect data retrieval. Avoid JPEG.</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
