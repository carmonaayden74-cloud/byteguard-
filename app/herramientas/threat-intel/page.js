"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function ThreatIntel() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [attacks, setAttacks] = useState([]);
    const [riskLevel, setRiskLevel] = useState('ELEVATED');

    useEffect(() => {
        const attackTypes = ['DDoS', 'Phishing', 'SQLi', 'BruteForce', 'Trojan', 'Ransomware'];
        const targets = ['USA', 'China', 'Germany', 'Russia', 'Brazil', 'Japan', 'Mexico', 'UK'];

        const interval = setInterval(() => {
            const newAttack = {
                id: Math.random().toString(36).substr(2, 9),
                type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
                origin: targets[Math.floor(Math.random() * targets.length)],
                target: targets[Math.floor(Math.random() * targets.length)],
                severity: Math.random() > 0.8 ? 'CRITICAL' : 'HIGH',
                timestamp: new Date().toLocaleTimeString()
            };
            setAttacks(prev => [newAttack, ...prev].slice(0, 15));

            if (newAttack.severity === 'CRITICAL') {
                notify('WARNING', 'GLOBAL_THREAT', `Critical ${newAttack.type} attack detected targeting ${newAttack.target}`);
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [notify]);

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-30"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                THREAT_<span className="text-[#00ff88]">INTELLIGENCE</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className={`w-2 h-2 rounded-full animate-ping ${riskLevel === 'CRITICAL' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                LIVE_GLOBAL_FEED // RISK_LVL: {riskLevel}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 font-black mb-1 uppercase tracking-widest">Active_Sensors</div>
                            <div className="text-[#00ff88] text-3xl font-black tabular-nums">14,284</div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Map Section */}
                        <div className="lg:col-span-8">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 overflow-hidden relative min-h-[500px] bg-black/40">
                                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-center bg-no-repeat bg-contain"></div>
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/50">
                                    <span className="text-[10px] font-black text-[#00ff88] tracking-widest uppercase">Geospatial_Attack_Heatmap</span>
                                    <span className="text-[8px] text-gray-500 animate-pulse">RECV_UPLINK_ENCRYPTED</span>
                                </div>
                                <div className="p-12 h-full flex items-center justify-center">
                                    <div className="text-center relative">
                                        <div className="text-[150px] opacity-10 grayscale absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl">🌍</div>
                                        <div className="relative z-10 space-y-4">
                                            <div className="text-[10px] font-black text-[#00ff88] animate-pulse">ANALYZING_PACKET_STREAMS...</div>
                                            <div className="text-xs text-gray-600 font-bold max-w-sm">Neural-engine is processing global ASN transitions to identify malicious clusters.</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Animated nodes simulation */}
                                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-red-500 rounded-full animate-ping" style={{ animationDelay: '1.2s' }}></div>
                            </div>
                        </div>

                        {/* Feed Section */}
                        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 flex-1 flex flex-col overflow-hidden max-h-[600px]">
                                <div className="bg-[#00ff88]/5 p-4 border-b border-[#00ff88]/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">Real-time_Events</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-3 bg-[#00ff88] animate-bounce"></div>
                                        <div className="w-1 h-3 bg-[#00ff88] animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 h-3 bg-[#00ff88] animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    <div className="divide-y divide-white/5">
                                        {attacks.map((attack) => (
                                            <div key={attack.id} className="p-4 hover:bg-white/5 transition-colors group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[9px] font-black px-1 rounded ${attack.severity === 'CRITICAL' ? 'bg-red-500 text-black' : 'bg-[#00ff88]/20 text-[#00ff88]'}`}>
                                                        {attack.type}
                                                    </span>
                                                    <span className="text-[8px] text-gray-600">{attack.timestamp}</span>
                                                </div>
                                                <div className="text-[11px] font-bold text-gray-300">
                                                    {attack.origin} <span className="text-[#00ff88]/40">→</span> {attack.target}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card-extreme p-6 border-red-500/20 bg-red-950/10">
                                <div className="text-red-500 text-[10px] font-black uppercase mb-2">High_Alert_Zone</div>
                                <div className="text-[10px] text-gray-500 font-bold leading-relaxed">
                                    Current ransomware activity index is peaking in Northern Europe. Adaptive heuristics recommended for core banking nodes.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
