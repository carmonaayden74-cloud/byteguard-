'use client';

import { useState, useRef } from 'react';

export default function EncriptadorPage() {
    const [mode, setMode] = useState('encrypt'); // 'encrypt' | 'decrypt'
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // Helper: Convert string to ArrayBuffer
    const str2ab = (str) => {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    };

    // Helper: Convert ArrayBuffer to Base64 string
    const ab2base64 = (buf) => {
        let binary = '';
        const bytes = new Uint8Array(buf);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    // Helper: Convert Base64 string to ArrayBuffer
    const base642ab = (base64) => {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    };

    // Derive key from password and salt
    const deriveKey = async (password, salt) => {
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            str2ab(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );

        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256',
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    };

    const handleEncrypt = async () => {
        try {
            setLoading(true);
            setError('');
            setOutput('');

            if (!input || !password) {
                throw new Error('Por favor ingresa el texto y una contraseña.');
            }

            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));

            const key = await deriveKey(password, salt);

            const encryptedContent = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                },
                key,
                str2ab(input)
            );

            const result = {
                salt: ab2base64(salt),
                iv: ab2base64(iv),
                ciphertext: ab2base64(encryptedContent),
            };

            setOutput(JSON.stringify(result));
        } catch (err) {
            setError(err.message || 'Error al encriptar');
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setLoading(true);
            setError('');
            setOutput('');

            if (!input || !password) {
                throw new Error('Por favor ingresa el texto encriptado y la contraseña.');
            }

            let data;
            try {
                data = JSON.parse(input);
            } catch (e) {
                throw new Error('El formato del texto encriptado no es válido.');
            }

            if (!data.salt || !data.iv || !data.ciphertext) {
                throw new Error('Faltan datos necesarios para desencriptar.');
            }

            const salt = base642ab(data.salt);
            const iv = base642ab(data.iv);
            const ciphertext = base642ab(data.ciphertext);

            const key = await deriveKey(password, salt);

            const decryptedContent = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                },
                key,
                ciphertext
            );

            const decoder = new TextDecoder();
            setOutput(decoder.decode(decryptedContent));
        } catch (err) {
            console.error(err);
            setError('Error al desencriptar. Verifica tu contraseña y el texto.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                        Encriptador Seguro
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Protege tus mensajes con encriptación AES-GCM de grado militar.
                        Todo sucede en tu navegador, tus datos nunca salen de tu dispositivo.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-500/10">

                    {/* Mode Toggle */}
                    <div className="flex p-1 bg-slate-800/50 rounded-xl mb-8">
                        <button
                            onClick={() => { setMode('encrypt'); setInput(''); setOutput(''); setError(''); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'encrypt'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            Encriptar
                        </button>
                        <button
                            onClick={() => { setMode('decrypt'); setInput(''); setOutput(''); setError(''); }}
                            className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'decrypt'
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            Desencriptar
                        </button>
                    </div>

                    <div className="space-y-6">

                        {/* Input Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">
                                {mode === 'encrypt' ? 'Mensaje a proteger' : 'Mensaje encriptado (JSON)'}
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={mode === 'encrypt' ? 'Escribe tu secreto aquí...' : 'Pega el código encriptado aquí...'}
                                className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none"
                            />
                        </div>

                        {/* Password Section */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">
                                Contraseña de seguridad
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Una contraseña fuerte..."
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={mode === 'encrypt' ? handleEncrypt : handleDecrypt}
                            disabled={loading || !input || !password}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-[0.98] ${loading
                                ? 'bg-slate-700 cursor-wait opacity-70'
                                : mode === 'encrypt'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                                }`}
                        >
                            {loading
                                ? 'Procesando...'
                                : mode === 'encrypt' ? '🔒 Encriptar Mensaje' : '🔓 Desencriptar Mensaje'
                            }
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Output Section */}
                        {output && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-slate-300">
                                        Resultado
                                    </label>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copiar
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="relative group">
                                    <textarea
                                        readOnly
                                        value={output}
                                        className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-emerald-400 font-mono text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all resize-none"
                                    />
                                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
