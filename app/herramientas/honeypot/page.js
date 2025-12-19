"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { supabase } from '../../lib/supabase';
import { useDefense } from "../../context/DefenseContext";

export default function HoneypotDashboard() {
    const { notify } = useDefense();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeAlert, setActiveAlert] = useState(false);

    useEffect(() => {
        fetchLogs();

        const channel = supabase
            .channel('honeypot_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'scans', filter: 'tool_name=eq.Honeypot' }, (payload) => {
                setLogs(prev => [payload.new, ...prev]);
                triggerAlert(payload.new);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [triggerAlert]);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('scans')
                .select('*')
                .eq('tool_name', 'Honeypot')
                .order('created_at', { ascending: false })
                .limit(50);

            if (data) setLogs(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const triggerAlert = useCallback((log) => {
        setActiveAlert(true);
        notify('ALERT', 'INTRUSION_DETECTED', `Unauthorized access attempt on ${log.target} from ${log.results?.ip || 'Unknown IP'} `);
        setTimeout(() => setActiveAlert(false), 5000);
    }, [notify]);

    const simulateIntrusion = async () => {
        const paths = ['/wp-admin', '/.env', '/admin/config.php', '/api/v1/debug', '/backup.sql'];
        const randomPath = paths[Math.floor(Math.random() * paths.length)];

        try {
            await fetch('/api/honeypot/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: randomPath,
                    userAgent: navigator.userAgent,
                    ip: '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
                    referrer: 'https://malware-source.ru'
                })
            });
            fetchLogs();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className={`lightning-bg transition-opacity duration-1000 ${activeAlert ? 'opacity-100 !bg-red-950/20' : 'opacity-20'}`}></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className={`laser-line ${activeAlert ? '!bg-red-500 shadow-[0_0_20px_#ef4444]' : ''}`}></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-red-500/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                WEB_<span className="text-red-500">HONEYPOT</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className={`w-2 h-2 rounded-full animate-ping ${activeAlert ? 'bg-red-500' : 'bg-[#00ff88]'}`}></span>
                                {activeAlert ? 'INTRUSION_IN_PROGRESS // CRITICAL' : 'PERIMETER_MONITOR // ACTIVE'}
                            </div>
                        </div>

                        <button
                            onClick={simulateIntrusion}
                            className="btn-futuristic !bg-red-500 !text-black !border-red-500 !py-3 !px-6 !text-[10px] hover:!shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                        >
                            SIMULATE_INTRUSION
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Status Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className={`glass-card-extreme p-8 border-red-500/20 transition-all duration-500 ${activeAlert ? 'shadow-[0_0_50px_rgba(239,68,68,0.2)] scale-105' : ''}`}>
                                <h3 className="text-red-500 text-xs font-black mb-6 tracking-widest uppercase flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${activeAlert ? 'bg-red-500 animate-pulse' : 'bg-red-900'}`}></div>
                                    Network_Trap_Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-gray-500">TRAP_UPTIME:</span>
                                        <span className="text-white">99.98%</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-gray-500">CAPTURE_RATE:</span>
                                        <span className="text-white">{logs.length} HITS / 24H</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-gray-500">DECEPTION_LVL:</span>
                                        <span className="text-red-500">MAXIMUM</span>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card-extreme p-8 border-white/5 opacity-50">
                                <div className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-widest italic">Node_Intelligence:</div>
                                <div className="text-[10px] font-bold text-gray-400 italic leading-relaxed">
                                    The honeypot mimics a vulnerable WordPress instance with exposed .env files and AWS keys to attract automated scanners.
                                </div>
                            </div>

                            <TerminalLog />
                        </div>

                        {/* Logs Area */}
                        <div className="lg:col-span-8">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 overflow-hidden shadow-2xl">
                                <div className="bg-red-950/10 p-6 border-b border-red-500/20 flex justify-between items-center text-[10px] font-black tracking-widest text-red-400 uppercase">
                                    <span>INTRUSION_MANIFEST_LOG</span>
                                    <span className="animate-pulse">REAL-TIME_FEED</span>
                                </div>

                                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {loading ? (
                                        <div className="p-20 text-center">
                                            <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Awaiting_Uplink...</div>
                                        </div>
                                    ) : logs.length === 0 ? (
                                        <div className="p-20 text-center opacity-30">
                                            <div className="text-6xl mb-4 grayscale">🕸️</div>
                                            <div className="text-[10px] font-black text-white uppercase tracking-widest">No captures detected. Perimeter is quiet.</div>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-white/5">
                                            {logs.map((log, idx) => (
                                                <div key={log.id} className={`grid grid-cols-12 p-5 text-[10px] hover:bg-red-500/5 transition-all group items-center ${idx === 0 && activeAlert ? 'bg-red-500/10' : ''}`}>
                                                    <div className="col-span-2 text-gray-600 font-bold font-mono">
                                                        {new Date(log.created_at).toLocaleTimeString()}
                                                    </div>
                                                    <div className="col-span-4">
                                                        <div className="text-white font-black group-hover:text-red-500 transition-colors">{log.target}</div>
                                                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">{log.results?.referrer || 'DIRECT_ENTRY'}</div>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="bg-white/5 px-2 py-1 rounded text-gray-400 font-mono text-[9px] border border-white/5">{log.results?.ip || '0.0.0.0'}</span>
                                                    </div>
                                                    <div className="col-span-4 text-right">
                                                        <span className="text-[8px] font-black text-red-500/60 uppercase group-hover:text-red-500 transition-colors">
                                                            {log.results?.userAgent?.substring(0, 30)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-red-950/10 border border-red-500/20 rounded-2xl flex items-center gap-6">
                                <div className="text-3xl animate-pulse">☢️</div>
                                <div>
                                    <div className="text-red-500 text-[10px] font-black uppercase mb-1">Passive_Countermeasure_Active</div>
                                    <div className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed tracking-wider">
                                        Source IPs are automatically blacklisted after 3 unauthorized hits. Logged data is shared with the ByteGuard threat network.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
