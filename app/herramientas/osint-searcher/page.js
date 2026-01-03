"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function OSINTSearcher() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    const performOSINT = () => {
        if (!query) return;
        setSearching(true);
        setResults([]);
        notify('INFO', 'OSINT_UPLINK', `Aggregating public records for: ${query}`);

        setTimeout(() => {
            const mockRecords = [
                { source: 'Social_Graph', type: 'LinkedIn', detail: 'Found profile matching "Security Analyst"', link: 'https://linkedin.com/...' },
                { source: 'Domain_Whois', type: 'Registry', detail: 'Associated email: h****@gmail.com', link: '#' },
                { source: 'Public_Records', type: 'Government', detail: 'Likely location: Florida, USA', link: '#' },
                { source: 'Data_Leaks', type: 'Archive', detail: 'Presence in 2021 Adobe Breach', link: '#' },
                { source: 'Github_Scan', type: 'Code', detail: 'Active contributor in 4 secure repos', link: 'https://github.com/...' }
            ];

            setResults(mockRecords);
            setSearching(false);
            notify('SUCCESS', 'OSINT_COMPLETE', `Retrieved ${mockRecords.length} intelligence nodes for ${query}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-10"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                OSINT_<span className="text-[#00ff88]">SEARCHER</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                IDENTITY_EXPLORATION_LAB // OMEGA_PACK_V1
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 bg-[#00ff88]/5 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                                <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest italic">Input_Subject_Name / Alias</label>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="John Doe / @johndoe"
                                    className="w-full bg-black border-2 border-[#00ff88]/30 rounded-xl p-5 text-white font-bold focus:border-[#00ff88] outline-none transition-all placeholder:text-gray-800"
                                />
                                <button
                                    onClick={performOSINT}
                                    disabled={searching || !query}
                                    className="w-full mt-6 bg-[#00ff88] text-black font-black py-4 rounded-xl hover:bg-[#00cc6a] transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95 text-xs tracking-[0.3em] uppercase"
                                >
                                    {searching ? 'QUERYING_NODES...' : 'EXECUTE SEARCH'}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-6 border-white/5 opacity-50">
                                <h3 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest italic">Active_Engines</h3>
                                <div className="grid grid-cols-2 gap-2 text-[8px] font-bold text-gray-400">
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>GOOGLE_DORK</div>
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>SOCIAL_SCRAPER</div>
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>WHOIS_API</div>
                                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>LEAK_ARCHIVE</div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 min-h-[500px] flex flex-col overflow-hidden bg-black/40">
                                <div className="bg-black/80 p-5 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest italic">Intelligence_Output</span>
                                    <span className="text-[9px] text-gray-600">{searching ? 'SCANNING...' : `${results.length} NODES_FOUND`}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {searching ? (
                                        <div className="p-20 text-center animate-pulse">
                                            <div className="text-6xl mb-6">🔍</div>
                                            <div className="text-[10px] font-black tracking-[0.5em] text-[#00ff88] uppercase">Traversing_Digital_Lake...</div>
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="divide-y divide-white/5 p-4 space-y-4">
                                            {results.map((res, i) => (
                                                <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-[#00ff88]/30 transition-all flex justify-between items-center group">
                                                    <div className="flex gap-6 items-center">
                                                        <div className="w-12 h-12 bg-[#00ff88]/10 rounded-full flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all">📂</div>
                                                        <div>
                                                            <div className="text-[9px] font-black text-[#00ff88] uppercase tracking-widest mb-1">{res.source} :: {res.type}</div>
                                                            <div className="text-sm font-bold text-gray-200">{res.detail}</div>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-black text-gray-600 hover:text-[#00ff88] uppercase tracking-widest transition-colors">Verify_Link →</button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                            <div className="text-[120px] mb-8 italic">👤</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase text-center">No active subject being tracked</div>
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
