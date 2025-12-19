"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { useDefense } from '../../context/DefenseContext';
import { saveScan } from '../../lib/history';

const CRACK_SPEEDS = {
    online_throttle: 100,
    offline_cpu: 10_000_000,
    offline_gpu: 100_000_000_000,
    offline_cluster: 100_000_000_000_000,
};

export default function EntropyAuditor() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [password, setPassword] = useState('');

    const calculateEntropy = useCallback((pwd) => {
        if (!pwd) return 0;
        let pool = 0;
        if (/[a-z]/.test(pwd)) pool += 26;
        if (/[A-Z]/.test(pwd)) pool += 26;
        if (/[0-9]/.test(pwd)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;
        return Math.log2(Math.pow(pool, pwd.length));
    }, []);

    const formatTime = (seconds) => {
        if (seconds < 1) return "INSTANT_CRACK";
        if (seconds < 60) return `${seconds.toFixed(2)} SECONDS`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} MINUTES`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} HOURS`;
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} DAYS`;
        if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(1)} YEARS`;
        return "CENTURIES+";
    };

    const analysis = useMemo(() => {
        if (!password) return null;
        const entropy = calculateEntropy(password);
        const combinations = Math.pow(2, entropy);
        return {
            entropy,
            combinations,
            times: {
                online: formatTime(combinations / (CRACK_SPEEDS.online_throttle || 100)),
                cpu: formatTime(combinations / CRACK_SPEEDS.offline_cpu),
                gpu: formatTime(combinations / CRACK_SPEEDS.offline_gpu),
                cluster: formatTime(combinations / CRACK_SPEEDS.offline_cluster),
            },
            score: Math.min(100, (entropy / 128) * 100)
        };
    }, [password, calculateEntropy]);

    useEffect(() => {
        if (!analysis || !user || analysis.entropy < 20) return;
        const timer = setTimeout(async () => {
            await saveScan(user.id, 'Entropy Auditor', 'Password_Profile_Internal', {
                entropy: analysis.entropy,
                resistance: analysis.times.cluster
            });
        }, 3000);
        return () => clearTimeout(timer);
    }, [analysis, user]);

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                ENTROPY_<span className="text-[#00ff88]">AUDITOR</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                BRUTE_FORCE_RESISTANCE_SIMULATOR // v4.0
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Audit Input */}
                        <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="glass-card-extreme p-8 cyber-border-extreme relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-7xl grayscale group-hover:opacity-20 transition-all duration-1000">🛡️</div>
                                <label className="block text-[10px] font-black text-[#00ff88] mb-6 tracking-widest uppercase italic">Analyze_Target_Vector</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="INPUT_PASSWORD_STREAM..."
                                        className="w-full bg-black/80 border-2 border-[#00ff88]/20 rounded-2xl p-6 text-white text-xl focus:outline-none focus:border-[#00ff88] transition-all font-black placeholder:opacity-20"
                                    />
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                                        <div className={`w-3 h-3 rounded-full ${password.length > 0 ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : 'bg-gray-800'}`}></div>
                                    </div>
                                </div>
                                <p className="text-[9px] text-gray-600 mt-6 font-bold uppercase tracking-widest leading-relaxed">
                                    Local deconstruction completed using sRGB color space encryption headers. No data uplinked to primary core.
                                </p>
                            </div>

                            {analysis && (
                                <div className="glass-card-extreme p-8 border-[#00ff88]/10 bg-gradient-to-br from-transparent to-[#00ff88]/5">
                                    <div className="text-[10px] font-black text-gray-500 mb-6 tracking-widest uppercase">Metric: Bit_Entropy_Depth</div>
                                    <div className="flex items-end gap-4 mb-4">
                                        <span className="text-6xl font-black text-white italic tracking-tighter">{analysis.entropy.toFixed(1)}</span>
                                        <span className="text-xs font-black text-[#00ff88] mb-2 uppercase tracking-widest">BITS</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                                        <div
                                            className="h-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${analysis.score}%`,
                                                background: analysis.score < 40 ? '#ef4444' : analysis.score < 70 ? '#eab308' : '#00ff88'
                                            }}
                                        ></div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-4">
                                        <div className={`text-[10px] font-black px-4 py-1.5 rounded-full border ${analysis.score < 40 ? 'border-red-500/50 text-red-500' : 'border-[#00ff88]/50 text-[#00ff88]'}`}>
                                            STATUS: {analysis.score < 40 ? 'CRITICAL_VULNERABLE' : 'CORE_IMMUNE'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!analysis && <TerminalLog />}
                        </div>

                        {/* Audit Results */}
                        <div className="lg:col-span-7">
                            {!analysis ? (
                                <div className="h-full glass-card-extreme border-dashed border-white/5 flex flex-col items-center justify-center p-20 text-center opacity-40">
                                    <div className="text-8xl mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000">⚡</div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Awaiting_Signal</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                        Synchronize target vector to begin resistance simulation against global cracking clusters.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                                    <h3 className="text-gray-600 text-[10px] font-black uppercase tracking-[0.6em] mb-6 text-center italic">Crack_Resistance_Projections</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ResistanceCard
                                            label="ONLINE_LIMIT"
                                            sub="THROTTLED_GUESSES"
                                            time={analysis.times.online}
                                            icon="🌐"
                                            safe={analysis.entropy > 40}
                                        />
                                        <ResistanceCard
                                            label="OFFLINE_CORE"
                                            sub="HIGH_END_WORKSTATION"
                                            time={analysis.times.cpu}
                                            icon="💻"
                                            safe={analysis.entropy > 60}
                                        />
                                        <ResistanceCard
                                            label="GPU_ARRAY"
                                            sub="MINING_RIG_FUZZER"
                                            time={analysis.times.gpu}
                                            icon="🎮"
                                            safe={analysis.entropy > 80}
                                        />
                                        <ResistanceCard
                                            label="STATE_CLUSTER"
                                            sub="NEURAL_SUPERCOMPUTER"
                                            time={analysis.times.cluster}
                                            icon="🏢"
                                            safe={analysis.entropy > 100}
                                        />
                                    </div>

                                    <div className="glass-card-extreme p-10 border-white/5 bg-black/40 flex items-center gap-10">
                                        <div className="text-5xl animate-pulse">☣️</div>
                                        <div className="flex-1">
                                            <div className="text-white text-xs font-black uppercase tracking-widest mb-3">Auditor_Guidance</div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose italic">
                                                {analysis.entropy < 50
                                                    ? 'URGENT: VECTOR DEPTH IS INSUFFICIENT. RECOMMENDING 128-BIT ENTROPY ROTATION VIA ENTROPY_FORGE.'
                                                    : 'VECTOR INTEGRITY WITHIN NOMINAL PARAMETERS. SECURE FOR CROSS-NETWORK DEPLOYMENT.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ResistanceCard({ label, sub, time, icon, safe }) {
    return (
        <div className={`glass-card-extreme p-8 cyber-border-extreme group hover:bg-[#00ff88]/5 transition-all duration-300 ${!safe ? 'border-red-500/20' : ''}`}>
            <div className="flex justify-between items-start mb-6">
                <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                <span className={`text-[8px] font-black px-2 py-1 rounded border ${!safe ? 'border-red-500/40 text-red-500' : 'border-[#00ff88]/40 text-[#00ff88]'}`}>
                    {safe ? 'SECURE_NODE' : 'VULNERABLE'}
                </span>
            </div>
            <div className="text-[9px] font-black text-gray-600 mb-1 uppercase tracking-widest">{label}</div>
            <div className={`text-xl font-black italic tracking-tighter mb-4 transition-colors ${!safe ? 'text-red-400' : 'text-white group-hover:text-[#00ff88]'}`}>
                {time}
            </div>
            <div className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">{sub}</div>
        </div>
    );
}
