'use client';

import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

// Real-world benchmarks (guesses per second)
const BENCHMARKS = {
    online_throttle: 100, // Online attack (throttled)
    offline_cpu: 10_000_000, // High-end CPU (e.g., i9)
    offline_gpu: 100_000_000_000, // High-end GPU (e.g., RTX 4090)
    offline_cluster: 100_000_000_000_000, // GPU Cluster / Supercomputer
};

import { generatePDF } from '../../lib/reports';

export default function PasswordAuditor() {
    const { user } = useAuth();
    const [password, setPassword] = useState('');

    const calculateEntropy = (pwd) => {
        if (!pwd) return 0;
        let pool = 0;
        if (/[a-z]/.test(pwd)) pool += 26;
        if (/[A-Z]/.test(pwd)) pool += 26;
        if (/[0-9]/.test(pwd)) pool += 10;
        if (/[^a-zA-Z0-9]/.test(pwd)) pool += 32;

        return Math.log2(Math.pow(pool, pwd.length));
    };

    const formatTime = (seconds) => {
        if (seconds < 1) return "Instantáneo";
        if (seconds < 60) return `${seconds.toFixed(2)} segundos`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutos`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} horas`;
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} días`;
        if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(1)} años`;
        return "Siglos";
    };

    const analysis = useMemo(() => {
        if (!password) return null;

        const entropy = calculateEntropy(password);
        const combinations = Math.pow(2, entropy);

        return {
            entropy,
            combinations,
            times: {
                online: formatTime(combinations / BENCHMARKS.online_throttle),
                cpu: formatTime(combinations / BENCHMARKS.offline_cpu),
                gpu: formatTime(combinations / BENCHMARKS.offline_gpu),
                cluster: formatTime(combinations / BENCHMARKS.offline_cluster),
            },
            score: Math.min(100, (entropy / 128) * 100) // Rough score
        };
    }, [password]);

    // Save to Database (Debounced)
    useEffect(() => {
        if (!analysis || !user) return;

        const timer = setTimeout(async () => {
            // Only save significant passwords (entropy > 10) to avoid spam
            if (analysis.entropy > 10) {
                await supabase.from('scans').insert([{
                    user_id: user.id,
                    tool_name: 'Password Auditor',
                    target: 'Password Check', // Don't save the actual password for privacy/security
                    results: { entropy: analysis.entropy, score: analysis.score },
                    status: 'completed'
                }]);
            }
        }, 2000); // Wait 2 seconds after typing stops

        return () => clearTimeout(timer);
    }, [analysis, user]);

    const handleExport = () => {
        if (!analysis) return;
        generatePDF('Password Auditor', 'Password Check', analysis);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#00ff88] tracking-tighter">
                        PASSWORD AUDITOR <span className="text-sm text-gray-500 font-normal">REAL-TIME ANALYSIS</span>
                    </h1>
                    {analysis && (
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 flex items-center gap-2"
                        >
                            <span>📄</span> EXPORT REPORT
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                            <label className="block text-sm text-[#00ff88] mb-2">TEST PASSWORD</label>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-[#00ff88]/30 rounded p-4 text-xl text-white focus:outline-none focus:border-[#00ff88] transition-all"
                                placeholder="Type to analyze..."
                            />
                            <p className="text-xs text-gray-500 mt-4">
                                Passwords are analyzed locally in your browser. Nothing is sent to any server.
                            </p>
                        </div>

                        {analysis && (
                            <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6">
                                <h3 className="text-[#00ff88] font-bold mb-4">ENTROPY SCORE</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-bold text-white">{analysis.entropy.toFixed(1)}</span>
                                    <span className="text-gray-500 mb-1">bits</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${analysis.entropy < 40 ? 'bg-red-500' :
                                            analysis.entropy < 80 ? 'bg-yellow-500' :
                                                'bg-[#00ff88]'
                                            }`}
                                        style={{ width: `${Math.min(100, (analysis.entropy / 100) * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {analysis.entropy < 40 ? 'Very Weak: Instantly crackable.' :
                                        analysis.entropy < 60 ? 'Weak: Vulnerable to fast hardware.' :
                                            analysis.entropy < 80 ? 'Strong: Good for most uses.' :
                                                'Excellent: Resistant to state-level attacks.'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {analysis && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6">
                                <h3 className="text-[#00ff88] font-bold mb-6 flex items-center gap-2">
                                    <span>⚡</span> ESTIMATED CRACK TIME
                                </h3>

                                <div className="space-y-6">
                                    <TimeCard
                                        label="ONLINE ATTACK"
                                        sub="Throttled (100 guesses/sec)"
                                        time={analysis.times.online}
                                        icon="🌐"
                                    />
                                    <TimeCard
                                        label="OFFLINE (FAST PC)"
                                        sub="Intel i9 / Ryzen 9"
                                        time={analysis.times.cpu}
                                        icon="💻"
                                    />
                                    <TimeCard
                                        label="OFFLINE (GPU RIG)"
                                        sub="RTX 4090 / Mining Rig"
                                        time={analysis.times.gpu}
                                        icon="🎮"
                                    />
                                    <TimeCard
                                        label="SUPERCOMPUTER"
                                        sub="Massive GPU Cluster"
                                        time={analysis.times.cluster}
                                        icon="🏢"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function TimeCard({ label, sub, time, icon }) {
    const isSafe = time.includes('años') || time.includes('Siglos') || time.includes('días');

    return (
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
                <div className="text-2xl opacity-50">{icon}</div>
                <div>
                    <div className="font-bold text-gray-300">{label}</div>
                    <div className="text-xs text-gray-500">{sub}</div>
                </div>
            </div>
            <div className={`font-mono font-bold ${isSafe ? 'text-[#00ff88]' : 'text-red-400'}`}>
                {time}
            </div>
        </div>
    );
}
