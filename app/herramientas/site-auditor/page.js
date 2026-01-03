'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { useDefense } from '../../context/DefenseContext';
import { saveScan } from '../../lib/history';
import CyberHUD from '../../components/CyberHUD';

export default function SiteAuditor() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [systemReady, setSystemReady] = useState(false);

    const runAudit = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setReport(null);
        setStatus('Initializing Deep Scan...');

        const finalReport = {
            target: url,
            headers: { analysis: { score: 0, issues: ["Scan failed"] } },
            dns: [],
            ports: [],
            timestamp: new Date().toLocaleString()
        };

        try {
            const hostname = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
            finalReport.target = hostname;

            setStatus('Analyzing HTTP Security Headers...');
            try {
                const headerRes = await fetch('/api/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });
                const headerData = await headerRes.json();
                if (headerRes.status === 429) {
                    notify('WARNING', 'Rate Limit Exceeded', 'Analizando demasiado rápido. Espera un momento.');
                    throw new Error('Rate limit exceeded');
                }
                if (!headerRes.ok) throw new Error(headerData.error || 'Header Audit failed');
                finalReport.headers = headerData;

                if (headerData.exposedFiles?.length > 0) {
                    notify('ALERT', 'Critical Issues Found', `${headerData.exposedFiles.length} exposed assets detected on target.`);
                }
            } catch (e) {
                console.error("Header audit failed:", e);
                finalReport.headers = {
                    analysis: {
                        score: 0,
                        issues: [`Header analysis failed: ${e.message}`]
                    }
                };
            }

            setStatus('Resolving DNS Records...');
            try {
                const dnsRes = await fetch(`/api/dns?domain=${hostname}`);
                const dnsData = await dnsRes.json();
                finalReport.dns = dnsData.records || [];
            } catch (e) {
                console.error("DNS audit failed:", e);
                finalReport.dns = [{ type: 'ERROR', data: `DNS Lookup failed: ${e.message}` }];
            }

            setStatus('Scanning Attack Surface (Common Ports)...');
            try {
                const portRes = await fetch('/api/port-scan', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        target: hostname,
                        ports: "21,22,80,443,3306,8080"
                    })
                });
                const portData = await portRes.json();
                finalReport.ports = portData.results || [];
            } catch (e) {
                console.error("Port scan failed:", e);
                finalReport.ports = [];
            }

            setReport(finalReport);

            if (user) {
                await saveScan(user.id, 'Site Auditor', hostname, finalReport);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setStatus('');
        }
    };

    const generateMasterPDF = async () => {
        if (!report) return;
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        let y = 20;

        // Background Watermark logic
        doc.setTextColor(240, 240, 240);
        doc.setFontSize(60);
        doc.text("BYTEGUARD VERIFIED", 40, 150, { angle: 45 });

        // Header
        doc.setFontSize(22);
        doc.setTextColor(0, 255, 100);
        doc.text("BYTEGUARD - MASTER SECURITY REPORT", 20, y);
        y += 10;
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("CLASSIFIED INFORMATION - INTERNAL USE ONLY", 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Target: ${report.target} | Generated: ${report.timestamp}`, 20, y);
        y += 20;

        // Content
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("1. HTTP Security Analysis", 20, y);
        y += 10;
        doc.setFontSize(12);
        doc.text(`Security Score: ${report.headers.analysis.score}/100`, 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.text("Issues Found:", 20, y);
        y += 5;
        report.headers.analysis.issues.forEach(issue => {
            doc.setTextColor(200, 0, 0);
            doc.text(`- ${issue}`, 25, y);
            y += 5;
        });
        if (report.headers.analysis.issues.length === 0) {
            doc.setTextColor(0, 150, 0);
            doc.text("- No critical issues found.", 25, y);
            y += 5;
        }
        y += 10;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text("2. Attack Surface (Open Ports)", 20, y);
        y += 10;
        doc.setFontSize(10);
        const openPorts = report.ports.filter(p => p.status === 'open');
        if (openPorts.length > 0) {
            openPorts.forEach(p => {
                doc.text(`- Port ${p.port} (${p.service}): OPEN`, 25, y);
                y += 5;
            });
        } else {
            doc.text("- No common open ports detected (or firewall blocking).", 25, y);
            y += 5;
        }
        y += 10;

        doc.setFontSize(16);
        doc.text("3. Infrastructure (DNS)", 20, y);
        y += 10;
        doc.setFontSize(10);
        report.dns.slice(0, 10).forEach(r => {
            doc.text(`- [${r.type}] ${JSON.stringify(r.address || r.exchange || r.data)}`, 25, y);
            y += 5;
        });

        // Footer & Signature
        y = 270;
        doc.setDrawColor(0, 255, 100);
        doc.line(20, y, 190, y);
        y += 10;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("This report was generated by ByteGuard Sentinel Autonomous Audit Engine.", 20, y);
        y += 5;
        doc.setFontSize(10);
        doc.setTextColor(0, 150, 0);
        doc.text("AUTHENTICATION_HASH (SHA-256): " + Math.random().toString(36).substring(2, 15).toUpperCase(), 20, y);

        doc.save(`byteguard_master_audit_${report.target}.pdf`);
    };

    return (
        <div className="min-h-screen bg-black text-[#cfeed8] font-mono flex relative">
            {!systemReady && <CyberHUD onComplete={() => setSystemReady(true)} />}

            <div className="lightning-bg"></div>
            <Sidebar />

            <main className={`flex-1 p-8 relative overflow-hidden transition-all duration-1000 ${systemReady ? 'opacity-100' : 'opacity-0 scale-95'}`}>
                <div className="laser-line"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <h1 className="text-6xl font-black text-white mb-2 tracking-tighter flex items-center gap-4">
                                <span className="p-3 bg-[#00ff88]/20 rounded-2xl border-2 border-[#00ff88]/50 shadow-[0_0_20px_#00ff88] animate-bounce">🛡️</span>
                                DEEP <span className="text-[#00ff88]">AUDITOR</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                System Core 8.2 // Recon Module Active
                            </div>
                        </div>
                    </div>

                    {/* Input Area Extreme */}
                    <div className="glass-card-extreme p-10 mb-12 cyber-border-extreme group">
                        {loading && <div className="scanner-overlay !bg-white !opacity-40"></div>}
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-black/80 border-2 border-[#00ff88]/20 rounded-2xl p-6 text-white text-xl focus:outline-none focus:border-[#00ff88] transition-all shadow-[inset_0_0_20px_rgba(0,255,136,0.1)] font-black uppercase tracking-widest placeholder:text-gray-700"
                                    placeholder="TARGET DOMAIN_ //"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-[#00ff88]/40 font-bold uppercase">Uplink Active</div>
                            </div>
                            <button
                                onClick={runAudit}
                                disabled={loading}
                                className="btn-floating-extreme min-w-[280px]"
                            >
                                {loading ? 'EXECUTING...' : 'INITIATE ATTACK SURFACE AUDIT'}
                            </button>
                        </div>
                        {loading && (
                            <div className="mt-8">
                                <div className="flex justify-between text-[10px] font-black text-[#00ff88] mb-2 uppercase tracking-[0.2em] animate-pulse">
                                    <span>{status}</span>
                                    <span>Reconnaissance in progress</span>
                                </div>
                                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-[#00ff88]/20 p-0.5">
                                    <div className="h-full bg-gradient-to-r from-[#00ff88] to-white animate-progress-fast rounded-full"></div>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="mt-6 text-red-500 bg-red-500/10 p-5 rounded-2xl border-2 border-red-500/30 text-xs font-black uppercase tracking-widest flex items-center gap-4 animate-shake">
                                <span className="text-2xl">🚫</span>
                                <span>Core Error: {error}</span>
                            </div>
                        )}
                    </div>

                    {/* Results Area Extreme */}
                    {report && (
                        <div className="animate-in zoom-in-95 duration-1000 space-y-12">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-white/5 pb-10">
                                <div>
                                    <div className="text-[10px] font-black text-[#00ff88] mb-2 uppercase tracking-[0.5em]">Target Acquired</div>
                                    <h2 className="text-4xl font-black text-white italic tracking-tighter shadow-text">{report.target}</h2>
                                </div>
                                <button
                                    onClick={generateMasterPDF}
                                    className="btn-floating-extreme !bg-white !text-black !border-none !scale-90"
                                >
                                    📥 EXTRACT INTELLIGENCE PDF
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Header Analysis */}
                                <div className="glass-card-extreme p-8 cyber-border animate-float">
                                    <h3 className="text-[#00ff88] text-[10px] font-black mb-8 flex items-center gap-2 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"></div>
                                        Lvl.1 Security Headers
                                    </h3>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className={`text-7xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] ${report.headers.analysis.score >= 80 ? 'text-[#00ff88]' : report.headers.analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {report.headers.analysis.score}
                                        </div>
                                        <div className="h-12 w-1 bg-white/10 rounded-full"></div>
                                        <div className="text-[10px] text-gray-500 uppercase font-black leading-tight">
                                            Integrity<br />Rating
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-3">
                                        {report.headers.analysis.good?.map((msg, i) => (
                                            <div key={`good-${i}`} className="text-[10px] bg-[#00ff88]/5 p-3 rounded-xl border border-[#00ff88]/10 text-gray-300 flex gap-3">
                                                <span className="text-[#00ff88] font-bold">[V]</span> {msg}
                                            </div>
                                        ))}
                                        {report.headers.analysis.issues?.map((issue, i) => (
                                            <div key={`bad-${i}`} className="text-[10px] bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-red-100 flex gap-3">
                                                <span className="text-red-500 font-bold">[X]</span> {issue}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SSL Widget Extreme */}
                                <div className="glass-card-extreme p-8 cyber-border border-l-4 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                                    <h3 className="text-blue-500 text-[10px] font-black mb-8 flex items-center gap-2 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                                        Encryption Intel
                                    </h3>
                                    {report.headers.ssl ? (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20 text-center">
                                                <div className="text-[9px] text-blue-300 font-black uppercase mb-2 tracking-widest">Encryption Core</div>
                                                <div className={`text-2xl font-black ${report.headers.ssl.daysRemaining > 0 ? 'text-blue-400' : 'text-red-500'}`}>
                                                    {report.headers.ssl.daysRemaining > 0 ? 'ENCRYPTED' : 'UNSECURED'}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-black/60 rounded-2xl border border-white/5">
                                                    <div className="text-[8px] text-gray-600 font-black uppercase mb-1">Time To Expiry</div>
                                                    <div className="text-lg font-black text-white">{report.headers.ssl.daysRemaining}d</div>
                                                </div>
                                                <div className="p-4 bg-black/60 rounded-2xl border border-white/5">
                                                    <div className="text-[8px] text-gray-600 font-black uppercase mb-1">Provider</div>
                                                    <div className="text-[11px] font-black text-blue-200 truncate">{report.headers.ssl.issuer}</div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-400/10 font-mono text-[9px] text-blue-400/80 leading-relaxed uppercase">
                                                CN: {report.headers.ssl.subject}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-48 flex flex-col items-center justify-center text-gray-800 border-2 border-dashed border-gray-900 rounded-3xl">
                                            <span className="text-5xl mb-4 opacity-20">🔓</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">SSL Sync Failed</span>
                                        </div>
                                    )}
                                </div>

                                {/* Attack Surface Widget Extreme */}
                                <div className="glass-card-extreme p-8 cyber-border animate-float" style={{ animationDelay: '0.2s' }}>
                                    <h3 className="text-red-500 text-[10px] font-black mb-8 flex items-center gap-2 uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></div>
                                        Exploitation Vectors
                                    </h3>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="text-7xl font-black italic tracking-tighter text-white">
                                            {report.ports.filter(p => p.status === 'open').length}
                                        </div>
                                        <div className="h-12 w-1 bg-white/10 rounded-full"></div>
                                        <div className="text-[10px] text-gray-600 uppercase font-black leading-tight">
                                            Detected<br />Entry Points
                                        </div>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {report.ports.map((p, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-red-500/30 transition-all">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Port {p.port} {'//'} {p.service}</span>
                                                <span className={`text-[10px] font-black ${p.status === 'open' ? 'text-red-500' : 'text-gray-800'}`}>{p.status.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Critical Exposed Assets Extreme */}
                                {report.headers.exposedFiles && report.headers.exposedFiles.length > 0 && (
                                    <div className="glass-card-extreme p-10 md:col-span-2 lg:col-span-3 border-2 border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.2)] bg-gradient-to-br from-red-950/20 to-black">
                                        <h3 className="text-red-500 text-sm font-black mb-8 flex items-center gap-4 animate-pulse">
                                            <span className="text-3xl">☣️</span>
                                            <span className="tracking-[0.3em]">CRITICAL ASSET EXPOSURE DETECTED</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {report.headers.exposedFiles.map((file, i) => (
                                                <div key={i} className="bg-black p-5 rounded-2xl border-2 border-red-500/20 flex items-center justify-between group hover:border-red-500 transition-all shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                                                    <div className="overflow-hidden">
                                                        <div className="text-xs font-black text-red-100 mb-2 uppercase">{file.name}</div>
                                                        <div className="text-[9px] text-red-500/60 font-mono tracking-tighter truncate">{file.url}</div>
                                                    </div>
                                                    <span className="text-2xl opacity-30 group-hover:opacity-100 transition-opacity animate-bounce">⚠️</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Infrastructure Extreme */}
                                <div className="glass-card-extreme p-8 md:col-span-1 lg:col-span-3 border-t-2 border-[#00ff88]/20">
                                    <h3 className="text-gray-500 text-[9px] font-black mb-8 italic tracking-[1em] uppercase">Network DNA Overlay // DNS Structure</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {report.dns.map((r, i) => (
                                            <div key={i} className="bg-black p-4 rounded-xl border border-white/5 hover:border-[#00ff88]/40 transition-all group">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[#00ff88] font-black text-[9px] uppercase">{r.type}</span>
                                                    <div className="flex-1 h-[1px] bg-white/5 group-hover:bg-[#00ff88]/20"></div>
                                                </div>
                                                <div className="text-[10px] text-gray-500 font-mono truncate">
                                                    {JSON.stringify(r.address || r.exchange || r.data || r).replace(/"/g, '')}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                @keyframes progress-fast {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 100%; }
                }
                .animate-progress-fast {
                    animation: progress-fast 2s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s infinite;
                }
                .shadow-text {
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
