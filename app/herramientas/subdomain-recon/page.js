"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function SubdomainRecon() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [domain, setDomain] = useState('');
    const [scanResults, setScanResults] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    const runRecon = async () => {
        if (!domain) return;
        setScanning(true);
        setScanResults([]);
        setProgress(0);
        notify('INFO', 'RECON_STARTED', `Target: ${domain}`);

        const commonSubdomains = ['admin', 'dev', 'staging', 'api', 'mail', 'test', 'vpn', 'portal', 'internal', 'ftp', 'ssh', 'webmail', 'secure', 'billing', 'support', 'mysql', 'git', 'jenkings', 'gitlab', 'db'];

        for (let i = 0; i < commonSubdomains.length; i++) {
            const sub = commonSubdomains[i];
            setProgress(Math.round(((i + 1) / commonSubdomains.length) * 100));

            // Simulate network latency and discovery
            await new Promise(r => setTimeout(r, 150 + Math.random() * 200));

            // Artificial "discovery" logic
            if (Math.random() > 0.6) {
                const foundSub = {
                    subdomain: `${sub}.${domain}`,
                    ip: `10.0.0.${Math.floor(Math.random() * 254)}`,
                    status: Math.random() > 0.8 ? '403' : '200',
                    tech: i % 3 === 0 ? 'Nginx' : (i % 3 === 1 ? 'Apache' : 'Cloudflare')
                };
                setScanResults(prev => [...prev, foundSub]);
                if (foundSub.status === '200') {
                    notify('SUCCESS', 'NODE_FOUND', `Found active subdomain: ${foundSub.subdomain}`);
                }
            }
        }

        setScanning(false);
        notify('SUCCESS', 'RECON_COMPLETE', `Mapped ${scanResults.length} active nodes for ${domain}`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            SUBDOMAIN_<span className="text-[#00ff88]">RECON</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            ACTIVE_ASSET_ENUMERATION // v4.1.0
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-card-extreme p-6 border-[#00ff88]/20 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
                                <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest">Target_Domain</label>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="example.com"
                                    className="w-full bg-black border-2 border-[#00ff88]/30 rounded-lg p-4 text-white font-bold focus:border-[#00ff88] outline-none transition-all placeholder:text-gray-700"
                                />
                                <button
                                    onClick={runRecon}
                                    disabled={scanning || !domain}
                                    className="w-full mt-6 bg-[#00ff88] text-black font-black py-4 rounded-lg hover:bg-[#00cc6a] transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
                                >
                                    {scanning ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            SCANNING...
                                        </>
                                    ) : (
                                        'INITIATE RECON'
                                    )}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-6 border-white/5">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Engine_Parameters</h3>
                                <div className="space-y-3 text-[10px] font-bold">
                                    <div className="flex justify-between text-gray-400">
                                        <span>THREADS:</span>
                                        <span className="text-[#00ff88]">64_MAX</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>METHOD:</span>
                                        <span className="text-[#00ff88]">PASSIVE_CERT</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>ZONE:</span>
                                        <span className="text-[#00ff88]">GLOBAL</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 overflow-hidden min-h-[500px] flex flex-col">
                                <div className="bg-[#00ff88]/5 p-4 border-b border-[#00ff88]/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black tracking-[0.3em] text-[#00ff88] uppercase">Discovery_Map</span>
                                    <span className="text-[10px] font-bold text-gray-600">{scanning ? `${progress}%` : `${scanResults.length} NODES_ONLINE`}</span>
                                </div>
                                <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                    {scanResults.length === 0 && !scanning ? (
                                        <div className="p-20 text-center opacity-20">
                                            <div className="text-6xl mb-6">🛰️</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-white">Enter target to begin geospatial enumeration</div>
                                        </div>
                                    ) : (
                                        <table className="w-full text-left text-[11px] font-bold">
                                            <thead className="sticky top-0 bg-[#050505] text-gray-500 uppercase border-b border-white/5">
                                                <tr>
                                                    <th className="p-4">SUBDOMAIN</th>
                                                    <th className="p-4">IP_ADDRESS</th>
                                                    <th className="p-4">STATUS</th>
                                                    <th className="p-4">TECH_STACK</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {scanResults.map((res, i) => (
                                                    <tr key={i} className="hover:bg-[#00ff88]/5 transition-colors group">
                                                        <td className="p-4 text-white group-hover:text-[#00ff88]">{res.subdomain}</td>
                                                        <td className="p-4 text-gray-400 font-mono">{res.ip}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2 py-0.5 rounded text-[9px] ${res.status === '200' ? 'bg-[#00ff88]/10 text-[#00ff88]' : 'bg-red-500/10 text-red-500'}`}>
                                                                {res.status}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-gray-500 italic uppercase">{res.tech}</td>
                                                    </tr>
                                                ))}
                                                {scanning && (
                                                    <tr className="animate-pulse">
                                                        <td colSpan="4" className="p-8 text-center text-[10px] text-[#00ff88] tracking-[0.5em]">ANALYZING_DNS_CLUSTER...</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
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
