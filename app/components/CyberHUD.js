'use client';
import { useState, useEffect } from 'react';

const logs = [
    'INITIALIZING NEURAL LINK...',
    'BYPASSING FIREWALLS...',
    'DECRYPTING PACKETS...',
    'SCANNING VULNERABILITIES...',
    'ESTABLISHING SECURE TUNNEL...',
    'SYSTEM READY.'
];

export default function CyberHUD({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('BOOTING SYSTEM...');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        let currentLog = 0;
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setVisible(false);
                        if (onComplete) onComplete();
                    }, 500);
                    return 100;
                }

                // Update text based on progress
                const logIndex = Math.floor((next / 100) * logs.length);
                if (logIndex > currentLog && logIndex < logs.length) {
                    currentLog = logIndex;
                    setStatus(logs[logIndex]);
                }

                return next;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center font-mono overflow-hidden">
            <div className="lightning-bg opacity-30"></div>
            <div className="laser-line"></div>

            <div className="max-w-2xl w-full p-8 relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ff88] animate-pulse"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ff88] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ff88] animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ff88] animate-pulse"></div>

                <div className="mb-8 overflow-hidden">
                    <h2 className="text-[#00ff88] text-4xl font-black mb-2 tracking-tighter animate-glitch">
                        BYTEGUARD<span className="text-white opacity-50">.PROTOCOL</span>
                    </h2>
                    <div className="h-1 w-full bg-[#00ff88]/10 relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#00ff88] shadow-[0_0_15px_#00ff88] transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-[#00ff88]/60 uppercase tracking-widest mb-4">
                        <span>Status: <span className="text-[#00ff88]">{status}</span></span>
                        <span>Load: {Math.floor(progress)}%</span>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 min-h-[100px] flex flex-col justify-end">
                        {logs.slice(0, Math.floor((progress / 100) * logs.length) + 1).map((log, i) => (
                            <div key={i} className="text-[10px] text-gray-500 flex gap-2">
                                <span className="text-[#00ff88]">[OK]</span> {log}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-4 opacity-20">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-[#00ff88]/20 rounded flex items-center justify-center overflow-hidden relative">
                            <div className="scanner-overlay"></div>
                            <div className="text-[8px] text-[#00ff88] font-bold">ARC-0{i + 1}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }
                .animate-glitch {
                    animation: glitch 0.1s infinite;
                    animation-play-state: paused;
                }
                .animate-glitch:hover {
                    animation-play-state: running;
                }
            `}</style>
        </div>
    );
}
