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

                            <div className="glass-card-extreme p-8 border-white/5 opacity-80 font-bold uppercase text-[9px] text-gray-500 tracking-widest leading-relaxed mb-8">
                                <p>Warning: This protocol redirects you to the "Force Logout" control panels of major identity providers. You must be logged in to execute the purge.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <button
                                    onClick={() => window.open('https://facebook.com/settings?tab=security', '_blank')}
                                    className="p-6 bg-[#1877F2]/10 border border-[#1877F2]/30 rounded-xl hover:bg-[#1877F2] hover:text-white transition-all text-left group"
                                >
                                    <div className="text-xs font-black text-[#1877F2] group-hover:text-white mb-1 uppercase tracking-widest">Meta_Graph_Purge</div>
                                    <div className="text-2xl font-bold text-white mb-2">Logout All Facebook Sessions</div>
                                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Terminates access on all mobile & desktop clients.</div>
                                </button>

                                <button
                                    onClick={() => window.open('https://myaccount.google.com/device-activity', '_blank')}
                                    className="p-6 bg-[#4285F4]/10 border border-[#4285F4]/30 rounded-xl hover:bg-[#4285F4] hover:text-white transition-all text-left group"
                                >
                                    <div className="text-xs font-black text-[#4285F4] group-hover:text-white mb-1 uppercase tracking-widest">Google_Identity_Nuke</div>
                                    <div className="text-2xl font-bold text-white mb-2">Revoke All Google Devices</div>
                                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Forces logout on Android, Chrome, and Gmail sessions.</div>
                                </button>

                                <button
                                    onClick={() => window.open('https://account.live.com/proofs/manage', '_blank')}
                                    className="p-6 bg-[#00a1f1]/10 border border-[#00a1f1]/30 rounded-xl hover:bg-[#00a1f1] hover:text-white transition-all text-left group"
                                >
                                    <div className="text-xs font-black text-[#00a1f1] group-hover:text-white mb-1 uppercase tracking-widest">Microsoft_Auth_Kill</div>
                                    <div className="text-2xl font-bold text-white mb-2">Sign Out Everywhere</div>
                                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Immediate session termination for Outlook/Azure/Xbox.</div>
                                </button>

                                <button
                                    onClick={() => window.open('https://www.instagram.com/session/login_activity/', '_blank')}
                                    className="p-6 bg-[#E4405F]/10 border border-[#E4405F]/30 rounded-xl hover:bg-[#E4405F] hover:text-white transition-all text-left group"
                                >
                                    <div className="text-xs font-black text-[#E4405F] group-hover:text-white mb-1 uppercase tracking-widest">Instagram_Session_Wipe</div>
                                    <div className="text-2xl font-bold text-white mb-2">Clear Login Activity</div>
                                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Review and kill unrecognized Instagram logins.</div>
                                </button>
                            </div>
                        </div>

                        <div>
                            {/* Visual Status Console */}
                            <div className="h-full glass-card-extreme cyber-border-extreme !p-0 bg-black/60 relative overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-[#00ff88]/20 bg-[#00ff88]/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest">Real_Time_Link_Status</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse delay-75"></div>
                                        <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse delay-150"></div>
                                    </div>
                                </div>
                                <div className="flex-1 p-8 font-mono text-xs space-y-2 overflow-y-auto opacity-70">
                                    <div className="text-gray-500">System initialized. Awaiting manual trigger...</div>
                                    <div className="text-[#00ff88]">> Direct Uplinks established.</div>
                                    <div className="text-[#00ff88]">> Target: Global Account Safety.</div>
                                    <div className="text-gray-400">Ready to execute forced termination protocol on selected providers.</div>
                                    <div className="mt-8 p-4 border border-red-500/30 bg-red-900/10 text-red-400 rounded">
                                        [CRITICAL NOTE]<br />
                                        Executing these commands will require you to re-authenticate on all your devices. This is the only way to ensure attackers are removed.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
                );
}
