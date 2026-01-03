'use client';

import { useEffect } from 'react';

export default function TrapPage() {
    useEffect(() => {
        // Log the intruder
        fetch('/api/honeypot/log', {
            method: 'POST',
            body: JSON.stringify({
                path: '/wp-admin',
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        });
    }, []);

    return (
        <div className="min-h-screen bg-[#050000] flex items-center justify-center text-red-500 font-mono relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#ff0000_0%,_transparent_70%)] animate-pulse"></div>
            <div className="scanner-overlay opacity-30"></div>

            <div className="max-w-xl w-full p-10 glass-card-extreme border-2 border-red-500/50 relative z-10 text-center animate-in zoom-in duration-300">
                <div className="text-8xl mb-6">🚫</div>
                <h1 className="text-5xl font-black tracking-tighter mb-4 text-white">
                    INTRUSION_<span className="text-red-600">LOCKED</span>
                </h1>

                <div className="bg-red-950/20 p-4 rounded-lg border border-red-500/20 mb-8 text-left space-y-2 text-[12px]">
                    <div className="flex justify-between border-b border-red-500/10 pb-1">
                        <span className="text-red-500/50 uppercase">Anomaly_Detect</span>
                        <span className="text-white font-bold">Unauthorized_Admin_Access</span>
                    </div>
                    <div className="flex justify-between border-b border-red-500/10 pb-1">
                        <span className="text-red-500/50 uppercase">Trace_Protocol</span>
                        <span className="text-white font-bold italic">Active_Logging_Enabled</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-red-500/50 uppercase">Counter_Measure</span>
                        <span className="text-white font-bold">IP_Blacklist_Propagation</span>
                    </div>
                </div>

                <div className="text-white/40 text-[10px] uppercase tracking-[0.5em] mb-4">
                    ByteGuard Sentinel v4.0.2
                </div>

                <div className="h-1 w-full bg-red-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 animate-[loading_2s_infinite]"></div>
                </div>

                <p className="mt-8 text-sm text-red-400 font-bold">
                    [SYSTEM_ADVISORY]: Persistent attempts will result in automated escalation to relevant authorities.
                </p>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { width: 0%; transform: translateX(-100%); }
                    100% { width: 100%; transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
