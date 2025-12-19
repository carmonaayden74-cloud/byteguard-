"use client";

import { useState } from "react";
import { Sidebar } from "../../components/DashboardComponents";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { useDefense } from "../../context/DefenseContext";
import { saveScan } from "../../lib/history";

export default function PhishingDetectorPage() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeLink = async (e) => {
        if (e) e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/link-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (res.status === 429) {
                notify('WARNING', 'System Throttled', 'Analyzing too many vectors. Wait for uplink cooling.');
            }

            if (!res.ok) {
                throw new Error(data.details || "UPLINK_TIMEOUT");
            }

            setResult(data);

            if (data.analysis.riskScore > 70) {
                notify('ALERT', 'CRITICAL_RISK_DETECTED', `Vector scored ${data.analysis.riskScore}% danger rating.`);
            }

            if (user) {
                await saveScan(user.id, 'Phishing Audit', url, data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        // Premium Header
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(28);
        doc.text("BYTEGUARD", 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("PHISHING_FORENSICS_MANIFEST // LINK_AUDIT", 20, 32);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`TARGET: ${url}`, 20, 50);

        doc.setFontSize(12);
        const riskLevel = result.analysis.riskScore > 70 ? 'CRITICAL' : result.analysis.riskScore > 30 ? 'MODERATE' : 'LOW';
        doc.text(`RISK_LEVEL: ${riskLevel} (${result.analysis.riskScore}%)`, 20, 60);
        doc.text(`DATE: ${new Date().toLocaleString()}`, 20, 70);

        doc.text("DEEP_HEURISTIC_RESULTS:", 20, 85);
        let y = 95;
        result.analysis.riskFactors.forEach((factor, i) => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(10);
            doc.setTextColor(result.analysis.riskScore > 50 ? 200 : 0, 0, 0);
            doc.text(`[${i + 1}] ${factor}`, 20, y);
            y += 8;
        });

        doc.save(`phishing_audit_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                LINK_<span className="text-[#00ff88]">FORENSICS</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                HEURISTIC_DECEPTION_ENGINE // ACTIVE
                            </div>
                        </div>

                        {result && !error && (
                            <button onClick={generatePDF} className="btn-futuristic !py-3 !px-6 !text-[10px]">
                                DOWNLOAD_MANIFEST
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input Area */}
                        <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
                            <div className="glass-card-extreme p-10 cyber-border-extreme relative overflow-hidden">
                                {loading && <div className="scanner-overlay !bg-[#00ff88] !opacity-20 animate-scan"></div>}
                                <h2 className="text-[#00ff88] text-xs font-black mb-10 tracking-[0.3em] uppercase">Vector_Injection</h2>

                                <form onSubmit={analyzeLink} className="space-y-6">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="SCAN_TARGET_ [e.g. bit.ly/XyZ]"
                                            className="w-full bg-black/60 border-2 border-white/5 rounded-2xl p-6 text-white text-lg focus:border-[#00ff88] transition-all outline-none font-bold"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20 font-black">URL</div>
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="btn-floating-extreme w-full !py-6 !text-lg !scale-100 hover:!scale-105 active:!scale-95"
                                    >
                                        {loading ? 'CALCULATING_DECEPTION...' : 'INITIATE_AUDIT'}
                                    </button>
                                </form>
                            </div>

                            <div className="p-8 border-2 border-[#00ff88]/10 bg-[#00ff88]/5 rounded-3xl">
                                <div className="text-[#00ff88] text-[10px] font-black uppercase mb-4 tracking-widest">Logic_Core_Status</div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 italic">
                                    <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                                    TLD_REPUTATION: ONLINE
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 italic mt-2">
                                    <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                                    BRAND_MIMICRY_DETECTION: ONLINE
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 italic mt-2">
                                    <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                                    WHOIS_AGE_SIMULATION: ONLINE
                                </div>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="lg:col-span-7">
                            {!result && !loading && !error && (
                                <div className="h-full min-h-[400px] glass-card-extreme flex flex-col items-center justify-center text-center p-12 opacity-50 border-dashed animate-in fade-in zoom-in duration-1000">
                                    <div className="text-8xl mb-6 grayscale">🔎</div>
                                    <div className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">Awaiting_Target</div>
                                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Inject a vector to begin deep heuristic decomposition</div>
                                </div>
                            )}

                            {error && (
                                <div className="glass-card-extreme p-12 border-red-500/30 bg-red-950/5 text-center animate-in zoom-in">
                                    <div className="text-6xl mb-6">🚫</div>
                                    <div className="text-red-500 font-black text-xl mb-2">UPLINK_SEVERED</div>
                                    <div className="text-red-400/60 text-xs font-mono">{error}</div>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
                                    {/* Risk Meter */}
                                    <div className="glass-card-extreme p-10 cyber-border-extreme flex flex-col md:flex-row items-center gap-10">
                                        <div className="relative h-32 w-32 flex items-center justify-center">
                                            <svg className="h-32 w-32 -rotate-90">
                                                <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="58"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="8"
                                                    strokeDasharray={364}
                                                    strokeDashoffset={364 - (364 * result.analysis.riskScore) / 100}
                                                    className={`${result.analysis.riskScore > 70 ? 'text-red-500' : result.analysis.riskScore > 30 ? 'text-yellow-500' : 'text-[#00ff88]'} transition-all duration-1000 ease-out`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-white leading-none">{result.analysis.riskScore}%</span>
                                                <span className="text-[8px] font-bold text-gray-500 tracking-tighter">DANGER</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Audit_Risk_Assessment</div>
                                            <div className={`text-4xl font-black italic tracking-tighter mb-2 ${result.analysis.riskScore > 70 ? 'text-red-500 scale-110' : result.analysis.riskScore > 30 ? 'text-yellow-500' : 'text-[#00ff88]'}`}>
                                                {result.analysis.riskScore > 70 ? 'CRITICAL_DANGER' : result.analysis.riskScore > 30 ? 'MODERATE_SUSPICION' : 'CLEAN_VERDICT'}
                                            </div>
                                            <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{result.finalUrl}</div>
                                        </div>
                                    </div>

                                    {/* Findings List */}
                                    <div className="glass-card-extreme p-10 border-white/5 space-y-6">
                                        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em] mb-4 flex items-center gap-4 text-center justify-center">
                                            <div className="h-[1px] flex-1 bg-white/5"></div>
                                            Heuristic_Findings
                                            <div className="h-[1px] flex-1 bg-white/5"></div>
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {result.analysis.riskFactors.map((factor, i) => (
                                                <div key={i} className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 group hover:border-[#00ff88]/30 transition-all">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${result.analysis.riskScore > 50 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-[#00ff88] shadow-[0_0_8px_#00ff88]'}`}></div>
                                                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{factor}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tech Data */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card-extreme p-6 border-white/5">
                                            <div className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-4">Server_Response</div>
                                            <div className="flex justify-between items-end">
                                                <div className="text-2xl font-black text-white italic">{result.status}</div>
                                                <div className="text-[10px] font-black text-[#00ff88]">{result.statusText}</div>
                                            </div>
                                        </div>
                                        <div className="glass-card-extreme p-6 border-white/5">
                                            <div className="text-gray-600 text-[9px] font-black uppercase tracking-widest mb-4">Page_Identity</div>
                                            <div className="text-sm font-bold text-white truncate italic">{result.title}</div>
                                        </div>
                                    </div>

                                    {/* Raw Headers Accordion (Simplified) */}
                                    <div className="glass-card-extreme p-4 border-white/5">
                                        <details className="group">
                                            <summary className="list-none text-[9px] font-black text-gray-700 hover:text-white transition-colors cursor-pointer flex justify-between items-center group-open:mb-4">
                                                VIEW_RAW_TRANSMISSION_HEADERS
                                                <span className="group-open:rotate-180 transition-transform">▼</span>
                                            </summary>
                                            <pre className="text-[9px] text-gray-600 font-mono bg-black/40 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed">
                                                {JSON.stringify(result.headers, null, 2)}
                                            </pre>
                                        </details>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
