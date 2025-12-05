"use client";
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Sidebar } from '../../components/DashboardComponents';

export default function Steganography() {
    const [mode, setMode] = useState('encode'); // 'encode' | 'decode'
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [password, setPassword] = useState('');
    const [outputImage, setOutputImage] = useState(null);
    const [decodedMessage, setDecodedMessage] = useState('');
    const [status, setStatus] = useState('');
    const canvasRef = useRef(null);

    // --- CRYPTO UTILS ---
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

        // Pack: salt(16) + iv(12) + encrypted
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
            throw new Error("Incorrect password or corrupted data");
        }
    };

    // --- STEGANOGRAPHY UTILS ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
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

    const encode = async () => {
        if (!image || !message || !password) {
            setStatus('Please fill all fields');
            return;
        }

        setStatus('Encrypting...');

        try {
            // 1. Encrypt
            const encryptedData = await encryptMessage(message, password);

            // 2. Prepare Data: [MAGIC(4)] + [LENGTH(4)] + [DATA]
            const magic = new TextEncoder().encode("BGST"); // ByteGuard Stego
            const lengthBuffer = new ArrayBuffer(4);
            new DataView(lengthBuffer).setUint32(0, encryptedData.length);

            const totalData = new Uint8Array(4 + 4 + encryptedData.length);
            totalData.set(magic, 0);
            totalData.set(new Uint8Array(lengthBuffer), 4);
            totalData.set(encryptedData, 8);

            // 3. Embed
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
            ctx.imageSmoothingEnabled = false;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imgData.data;

            // Check capacity (1 byte per pixel using R channel)
            if (totalData.length * 8 > pixels.length / 4) {
                setStatus('Image too small for this message');
                return;
            }

            for (let i = 0; i < totalData.length; i++) {
                const byte = totalData[i];
                for (let bit = 0; bit < 8; bit++) {
                    const pixelIdx = (i * 8 + bit) * 4;
                    const val = (byte >> (7 - bit)) & 1;
                    pixels[pixelIdx] = (pixels[pixelIdx] & 0xFE) | val;
                    pixels[pixelIdx + 3] = 255; // Force Alpha to 100%
                }
            }

            ctx.putImageData(imgData, 0, 0);

            // IMMEDIATE VERIFICATION
            const verifyData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let verifyMagic = 0;
            for (let i = 0; i < 32; i++) {
                verifyMagic = (verifyMagic << 1) | (verifyData[i * 4] & 1);
            }
            // BGST is 0x42475354
            if (verifyMagic !== 0x42475354) {
                console.error("Verification failed. Written: 0x42475354, Read: 0x" + verifyMagic.toString(16));
                setStatus('Warning: Browser corrupted pixel data immediately. Try a different browser or image.');
                return;
            }

            // Use Blob for more reliable large file handling
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                setOutputImage(url);
                setStatus('Success! Message encrypted and hidden. (Integrity Verified)');
            }, 'image/png');

        } catch (e) {
            setStatus('Error: ' + e.message);
        }
    };

    const decode = async () => {
        if (!image || !password) {
            setStatus('Please upload image and enter password');
            return;
        }

        setStatus('Decrypting...');

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.imageSmoothingEnabled = false;
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            // Helper to read bytes
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

            // 1. Check Magic Bytes (First 4 bytes)
            const magicBytes = readBytes(0, 4);
            const magicStr = new TextDecoder().decode(magicBytes);

            // DEBUG: Capture header for analysis
            const debugHeader = Array.from(magicBytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
            console.log("Read Magic Header:", magicStr, "Hex:", debugHeader);

            if (magicStr !== "BGST") {
                throw new Error(`CORRUPTED_OR_INVALID|${debugHeader}|${magicStr}`);
            }

            // 2. Extract Length (Next 4 bytes)
            const lengthBytes = readBytes(4, 4);
            const lengthVal = new DataView(lengthBytes.buffer).getUint32(0);
            console.log("Read Length Header:", lengthVal, "Hex:", Array.from(lengthBytes).map(b => b.toString(16).padStart(2, '0')).join(' '));

            // Sanity check
            if (lengthVal <= 0 || lengthVal > 10000000) { // 10MB limit sanity
                throw new Error("Invalid data length detected");
            }

            // 3. Extract Data
            const data = readBytes(8, lengthVal);

            // 4. Decrypt
            const text = await decryptMessage(data, password);
            setDecodedMessage(text);
            setStatus('Message successfully decrypted!');
        } catch (e) {
            console.error(e);
            if (e.message.startsWith("CORRUPTED_OR_INVALID")) {
                const parts = e.message.split('|');
                const hex = parts[1] || "N/A";
                const str = parts[2] || "N/A";
                setStatus(`Error: Header mismatch. Expected 'BGST', got '${str}' (Hex: ${hex}). Image was modified or is not a steganographic image.`);
            } else if (e.message.includes("Incorrect password")) {
                setStatus('Error: Incorrect password.');
            } else if (e.message.includes("Invalid data length detected")) {
                setStatus('Error: Hidden data length is invalid. Image might be corrupted or not a steganographic image.');
            } else {
                setStatus('Decryption failed: ' + e.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    SECURE STEGANOGRAPHY <span className="text-sm text-gray-500 font-normal">AES-256 ENCRYPTED</span>
                </h1>

                <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                    <div className="flex space-x-4 mb-8 border-b border-[#00ff88]/20 pb-4">
                        <button onClick={() => setMode('encode')} className={`px-4 py-2 rounded transition-all ${mode === 'encode' ? 'bg-[#00ff88] text-black font-bold' : 'text-gray-500 hover:text-[#00ff88]'}`}>ENCRYPT & HIDE</button>
                        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded transition-all ${mode === 'decode' ? 'bg-[#00ff88] text-black font-bold' : 'text-gray-500 hover:text-[#00ff88]'}`}>EXTRACT & DECRYPT</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-[#00ff88] mb-2">1. SELECT IMAGE (PNG Recommended)</label>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00ff88]/10 file:text-[#00ff88] hover:file:bg-[#00ff88]/20" />
                                <p className="text-xs text-gray-500 mt-1">⚠️ Do not use compressed JPGs. PNG is lossless.</p>
                            </div>

                            <div>
                                <label className="block text-sm text-[#00ff88] mb-2">2. PASSWORD (REQUIRED)</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]" placeholder="Enter a strong password" />
                            </div>

                            {mode === 'encode' && (
                                <div>
                                    <label className="block text-sm text-[#00ff88] mb-2">3. SECRET MESSAGE</label>
                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full h-32 bg-black border border-[#00ff88]/30 rounded p-3 text-[#00ff88] focus:outline-none focus:border-[#00ff88]" placeholder="Enter the text you want to hide..." />
                                </div>
                            )}

                            <button onClick={mode === 'encode' ? encode : decode} className="w-full py-3 bg-[#00ff88] text-black font-bold rounded hover:bg-[#00cc6a] transition-colors shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                                {mode === 'encode' ? 'ENCRYPT & HIDE DATA' : 'EXTRACT HIDDEN DATA'}
                            </button>

                            {status && <div className="text-center text-sm font-bold text-yellow-400">{status}</div>}
                        </div>

                        <div className="bg-black/50 rounded-lg p-4 border border-[#00ff88]/10 flex flex-col items-center justify-center min-h-[300px]">
                            {image && <Image src={image.src} alt="Preview" width={500} height={300} unoptimized className="max-h-64 object-contain border border-gray-700 mb-4" />}
                            <canvas ref={canvasRef} className="hidden" />

                            {mode === 'encode' && outputImage && (
                                <div className="text-center w-full animate-fade-in">
                                    <p className="text-[#00ff88] font-bold mb-2">✅ SECURE IMAGE READY</p>
                                    <Image src={outputImage} alt="Encoded" width={500} height={300} unoptimized className="max-h-64 object-contain border border-[#00ff88] mx-auto mb-4" />
                                    <a href={outputImage} download="secure_stego.png" className="inline-block px-6 py-2 border border-[#00ff88] text-[#00ff88] rounded hover:bg-[#00ff88] hover:text-black transition-colors">DOWNLOAD PNG (Do not convert)</a>
                                </div>
                            )}

                            {mode === 'decode' && decodedMessage && (
                                <div className="w-full animate-fade-in">
                                    <p className="text-[#00ff88] font-bold mb-2">🔓 DECRYPTED MESSAGE:</p>
                                    <div className="bg-[#001100] border border-[#00ff88] p-4 rounded text-[#00ff88] font-mono break-all">{decodedMessage}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
