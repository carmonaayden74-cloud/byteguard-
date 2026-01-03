"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function HashCracker() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [hashInput, setHashInput] = useState('');
    const [cracking, setCracking] = useState(false);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);

    const crackHash = async () => {
        if (!hashInput) return;
        setCracking(true);
        setResult(null);
        setProgress(0);
        notify('INFO', 'CRACKING_INITIATED', `Type: ${hashInput.length === 32 ? 'MD5' : (hashInput.length === 40 ? 'SHA-1' : 'SHA-256')}`);

        // Common hashes for demo
        const db = {
            "5e866ad588b57b6499318817917e1f763cf6ca7e914842521df7588b": "password123",
            "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92": "admin1234",
            "541c57a2aa9bc03ef4d60920a6eff3ca": "qwerty",
            "63a9f0ea7bb98050796b649e85481845": "root",
            "7c4a8d09ca3762af61e59520943dc26494f8941b": "123456"
        };

        const steps = 20;
        for (let i = 1; i <= steps; i++) {
            setProgress(Math.round((i / steps) * 100));
            await new Promise(r => setTimeout(r, 100));
        }

        const found = db[hashInput.toLowerCase()];
        if (found) {
            setResult({ status: 'FOUND', value: found });
            notify('SUCCESS', 'HASH_REVERSED', `Result match identified.`);
        } else {
            setResult({ status: 'NOT_FOUND', value: null });
            notify('WARNING', 'NO_MATCH_FOUND', `Hash not in local rainbow database.`);
        }

        setCracking(false);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            HASH_<span className="text-[#00ff88]">CRACKER</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            CRYPTOGRAPHIC_REVERSION_LAB // v2.4-B
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 bg-[#00ff88]/5">
                                <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-6 tracking-widest">Input_Hash_Signature</label>
                                <textarea
                                    value={hashInput}
                                    onChange={(e) => setHashInput(e.target.value)}
                                    placeholder="Enter MD5, SHA-1 or SHA-256 hash here..."
                                    className="w-full bg-black border-2 border-[#00ff88]/30 rounded-xl p-6 text-white font-mono text-sm focus:border-[#00ff88] outline-none transition-all h-32 resize-none shadow-inner"
                                />
                                <button
                                    onClick={crackHash}
                                    disabled={cracking || !hashInput}
                                    className="w-full mt-8 bg-[#00ff88] text-black font-black py-5 rounded-xl hover:bg-[#00cc6a] transition-all disabled:opacity-30 text-xs tracking-widest active:scale-[0.98] shadow-[0_10px_20px_rgba(0,255,136,0.1)]"
                                >
                                    {cracking ? `PENETRATING_BITS: ${progress}%` : '[ REVERSE_HASH_AUTH ]'}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-8 border-white/5 flex items-center justify-around opacity-60">
                                <HashTypeIndicator type="MD5" active={hashInput.length === 32} />
                                <HashTypeIndicator type="SHA-1" active={hashInput.length === 40} />
                                <HashTypeIndicator type="SHA-256" active={hashInput.length === 64} />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            {cracking ? (
                                <div className="text-center space-y-8">
                                    <div className="relative inline-block">
                                        <div className="w-48 h-48 border-4 border-[#00ff88]/10 rounded-full animate-spin"></div>
                                        <div className="w-40 h-40 border-4 border-[#00ff88]/30 border-t-transparent rounded-full animate-spin absolute top-4 left-4" style={{ animationDuration: '1s' }}></div>
                                        <div className="absolute inset-0 flex items-center justify-center text-[#00ff88] text-4xl font-black">
                                            {progress}
                                        </div>
                                    </div>
                                    <div className="text-[#00ff88] text-[10px] font-black tracking-[0.5em] animate-pulse">ITERATING_KNOWN_PATTERNS...</div>
                                </div>
                            ) : result ? (
                                <div className={`glass-card-extreme p-10 border-2 transition-all duration-700 text-center ${result.status === 'FOUND' ? 'border-[#00ff88] shadow-[0_0_50px_rgba(0,255,136,0.2)]' : 'border-red-500/50'}`}>
                                    <h4 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${result.status === 'FOUND' ? 'text-[#00ff88]' : 'text-red-500'}`}>
                                        Verification_Status: {result.status}
                                    </h4>

                                    {result.status === 'FOUND' ? (
                                        <div className="space-y-6">
                                            <div className="text-5xl font-black text-white tracking-widest">{result.value}</div>
                                            <div className="h-px bg-[#00ff88]/20 w-32 mx-auto"></div>
                                            <p className="text-[9px] text-gray-500 leading-relaxed max-w-xs mx-auto uppercase">
                                                Match found in local rainbow tables. Verification confidence level: 99.9%.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 opacity-60">
                                            <div className="text-4xl font-black text-red-500 tracking-tighter">NULL_POINTER</div>
                                            <p className="text-[9px] text-gray-500 leading-relaxed uppercase">
                                                No collision detected within the standard dictionary. Try advanced cloud-shattering mode.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center opacity-10 py-10">
                                    <div className="text-[120px] mb-8 font-black">💀</div>
                                    <div className="text-[10px] font-black tracking-widest uppercase">Encryption is temporary. Truth is absolute.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function HashTypeIndicator({ type, active }) {
    return (
        <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${active ? 'scale-110' : 'grayscale opacity-30'}`}>
            <span className={`text-[10px] font-black tracking-widest ${active ? 'text-[#00ff88]' : 'text-gray-500'}`}>{type}</span>
            <div className={`w-8 h-1 rounded-full ${active ? 'bg-[#00ff88]' : 'bg-gray-800'}`}></div>
        </div>
    );
}
