"use client";

import { useState, useCallback, useEffect } from "react";
import { Sidebar } from "../../components/DashboardComponents";
import { useAuth } from "../../context/AuthContext";
import { useDefense } from "../../context/DefenseContext";
import { saveScan } from "../../lib/history";

export default function PasswordGenerator() {
    const { user } = useAuth();
    const { notify } = useDefense();

    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    // Generate initial password lazily to avoid setState in effect
    const [password, setPassword] = useState(() => {
        const charset = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
        };
        const array = new Uint32Array(16);
        window.crypto.getRandomValues(array);
        let generated = "";
        const chars = charset.uppercase + charset.lowercase + charset.numbers + charset.symbols;
        for (let i = 0; i < 16; i++) {
            generated += chars[array[i] % chars.length];
        }
        return generated;
    });

    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState([]);

    // Initial strength calculation based on lazy password
    const [strength, setStrength] = useState(() => {
        const pool = 26 + 26 + 10 + 32;
        const entropy = Math.log2(Math.pow(pool, 16));
        return {
            score: Math.min(100, (entropy / 128) * 100),
            label: "SECURE",
            color: "#ffcc00",
            entropy
        };
    });

    const calculateEntropy = useCallback((pass) => {
        if (!pass) return 0;
        let pool = 0;
        if (/[a-z]/.test(pass)) pool += 26;
        if (/[A-Z]/.test(pass)) pool += 26;
        if (/[0-9]/.test(pass)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pass)) pool += 32;
        return Math.log2(Math.pow(pool, pass.length));
    }, []);

    const generatePassword = useCallback(() => {
        const charset = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
        };

        let validChars = "";
        if (options.uppercase) validChars += charset.uppercase;
        if (options.lowercase) validChars += charset.lowercase;
        if (options.numbers) validChars += charset.numbers;
        if (options.symbols) validChars += charset.symbols;

        if (validChars === "") return;

        let generated = "";
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            generated += validChars[array[i] % validChars.length];
        }

        setPassword(generated);
        setCopied(false);
        setHistory(prev => [generated, ...prev].slice(0, 5));

        const entropy = calculateEntropy(generated);
        let score = Math.min(100, (entropy / 128) * 100);
        let label = "LOW";
        let color = "#ff4d4d";

        if (entropy > 80) { label = "CRITICAL_STRONG"; color = "#00ff88"; }
        else if (entropy > 50) { label = "SECURE"; color = "#ffcc00"; }

        setStrength({ score, label, color, entropy });
    }, [length, options, calculateEntropy]);

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        notify("SUCCESS", "BUFFER_SYNCED", "Credential copied to clipboard.");
    };

    const handleOptionChange = (name, checked) => {
        setOptions((prev) => {
            const next = { ...prev, [name]: checked };
            if (!Object.values(next).some(Boolean)) return prev;
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                            ENTROPY_<span className="text-[#00ff88]">FORGE</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_10px_#00ff88]"></span>
                            CRYPTOGRAPHIC_GENERATOR // v4.0
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Forge Controller */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="glass-card-extreme p-8 cyber-border-extreme relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-7xl grayscale group-hover:opacity-20 transition-all duration-1000">🔑</div>

                                <div className="space-y-10">
                                    <div>
                                        <div className="flex justify-between items-end mb-4">
                                            <label className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">Vector_Length</label>
                                            <span className="text-2xl font-black text-white italic">{length}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="8"
                                            max="64"
                                            value={length}
                                            onChange={(e) => setLength(Number(e.target.value))}
                                            className="w-full bg-black/60 h-2 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'uppercase', label: 'UPPERCASE_A_Z' },
                                            { id: 'lowercase', label: 'LOWERCASE_a_z' },
                                            { id: 'numbers', label: 'NUMERICS_0_9' },
                                            { id: 'symbols', label: 'SYMBOLS_!@#' },
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleOptionChange(opt.id, !options[opt.id])}
                                                className={`p-4 rounded-xl border-2 text-[9px] font-black tracking-widest uppercase transition-all flex flex-col items-center gap-2 ${options[opt.id]
                                                    ? 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                                                    : 'bg-black/40 border-white/5 text-gray-600 hover:border-[#00ff88]/30'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${options[opt.id] ? 'bg-[#00ff88] shadow-[0_0_5px_#00ff88]' : 'bg-gray-800'}`}></div>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={generatePassword}
                                        className="btn-floating-extreme w-full !py-5 font-black !scale-100 hover:!scale-[1.02]"
                                    >
                                        SYNC_NEW_IDENTITY
                                    </button>
                                </div>
                            </div>

                            {/* History Matrix */}
                            <div className="glass-card-extreme p-8 border-white/5">
                                <h3 className="text-gray-600 text-[10px] font-black uppercase mb-6 tracking-widest italic">Identity_Vault_Recent</h3>
                                <div className="space-y-3">
                                    {history.map((pass, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5 group hover:border-[#00ff88]/30 transition-all">
                                            <code className="text-[11px] text-gray-400 font-mono truncate mr-4">{pass}</code>
                                            <button
                                                onClick={() => copyToClipboard(pass)}
                                                className="text-[8px] font-black text-[#00ff88]/40 hover:text-[#00ff88] transition-colors"
                                            >
                                                EXTRACT
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Forge Workspace */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="glass-card-extreme p-12 cyber-border-extreme min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-4 left-8 text-[10px] text-gray-700 font-black tracking-[0.5em] uppercase italic">Forge_Monitor</div>

                                <div className="bg-black/60 p-10 rounded-3xl border-2 border-white/5 mb-12 relative group shadow-inner">
                                    <div className="absolute -top-3 left-6 px-3 bg-[#050505] text-[#00ff88] text-[9px] font-black uppercase tracking-widest border border-[#00ff88]/20">Generated_Identity</div>
                                    <div className="flex justify-between items-center gap-8">
                                        <span className="text-4xl font-black text-white tracking-widest break-all font-mono group-hover:text-[#00ff88] transition-colors duration-500">
                                            {password || "••••••••••••••••"}
                                        </span>
                                        <button
                                            onClick={() => copyToClipboard(password)}
                                            className={`p-4 rounded-2xl transition-all ${copied ? 'bg-[#00ff88] text-black shadow-[0_0_20px_#00ff88]' : 'bg-white/5 text-[#00ff88] hover:bg-[#00ff88]/10'}`}
                                        >
                                            {copied ? '✓' : '📋'}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <span>Entropy_Complexity</span>
                                            <span style={{ color: strength.color }}>{strength.label}</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <div
                                                    key={i}
                                                    className="h-full flex-1 transition-all duration-700"
                                                    style={{
                                                        background: strength.score >= (i * 20) ? strength.color : '#111',
                                                        opacity: strength.score >= (i * 20) ? 1 : 0.2
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                        <div className="text-[9px] font-bold text-gray-600 italic">
                                            Identity measures approximately {strength.entropy.toFixed(1)} bits of entropy.
                                        </div>
                                    </div>

                                    <div className="glass-card-extreme p-6 border-[#00ff88]/10 bg-[#00ff88]/5 flex flex-col justify-center">
                                        <div className="text-[9px] font-black text-[#00ff88] mb-2 uppercase tracking-widest">Resistance_Level</div>
                                        <div className="text-xl font-black text-white italic tracking-tighter">
                                            {strength.entropy > 60 ? "STATE-LEVEL IMMUNE" : strength.entropy > 40 ? "GPU_BRUTE_RESISTANT" : "SURFACE_VULNERABLE"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-2 border-white/5 rounded-3xl bg-gradient-to-r from-black to-white/5 flex items-center gap-8 group">
                                <div className="text-5xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000">🏦</div>
                                <div>
                                    <div className="text-[#00ff88] text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">Secured_Identity_Guarantee</div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                        Our Identity Forge uses window.crypto (CS-PRNG) for true hardware-level randomness.
                                        No patterns are stored or cached beyond your current session.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
