'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalScans: 0,
        recentScans: [],
        threats: [],
        incidents: [], // NEW
        healthScore: 0,
        favoriteTools: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserStats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const loadUserStats = async () => {
        try {
            // Get total scans count
            const { count } = await supabase
                .from('scans')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            // Get recent scans
            const { data: recentScans } = await supabase
                .from('scans')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);

            // Fetch Live Threat Feed & Incidents
            const [threatRes, incidentRes] = await Promise.all([
                fetch('/api/threat-feed'),
                fetch(`/api/incidents?userId=${user.id}`)
            ]);

            const threatData = await threatRes.json();
            const incidentData = await incidentRes.json();

            setStats({
                totalScans: count || 0,
                recentScans: recentScans || [],
                threats: threatData.threats || [],
                incidents: incidentData.incidents || [], // NEW
                healthScore: count > 10 ? 98 : count > 5 ? 85 : 65,
                favoriteTools: ['Site Auditor', 'Link Forensics', 'IP Intel']
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="glass-card p-10 rounded-2xl text-center max-w-md">
                    <h2 className="text-3xl font-black text-[#00ff88] mb-4 tracking-tighter uppercase">ByteGuard Protocol</h2>
                    <p className="text-gray-400 mb-6 font-mono text-sm uppercase tracking-widest">Authentication Required for Tool Access</p>
                    <Link href="/login" className="btn-futuristic rounded-xl w-full">
                        INITIALIZE SESSION
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden">
            {/* Extreme Visuals */}
            <div className="lightning-bg"></div>
            <div className="laser-line"></div>

            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter uppercase drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">
                            COMMAND <span className="text-[#00ff88]">CENTER</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-3 h-3 bg-[#00ff88] rounded-full animate-ping"></span>
                            OPERATOR_ [ {user.email} ] // CORE ACTIVE
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={loadUserStats} className="btn-floating-extreme !p-4 !rounded-2xl">
                            🔄 REFRESH_SYSTEM
                        </button>
                    </div>
                </div>

                {/* SOC Health & Global Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard
                        icon="🏢"
                        title="Corporate Risk"
                        value={stats.healthScore >= 90 ? 'SAFE' : 'ATTACKED'}
                        subtitle="Entity Security Posture"
                        isGlow
                    />
                    <StatCard
                        icon="☣️"
                        title="Active Breach"
                        value={stats.incidents.length}
                        subtitle="Unresolved SOC Alerts"
                        isWarning={stats.incidents.length > 0}
                    />
                    <StatCard
                        icon="📡"
                        title="Scanning Nodes"
                        value="1,248"
                        subtitle="Global Threat Sensors"
                    />
                    <StatCard
                        icon="📈"
                        title="Compliance"
                        value="99.4%"
                        subtitle="ISO/SOC2 Readiness"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* ACTIVITY LOG EXTREME */}
                        <div className="glass-card-extreme p-8 cyber-border-extreme">
                            <h2 className="text-xs font-black text-[#00ff88] mb-8 flex items-center gap-3 uppercase tracking-[0.4em]">
                                <span className="w-2 h-8 bg-[#00ff88] rounded-full shadow-[0_0_15px_#00ff88]"></span>
                                MISSION ACTIVITY_LOG
                            </h2>
                            {loading ? (
                                <div className="text-[#00ff88] text-[10px] uppercase tracking-[0.5em] text-center py-20 italic animate-pulse">Establishing uplink...</div>
                            ) : stats.recentScans.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentScans.map((scan, idx) => (
                                        <div key={idx} className="bg-white/5 p-5 rounded-2xl border-2 border-white/5 hover:border-[#00ff88]/40 transition-all group flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[#00ff88]/10 flex items-center justify-center text-xl group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                                                    ⚡
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm text-white uppercase tracking-wider mb-1 group-hover:text-[#00ff88] transition-colors">{scan.tool_name}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">TARGET: {scan.target}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-[9px] font-black px-3 py-1 rounded-full border-2 ${scan.status === 'completed' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'} uppercase tracking-widest`}>
                                                    {scan.status}
                                                </div>
                                                <div className="text-[9px] text-gray-600 mt-2 font-mono">{new Date(scan.created_at).toLocaleTimeString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-800 text-[10px] uppercase tracking-[0.5em] text-center py-20 italic">
                                    SYSTEM_IDLE // NO LOG DATA
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* INCIDENT CENTER EXTREME */}
                            <div className="glass-card-extreme p-8 border-l-8 border-red-600 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                                <h2 className="text-sm font-black text-red-500 mb-8 flex items-center gap-3 uppercase tracking-[0.3em] animate-pulse">
                                    <span className="text-2xl">🚨</span> SOC // INTERCEPTED
                                </h2>
                                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                                    {stats.incidents.length > 0 ? (
                                        stats.incidents.map((incident, i) => (
                                            <div key={i} className="bg-red-950/20 border-2 border-red-500/10 p-4 rounded-2xl hover:bg-red-900/40 transition-all group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs font-black text-red-200 uppercase group-hover:text-white">{incident.title}</span>
                                                    <span className="text-[8px] text-red-500/50 font-mono font-bold tracking-widest">{new Date(incident.created_at).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-mono leading-relaxed line-clamp-2 uppercase tracking-tighter">{incident.description}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-gray-800 italic font-black text-center py-12 uppercase tracking-[0.2em]">Zero Threats Logged.</div>
                                    )}
                                </div>
                            </div>

                            {/* THREAT INTEL EXTREME */}
                            <div className="glass-card-extreme p-8 cyber-border">
                                <h2 className="text-sm font-black text-orange-500 mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                                    <span className="text-2xl">📡</span> UPLINK_FEED
                                </h2>
                                <div className="space-y-4">
                                    {stats.threats.length > 0 ? (
                                        stats.threats.map(t => (
                                            <ThreatItem key={t.id} severity={t.severity} title={t.title} date={t.date} />
                                        ))
                                    ) : (
                                        <div className="text-[10px] text-gray-800 italic font-black text-center py-12 uppercase tracking-[0.2em]">Syncing Feed...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* QUICK ACCESS EXTREME */}
                        <div className="glass-card-extreme p-8 cyber-border-extreme">
                            <h2 className="text-sm font-black text-[#00ff88] mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <span className="p-2 bg-[#00ff88]/20 rounded-xl shadow-[0_0_10px_#00ff88]">⚡</span> FAST_EXEC
                            </h2>
                            <div className="space-y-4">
                                <QuickAccessTool icon="🌐" name="Site Auditor" details="SSL_ INTEL & SURFACE" href="/herramientas/site-auditor" />
                                <QuickAccessTool icon="🔎" name="Link Forensics" details="PHISHING_ DECRYPT" href="/herramientas/phishing" />
                                <QuickAccessTool icon="🔐" name="Data Leak" details="BREACH_ ANALYZER" href="/herramientas/data-leak" />
                                <QuickAccessTool icon="🛰️" name="IP Intel" details="PROXY_ TRACKER" href="/herramientas/ip-intel" />
                            </div>
                        </div>

                        {/* DAILY INTEL EXTREME */}
                        <div className="glass-card-extreme p-8 border-t-4 border-[#00ff88] bg-gradient-to-br from-black to-[#00ff88]/10 animate-pulse">
                            <h3 className="text-xs font-black text-[#00ff88] mb-6 flex items-center gap-3 uppercase tracking-widest">
                                <span className="text-xl">☣️</span> OPERATIONAL_BRIEF
                            </h3>
                            <p className="text-xs text-gray-300 leading-relaxed font-black uppercase tracking-[0.1em] italic">
                                STATUS: <span className="text-white">OPTIMAL</span>.
                                SECURITY_CORE IS RUNNING AT <span className="text-[#00ff88]">98.2%</span> EFFICIENCY.
                                MONITOR SYSTEM_LOGS FOR ANY <span className="text-red-500 underline">SOC DISCREPANCIES</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThreatItem({ severity, title, date }) {
    const colors = {
        CRITICAL: 'text-red-500 border-red-500/40 bg-red-500/10',
        HIGH: 'text-orange-500 border-orange-500/40 bg-orange-500/10',
        MEDIUM: 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10'
    };
    const colorClass = colors[severity] || colors.MEDIUM;

    return (
        <div className="flex flex-col gap-2 p-4 border-2 border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
            <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border-2 uppercase tracking-widest ${colorClass}`}>
                    {severity}
                </span>
                <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{date}</span>
            </div>
            <span className="text-xs text-gray-300 font-bold uppercase tracking-tight group-hover:text-white transition-colors">{title}</span>
        </div>
    );
}

function StatCard({ icon, title, value, subtitle, isGlow, isWarning }) {
    return (
        <div className={`glass-card-extreme p-8 rounded-3xl transition-all group hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${isGlow ? 'cyber-border-extreme shadow-[0_0_40px_rgba(0,255,136,0.1)]' :
                isWarning && value > 0 ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : ''
            }`}>
            <div className={`text-4xl mb-6 p-3 bg-white/5 rounded-2xl w-fit group-hover:scale-125 transition-all duration-500 ${isWarning && value > 0 ? 'bg-red-500/20 text-red-500' : 'group-hover:bg-[#00ff88]/20'
                }`}>{icon}</div>
            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2">{title}</div>
            <div className={`text-5xl font-black italic tracking-tighter mb-2 ${isGlow ? 'text-[#00ff88] drop-shadow-[0_0_20px_#00ff88]' :
                    isWarning && value > 0 ? 'text-red-500 drop-shadow-[0_0_20px_#ef4444]' : 'text-white'
                }`}>{value}</div>
            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.1em]">{subtitle}</div>
        </div>
    );
}

function QuickAccessTool({ icon, name, details, href }) {
    return (
        <Link href={href} className="group relative block">
            <div className="flex items-center gap-6 p-5 rounded-2xl bg-black/40 border-2 border-white/5 hover:border-[#00ff88] hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00ff88] -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                <div className="text-4xl group-hover:scale-125 transition-transform duration-500 transform-gpu">{icon}</div>
                <div>
                    <div className="font-black text-sm text-white uppercase tracking-[0.2em] group-hover:text-[#00ff88] transition-colors">{name}</div>
                    <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mt-1">{details}</div>
                </div>
            </div>
        </Link>
    );
}

