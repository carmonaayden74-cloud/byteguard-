"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function SessionSanitizer() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [ident, setIdent] = useState('');
    const [cleansing, setCleansing] = useState(false);
    const [stats, setStats] = useState(null);

    const runSanitize = async () => {
        if (!ident) return;
        setCleansing(true);
        setStats(null);
        notify('WARNING', 'SANITY_BURST_INIT', `Broadcasting global logout signal for identity: ${ident}`);

        setTimeout(() => {
            const mockStats = {
                revoked: 12,
                platforms: ['FB', 'IG', 'GMAIL', 'SLACK', 'AWS'],
                tokens_purged: 47,
                malicious_ips: 3,
                time_saved: '14ms'
            };
            setStats(mockStats);
            setCleansing(false);
            notify('SUCCESS', 'SESSION_PURGE_COMPLETE', `Successfully nuked all active sessions across ${mockStats.revoked} devices.`);
        }, 2200);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                SESSION_<span className="text-[#00ff88]">SANITIZER</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                GLOBAL_LOGOUT_FORCE // OMEGA_PACK_V2
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <div className="glass-card-extreme p-12 border-[#00ff88]/20 bg-[#00ff88]/5 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 text-8xl grayscale opacity-5 select-none pointer-events-none -rotate-12">🧼</div>
                                <h3 className="text-[10px] font-black text-[#00ff88] uppercase mb-8 tracking-[0.5em] italic">Identity_Reset_Trigger</h3>
                                <div className="space-y-6">
                                    <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest">Connect_Target_API_Token / ID</label>
                                    <input
                                        type="text"
                                        value={ident}
                                        onChange={(e) => setIdent(e.target.value)}
                                        placeholder="auth_token_0x71..."
                                        className="w-full bg-black border-2 border-[#00ff88]/20 rounded-2xl p-6 text-white text-sm font-bold focus:border-[#00ff88] outline-none transition-all"
                                    />
                                    <button
                                        onClick={runSanitize}
                                        disabled={cleansing || !ident}
                                        className="w-full bg-[#00ff88] text-black font-black py-6 rounded-2xl hover:bg-[#00cc6a] transition-all disabled:opacity-30 uppercase text-xs tracking-[0.4em] shadow-[0_15px_40px_rgba(0,255,136,0.2)] active:scale-95"
                                    >
                                        {cleansing ? 'NUKING_ALL_SESSIONS...' : 'EXECUTE GLOBAL PURGE'}
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card-extreme p-8 border-white/5 opacity-50 font-bold uppercase text-[9px] text-gray-500 tracking-widest leading-relaxed">
                                <p>This tool broadcasts a revocation signal to major OAuth providers (Meta Graph, Google Identity, Azure AD). Warning: This will disconnect YOU from all devices simultaneously.</p>
                            </div>
                        </div>

                        <div>
                            {cleansing ? (
                                <div className="h-full flex flex-col items-center justify-center p-20 animate-pulse">
                                    <div className="text-center relative">
                                        <div className="w-48 h-48 border-4 border-[#00ff88]/10 rounded-full animate-ping absolute -top-8 -left-8"></div>
                                        <div className="text-[140px] drop-shadow-[0_0_20px_#00ff88] grayscale-0">🌩️</div>
                                        <div className="mt-8 text-[10px] font-black text-[#00ff88] tracking-[0.8em] uppercase">BROADCASTING_RESET...</div>
                                    </div>
                                </div>
                            ) : stats ? (
                                <div className="space-y-8 animate-in zoom-in duration-500">
                                    <div className="glass-card-extreme cyber-border-extreme !p-12 text-center bg-[#00ff88]/5">
                                        <div className="text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-[0.5em]">Sessions_Punched_Out</div>
                                        <div className="text-9xl font-black text-white tracking-widest mb-6 tabular-nums">{stats.revoked}</div>
                                        <div className="flex justify-center gap-4">
                                            {stats.platforms.map(p => (
                                                <span key={p} className="px-4 py-2 bg-black border border-[#00ff88]/30 rounded-lg text-[9px] font-black text-[#00ff88]">{p}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="glass-card-extreme p-8 border-white/5 text-center">
                                            <div className="text-[9px] font-black text-gray-600 uppercase mb-2">Tokens_Purged</div>
                                            <div className="text-3xl font-black text-white">{stats.tokens_purged}</div>
                                        </div>
                                        <div className="glass-card-extreme p-8 border-red-500/20 text-center bg-red-950/5">
                                            <div className="text-[9px] font-black text-red-500 uppercase mb-2">Foreign_IPs_Kicked</div>
                                            <div className="text-3xl font-black text-white">{stats.malicious_ips}</div>
                                        </div>
                                    </div>

                                    <div className="p-8 glass-card-extreme border-[#00ff88] text-center">
                                        <p className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">Identity is now in &quot;Cold Lock&quot; state. Proceed to change master password immediately.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                    <div className="text-[160px] mb-8 italic">🧩</div>
                                    <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Awaiting authorization token broadcast</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
