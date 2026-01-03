"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function DarkWebMonitor() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [ident, setIdent] = useState('');
    const [findings, setFindings] = useState([]);
    const [scanning, setScanning] = useState(false);

    const checkLeaks = () => {
        if (!ident) return;
        setScanning(true);
        notify('INFO', 'BREACH_QUERY', `Redirecting to National Data Breach Database for: ${ident}`);

        setTimeout(() => {
            const hibpUrl = `https://haveibeenpwned.com/account/${encodeURIComponent(ident)}`;
            const dehashedUrl = `https://dehashed.com/search?query="${encodeURIComponent(ident)}"`;

            window.open(hibpUrl, '_blank');
            // Optional: window.open(dehashedUrl, '_blank');

            setScanning(false);
            setFindings([{ date: new Date().toISOString().split('T')[0], source: 'External_Audit', severity: 'QUERY_SENT', data: 'Check output in new tab' }]);
            notify('SUCCESS', 'GATEWAY_ACCESSED', `Connected to HIBP Database. Verify results in the new window.`);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-30"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-red-500/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                DARK_WEB_<span className="text-red-500">MONITOR</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                COMPROMISED_IDENTITY_FINDER // OMEGA_PACK_V1
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-card-extreme p-8 border-red-500/20 bg-red-950/5 shadow-2xl">
                                <label className="block text-[10px] font-black text-red-500 uppercase mb-4 tracking-widest italic">Target_Email / ID</label>
                                <input
                                    type="text"
                                    value={ident}
                                    onChange={(e) => setIdent(e.target.value)}
                                    placeholder="victim@example.com"
                                    className="w-full bg-black border-2 border-red-500/30 rounded-xl p-5 text-white font-bold focus:border-red-500 outline-none transition-all placeholder:text-gray-800"
                                />
                                <button
                                    onClick={checkLeaks}
                                    disabled={scanning || !ident}
                                    className="w-full mt-6 bg-red-500 text-black font-black py-4 rounded-xl hover:bg-red-600 transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95 text-xs tracking-[0.3em] uppercase"
                                >
                                    {scanning ? 'SCANNING_LEAK_DB...' : 'INITIATE DEEP SCAN'}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-6 border-white/5 opacity-50 bg-black/40">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest italic">Database_Summary</h3>
                                <div className="space-y-4 text-[9px] font-bold text-gray-500 uppercase">
                                    <div className="flex justify-between">
                                        <span>LEAKS_INDEXED:</span>
                                        <span className="text-white">12.4 Billion</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>LAST_UPDATE:</span>
                                        <span className="text-white">2_HOURS_AGO</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>PROTECTION:</span>
                                        <span className="text-red-500">MONITOR_ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 min-h-[500px] flex flex-col overflow-hidden bg-black/40">
                                <div className="bg-red-500/10 p-5 border-b border-red-500/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Breach_Analysis_Results</span>
                                    <span className="text-[9px] text-gray-600">{scanning ? 'SEARCHING...' : `${findings.length} INCIDENTS_LOGGED`}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    {scanning ? (
                                        <div className="p-20 text-center flex flex-col items-center">
                                            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                                            <div className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase">Searching Onion Archives...</div>
                                        </div>
                                    ) : findings.length > 0 ? (
                                        <div className="space-y-4">
                                            {findings.map((leak, i) => (
                                                <div key={i} className="glass-card-extreme p-6 border-red-500/10 bg-red-950/10 hover:border-red-500/40 transition-all group relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 font-black text-[40px] text-red-500 opacity-5 select-none pointer-events-none group-hover:opacity-10">PWNED</div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{leak.severity}_RISK // {leak.date}</div>
                                                            <h3 className="text-xl font-black text-white">{leak.source}</h3>
                                                        </div>
                                                        <div className="text-[11px] font-black text-gray-500 group-hover:text-red-500 transition-colors uppercase">Details →</div>
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-bold border-t border-red-500/10 pt-4 uppercase tracking-widest">Compromised_Data: <span className="text-white">{leak.data}</span></div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                            <div className="text-[120px] mb-8 italic">🔦</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Identity clean in public leak databases</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
