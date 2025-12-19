"use client";
import { useState, useEffect } from 'react';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default function SystemStatus() {
    const [stats, setStats] = useState({
        cpu: 12,
        ram: 4.2,
        network: 1.2,
        uptime: "00:00:00"
    });

    const formatUptime = (ms) => {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / (1000 * 60)) % 60;
        const hours = Math.floor(ms / (1000 * 60 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            setStats(prev => ({
                cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() > 0.5 ? 2 : -2))),
                ram: Math.max(2, Math.min(16, prev.ram + (Math.random() > 0.5 ? 0.1 : -0.1))),
                network: Math.max(0.1, Math.min(10, prev.network + (Math.random() > 0.5 ? 0.5 : -0.5))),
                uptime: formatUptime(Date.now() - startTime)
            }));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 font-mono shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <h3 className="text-[#00ff88] text-sm font-bold mb-4 tracking-[3px] flex items-center">
                <span className="w-2 h-2 bg-[#00ff88] rounded-full mr-2 animate-pulse"></span>
                LIVE SYSTEM TELEMETRY
            </h3>

            <div className="space-y-4">
                <StatusRow label="CPU UTILIZATION" value={`${stats.cpu}%`} percent={stats.cpu} />
                <StatusRow label="RAM USAGE" value={`${stats.ram.toFixed(1)} GB`} percent={(stats.ram / 16) * 100} />
                <StatusRow label="NETWORK LOAD" value={`${stats.network.toFixed(1)} Gbps`} percent={(stats.network / 10) * 100} />

                <div className="pt-4 border-t border-[#00ff88]/10 flex justify-between items-center text-[10px] text-gray-500 font-bold">
                    <span>UPTIME: {stats.uptime}</span>
                    <span className="text-[#00ff88]">V2.4.0-STABLE</span>
                </div>
            </div>
        </div>
    );
}

function StatusRow({ label, value, percent }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-400 font-bold tracking-wider">
                <span>{label}</span>
                <span className="text-[#00ff88]">{value}</span>
            </div>
            <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#00ff88]/40 to-[#00ff88] transition-all duration-1000 ease-in-out"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}
