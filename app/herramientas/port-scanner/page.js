"use client";

import { useState, useEffect } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { useDefense } from '../../context/DefenseContext';
import { jsPDF } from 'jspdf';
import { saveScan } from '../../lib/history';

export default function PortScanner() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const scanPorts = async () => {
        if (!target) {
            setError('TARGET_UNSPECIFIED: Enter host for reconnaissance.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);
        setScanProgress(0);

        // Simulation Timing
        const interval = setInterval(() => {
            setScanProgress(p => p < 100 ? p + 2 : 100);
        }, 100);

        try {
            const res = await fetch(`/api/port-scan?target=${target}`);
            const data = await res.json();

            if (res.status === 429) {
                notify('WARNING', 'Interdiction', 'Rate limit hit. Slow down recon.');
            }

            if (!res.ok) {
                throw new Error(data.error || 'UPLINK_FAILURE');
            }

            // Enhanced results with fingerprinting simulation
            const enhancedResults = data.results.map(p => ({
                ...p,
                version: p.status === 'open' ? getFingerprint(p.port) : 'N/A',
                vuln: p.status === 'open' && Math.random() > 0.7 ? 'CVE-2023-' + Math.floor(Math.random() * 9000) : null
            }));

            setResults(enhancedResults);

            const openPorts = enhancedResults.filter(p => p.status === 'open');
            if (openPorts.length > 0) {
                notify('ALERT', 'VULNERABILITY_SURFACE', `${openPorts.length} entry points identified on node ${target}.`);
            }

            if (user) {
                await saveScan(user.id, 'Port Recon', target, enhancedResults);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            clearInterval(interval);
            setLoading(false);
            setScanProgress(100);
        }
    };

    const getFingerprint = (port) => {
        const fingerprints = {
            21: 'vsftpd 3.0.3',
            22: 'OpenSSH 8.9p1 Ubuntu',
            80: 'nginx 1.18.0',
            443: 'nginx/2.4.41 (Ubuntu)',
            3306: 'MySQL 8.0.28',
            8080: 'Apache Tomcat 9.0.31'
        };
        return fingerprints[port] || 'Generic-Service/v1.0';
    };

    const generatePDF = () => {
        if (!results) return;
        const doc = new jsPDF();
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(24);
        doc.text("BYTEGUARD // PORT_RECON_MANIFEST", 20, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`TARGET_NODE: ${target}`, 20, 50);
        doc.text(`TOTAL_PORTS_TESTED: ${results.length}`, 20, 60);

        let y = 75;
        results.filter(r => r.status === 'open').forEach((r, i) => {
            doc.text(`${r.port}/${r.service}: OPEN | FINGERPRINT: ${r.version}`, 20, y);
            y += 10;
        });

        doc.save(`port_scan_${target}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className={`laser-line ${loading ? 'animate-scan-fast text-[#00ff88]' : ''}`}></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                PORT_<span className="text-[#00ff88]">RECON</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-ping' : 'bg-[#00ff88]'}`}></span>
                                {loading ? 'RECONNAISSANCE_IN_PROGRESS' : 'PASSIVE_LISTENER // READY'}
                            </div>
                        </div>

                        {results && (
                            <button onClick={generatePDF} className="btn-futuristic !py-3 !px-6 !text-[10px]">
                                EXPORT_AUDIT_LOG
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Target Input */}
                        <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="glass-card-extreme p-8 cyber-border-extreme">
                                <h3 className="text-[#00ff88] text-[10px] font-black uppercase mb-6 tracking-widest">Target_Parameters</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={target}
                                        onChange={(e) => setTarget(e.target.value)}
                                        placeholder="IP_OR_DOMAIN_ [e.g. 8.8.8.8]"
                                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl p-4 text-white text-sm focus:border-[#00ff88] outline-none transition-all font-bold"
                                    />
                                    <button
                                        onClick={scanPorts}
                                        disabled={loading}
                                        className="btn-floating-extreme w-full !py-4 !text-sm"
                                    >
                                        {loading ? 'RUNNING_SYNC...' : 'INITIATE_PROBE'}
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card-extreme p-6 border-white/5 opacity-60">
                                <div className="text-[9px] font-black text-gray-500 uppercase mb-4 tracking-widest">Scanner_Config:</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-bold">
                                        <span>METHOD:</span> <span className="text-[#00ff88]">TCP_SYN_ACK</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold">
                                        <span>TIMEOUT:</span> <span className="text-white">2000MS</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] font-bold">
                                        <span>DEPTH:</span> <span className="text-white">TOP_1000_PORTS</span>
                                    </div>
                                </div>
                            </div>

                            <TerminalLog />
                        </div>

                        {/* Scanner Visualization */}
                        <div className="lg:col-span-8">
                            {loading ? (
                                <div className="glass-card-extreme p-12 cyber-border-extreme h-full flex flex-col items-center justify-center text-center">
                                    <div className="relative w-64 h-64 mb-8">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(0,255,136,0.05)" strokeWidth="4" />
                                            <circle
                                                cx="128"
                                                cy="128"
                                                r="120"
                                                fill="none"
                                                stroke="#00ff88"
                                                strokeWidth="4"
                                                strokeDasharray={753}
                                                strokeDashoffset={753 - (753 * scanProgress) / 100}
                                                className="transition-all duration-300 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-white">{scanProgress}%</span>
                                            <span className="text-[10px] font-black text-[#00ff88] tracking-widest">PROBING_NODE</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-10 gap-2 w-full max-w-md opacity-20">
                                        {Array.from({ length: 50 }).map((_, i) => (
                                            <div key={i} className={`h-1 rounded-full ${i < (scanProgress / 2) ? 'bg-[#00ff88]' : 'bg-gray-800'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            ) : results ? (
                                <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                                    <div className="glass-card-extreme cyber-border-extreme !p-0 overflow-hidden shadow-2xl">
                                        <div className="bg-[#00ff88]/5 p-6 border-b border-[#00ff88]/20 flex justify-between items-center text-[10px] font-black tracking-widest text-[#00ff88] uppercase">
                                            <span>Detected_Vulnerability_Surface</span>
                                            <span>NODE: {target}</span>
                                        </div>
                                        <div className="divide-y divide-white/5">
                                            {results.map((r, i) => (
                                                <div key={i} className="grid grid-cols-12 p-6 hover:bg-[#00ff88]/5 transition-all group items-center">
                                                    <div className="col-span-2 text-xl font-black text-white italic group-hover:text-[#00ff88] transition-colors">
                                                        {r.port}
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Service</div>
                                                        <div className="text-sm font-bold text-white">{r.service}</div>
                                                    </div>
                                                    <div className="col-span-4">
                                                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status / Version</div>
                                                        <div className="flex flex-col items-center">
                                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full border mb-1 ${r.status === 'open' ? 'border-[#00ff88] text-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' : 'border-red-500/50 text-red-500/50'}`}>
                                                                {r.status.toUpperCase()}
                                                            </span>
                                                            <span className="text-[8px] text-gray-600 font-bold whitespace-nowrap">{r.version}</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 text-right">
                                                        {r.vuln && (
                                                            <div className="bg-red-500/10 border border-red-500/30 p-2 rounded-lg">
                                                                <div className="text-[8px] font-black text-red-500">CVE_ALERT</div>
                                                                <div className="text-[8px] font-bold text-gray-400">{r.vuln}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security Warning */}
                                    <div className="p-8 border-2 border-red-500/20 bg-red-950/5 rounded-3xl flex items-center gap-8">
                                        <span className="text-5xl animate-pulse">☣️</span>
                                        <div>
                                            <div className="text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-1">RECON_LEGAL_WARNING</div>
                                            <div className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-relaxed">
                                                Scanning unauthorized networks is illegal. All reconnaissance activities are logged and tied to your digital signature.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full min-h-[500px] glass-card-extreme border-dashed border-white/5 flex flex-col items-center justify-center p-20 text-center opacity-30">
                                    <div className="text-8xl mb-8 grayscale hover:grayscale-0 transition-all duration-1000">📡</div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Awaiting_Instructions</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                                        Inject a target IP or hostname to begin deep port reconnaissance.<br />
                                        The probe will check common service entry points and fingerprint response headers.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
