'use client';
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { jsPDF } from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import { useDefense } from '../../context/DefenseContext';
import { saveScan } from '../../lib/history';

export default function NetworkIntel() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    // Heuristic detection of VPN/Proxy services
    const detectProxy = (isp, org) => {
        const keywords = ['vpn', 'hosting', 'datacenter', 'cloud', 'digitalocean', 'aws', 'amazon', 'google cloud', 'azure', 'hetzner', 'ovh', 'linode', 'vultr', 'm247', 'packet', 'leaseweb'];
        const text = `${isp || ''} ${org || ''}`.toLowerCase();

        for (const word of keywords) {
            if (text.includes(word)) {
                return { isSuspicious: true, trigger: word };
            }
        }
        return { isSuspicious: false };
    };

    const fetchIntel = async () => {
        if (!target) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            // Use internal API proxy to avoid CORS issues
            const res = await fetch(`/api/ip-lookup?target=${target}`);
            const json = await res.json();

            if (!res.ok) {
                if (res.status === 404) throw new Error('IP info not found.');
                if (res.status === 429) {
                    notify('WARNING', 'Rate Limit Hit', 'Wait before another IP lookup.');
                    throw new Error('Rate limit exceeded. Please wait.');
                }
                throw new Error(json.error || `Server error: ${res.status}`);
            }

            if (json.status === 'fail') {
                throw new Error(json.message || 'Failed to scan target (Invalid IP or Private IP)');
            }

            // Enriched data with heuristics
            const proxyCheck = detectProxy(json.isp, json.org);
            const enrichedData = { ...json, proxyAnalysis: proxyCheck };
            setData(enrichedData);

            if (enrichedData.proxyAnalysis.isSuspicious) {
                notify('ALERT', 'Possible Proxy Detected', `The ISP ${json.isp} is flagged as suspicious.`);
            }

            // Save to History
            if (user) {
                await saveScan(user.id, 'IP Intel', target, enrichedData);
            }

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch data. Please check the IP address.');
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (!data) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 100, 0);
        doc.text("ByteGuard - IP Intelligence Report", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Target: ${target} | Generated: ${new Date().toLocaleString()}`, 20, 30);

        let y = 50;
        doc.setFontSize(14);
        doc.text("Network Data", 20, y);
        y += 10;
        doc.setFontSize(10);

        const lines = [
            `ISP: ${data.isp}`,
            `Organization: ${data.org}`,
            `ASN: ${data.as}`,
            `Location: ${data.city}, ${data.country}`,
            `Timezone: ${data.timezone}`,
            `Coordinates: ${data.lat}, ${data.lon}`
        ];

        lines.forEach(line => {
            doc.text(line, 20, y);
            y += 7;
        });

        y += 10;
        doc.setFontSize(14);
        doc.text("Security Analysis", 20, y);
        y += 10;
        doc.setFontSize(10);

        if (data.proxyAnalysis?.isSuspicious) {
            doc.setTextColor(200, 0, 0);
            doc.text(`RISK DETECTED: Potential VPN/Proxy usage triggered by keyword "${data.proxyAnalysis.trigger}"`, 20, y);
        } else {
            doc.setTextColor(0, 150, 0);
            doc.text("No proxy/VPN indicators detected (Residential/Business IP).", 20, y);
        }

        doc.save(`ip_intel_${target}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10">
                <div className="laser-line"></div>

                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-end mb-12 border-b border-[#00ff88]/20 pb-8">
                        <div>
                            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
                                IP_<span className="text-[#00ff88]">INTELLIGENCE</span>
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></span>
                                OSINT RECONNAISSANCE MODULE // V4.0
                            </div>
                        </div>
                        {data && (
                            <button onClick={generatePDF} className="btn-futuristic !py-2 !px-6 !text-xs">
                                📄 EXPORT_INTEL_DB
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Search Control */}
                        <div className="lg:col-span-1">
                            <div className="glass-card-extreme p-8 cyber-border-extreme relative group">
                                <div className="absolute top-0 right-0 p-2 text-[8px] text-[#00ff88]/30 font-bold">UPLINK_READY</div>
                                <label className="block text-[10px] font-black text-[#00ff88] mb-4 tracking-widest uppercase">Target Vector</label>
                                <form onSubmit={(e) => { e.preventDefault(); fetchIntel(); }} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            className="w-full bg-black border-2 border-[#00ff88]/20 rounded-xl p-4 text-white text-lg focus:outline-none focus:border-[#00ff88] transition-all font-bold placeholder:text-gray-800"
                                            placeholder="8.8.8.8"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00ff88]/20 font-black">IP</div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full btn-floating-extreme !py-4 !scale-100 hover:!scale-105"
                                    >
                                        {loading ? 'EXECUTING SCAN...' : 'INITIATE IP_RECON'}
                                    </button>
                                </form>
                                <div className="mt-8 pt-6 border-t border-[#00ff88]/10 text-[9px] text-gray-600 leading-relaxed uppercase">
                                    Enriches target data with Geolocation, ISP records, and real-time reputation intelligence.
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-950/20 border-2 border-red-500 text-red-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                                    <span className="text-xl">⚠️</span> {error}
                                </div>
                            )}
                        </div>

                        {/* Results Matrix */}
                        <div className="lg:col-span-2">
                            {data ? (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    {/* Map Integration */}
                                    <div className="glass-card-extreme border-2 border-[#00ff88]/30 rounded-3xl overflow-hidden h-72 relative shadow-[0_0_40px_rgba(0,0,0,0.5)] group">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            scrolling="no"
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.lon - 0.1},${data.lat - 0.1},${data.lon + 0.1},${data.lat + 0.1}&layer=mapnik&marker=${data.lat},${data.lon}`}
                                            className="opacity-60 grayscale brightness-75 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                                        ></iframe>
                                        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-[#00ff88] px-3 py-1 text-[9px] font-black rounded border border-[#00ff88]/30 tracking-[0.2em] z-20">
                                            LIVE_GEO_COORD: {data.lat}, {data.lon}
                                        </div>
                                        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20 z-10"></div>
                                    </div>

                                    {/* Intelligence Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoCard label="Core ISP / AS" value={data.isp} sub={data.as} />
                                        <InfoCard label="Physical Node" value={`${data.city}, ${data.countryCode}`} sub={data.timezone} />

                                        {/* REPUTATION CARD */}
                                        <div className={`col-span-1 md:col-span-2 glass-card-extreme p-8 cyber-border-extreme flex flex-col md:flex-row justify-between items-center gap-8 ${data.reputation?.score > 50 ? 'border-red-500/50' : 'border-[#00ff88]/30'}`}>
                                            <div className="flex-1">
                                                <div className="text-[10px] font-black text-gray-500 mb-4 tracking-[0.3em] uppercase">Threat Intelligence Rating</div>
                                                <div className="flex items-center gap-6">
                                                    <div className={`text-6xl font-black italic tracking-tighter ${data.reputation?.score > 50 ? 'text-red-500' : 'text-[#00ff88]'}`}>
                                                        {data.reputation?.score}
                                                    </div>
                                                    <div className="h-10 w-[2px] bg-white/10"></div>
                                                    <div>
                                                        <div className={`text-xl font-black uppercase tracking-widest ${data.reputation?.score > 50 ? 'text-red-400' : 'text-[#00ff88]'}`}>
                                                            {data.reputation?.threatLevel} RISK
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 font-bold">
                                                            Detected in {data.reputation?.blacklistHits} global blacklists
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-5xl opacity-50 animate-pulse">
                                                {data.reputation?.isMalicious ? '☣️' : '🛡️'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card-extreme p-6 bg-black/40 border-white/5 rounded-2xl">
                                        <div className="text-[9px] text-[#00ff88]/40 font-black mb-4 uppercase tracking-[0.4em]">Raw Data Stream</div>
                                        <pre className="text-[10px] text-[#00ff88]/80 custom-scrollbar overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono italic">
                                            {JSON.stringify(data, null, 4)}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-800 border-2 border-dashed border-white/5 rounded-3xl min-h-[500px] animate-pulse">
                                    <span className="text-7xl mb-6 opacity-10">📡</span>
                                    <span className="text-xs font-black tracking-[1em] uppercase opacity-20">Awaiting Target Selection</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InfoCard({ label, value, sub }) {
    return (
        <div className="glass-card-extreme p-6 border-[#00ff88]/10 hover:border-[#00ff88]/40 transition-all group">
            <div className="text-[9px] text-gray-600 font-black mb-3 uppercase tracking-widest">{label}</div>
            <div className="text-lg font-black text-white truncate group-hover:text-[#00ff88] transition-colors" title={value}>{value}</div>
            {sub && <div className="text-[10px] text-[#00ff88]/60 font-mono mt-1 truncate">{sub}</div>}
        </div>
    );
}

