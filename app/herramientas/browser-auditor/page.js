"use client";
import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { jsPDF } from 'jspdf';

export default function BrowserAuditor() {
    const [info, setInfo] = useState(null);
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const analyze = async () => {
            if (typeof window === 'undefined') return;

            // Artificial delay for "Scanning" feel
            await new Promise(r => setTimeout(r, 2000));

            const n = window.navigator;
            const screen = window.screen;

            // Simple Canvas Fingerprint
            const getCanvasFingerprint = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.textBaseline = "top";
                ctx.font = "14px 'Arial'";
                ctx.textBaseline = "alphabetic";
                ctx.fillStyle = "#f60";
                ctx.fillRect(125, 1, 62, 20);
                ctx.fillStyle = "#069";
                ctx.fillText("ByteGuard_Quantum_Check", 2, 15);
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
                ctx.fillText("ByteGuard_Quantum_Check", 4, 17);
                return canvas.toDataURL();
            };

            const data = {
                userAgent: n.userAgent,
                platform: n.platform,
                language: n.language,
                cookiesEnabled: n.cookieEnabled,
                doNotTrack: n.doNotTrack || "Unspecified",
                screenResolution: `${screen.width}x${screen.height}`,
                colorDepth: `${screen.colorDepth}-bit`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hardwareConcurrency: n.hardwareConcurrency || "Unknown",
                deviceMemory: n.deviceMemory ? `${n.deviceMemory} GB` : "Unknown",
                connection: n.connection ? n.connection.effectiveType : "Unknown",
                canvasHash: btoa(getCanvasFingerprint()).substring(0, 32)
            };

            const calculateUniqueness = (d) => {
                let score = 0;
                if (d.platform) score += 10;
                if (d.language) score += 10;
                if (d.timezone) score += 15;
                if (d.screenResolution) score += 20;
                if (d.hardwareConcurrency !== 'Unknown') score += 15;
                if (d.deviceMemory !== 'Unknown') score += 15;
                if (d.canvasHash) score += 14.9;
                return Math.min(score, 99.9).toFixed(1);
            };

            setInfo({ ...data, uniqueness: calculateUniqueness(data) });
            setScanning(false);
        };

        analyze();
    }, []);

    const generatePDF = () => {
        if (!info) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 255, 136);
        doc.text("BYTEGUARD // BROWSER_FINGERPRINT_REPORT", 20, 20);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`TIMESTAMP: ${new Date().toISOString()}`, 20, 30);

        let y = 50;
        doc.setTextColor(0, 0, 0);
        Object.entries(info).forEach(([key, value]) => {
            doc.text(`${key.toUpperCase()}: ${value}`, 20, y);
            y += 8;
        });
        doc.save("browser_intel.pdf");
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
                                BROWSER_<span className="text-[#00ff88]">AUDITOR</span>
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                NEURAL_FINGERPRINTING // V2.1
                            </div>
                        </div>
                        {!scanning && (
                            <button onClick={generatePDF} className="btn-futuristic !py-2 !px-6 !text-xs">
                                📄 EXPORT_FINGERPRINT
                            </button>
                        )}
                    </div>

                    {scanning ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center animate-pulse">
                            <div className="w-24 h-24 border-4 border-[#00ff88]/20 border-t-[#00ff88] rounded-full animate-spin mb-8"></div>
                            <div className="text-[10px] font-black text-[#00ff88] tracking-[1em] uppercase">Deep_Scan_In_Progress</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            {/* Score Card */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="glass-card-extreme p-8 cyber-border-extreme flex flex-col items-center text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="text-[10px] font-black text-gray-500 mb-8 tracking-widest uppercase italic">Composite Uniqueness Score</div>

                                    <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,255,136,0.05)" strokeWidth="2" />
                                            <circle cx="18" cy="18" r="16" fill="none" stroke="#00ff88" strokeWidth="2"
                                                strokeDasharray={`${info.uniqueness}, 100`}
                                                className="shadow-[0_0_20px_#00ff88]"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <div className="text-5xl font-black text-white italic">{info.uniqueness}%</div>
                                            <div className="text-[8px] font-black text-[#00ff88] tracking-widest uppercase">Unique</div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase">
                                        Your browser presents a highly specific signature that allows trackers to identify you with near-certainty without using cookies.
                                    </p>
                                </div>

                                <div className="glass-card-extreme p-6 border-red-500/20 bg-red-950/10">
                                    <div className="text-[9px] font-black text-red-500 mb-4 tracking-widest uppercase">Privacy Vulnerabilities</div>
                                    <div className="space-y-4">
                                        <StatusItem label="COOKIES_ACCESS" value={info.cookiesEnabled ? "ALLOWED" : "BLOCKED"} secure={!info.cookiesEnabled} />
                                        <StatusItem label="DNT_HEADER" value={info.doNotTrack === "1" ? "ACTIVE" : "INACTIVE"} secure={info.doNotTrack === "1"} />
                                        <StatusItem label="CANVAS_LEAK" value="DETECTED" secure={false} />
                                    </div>
                                </div>
                            </div>

                            {/* Details Matrix */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoCard label="Hardware Concurrency" value={`${info.hardwareConcurrency} Cores`} />
                                    <InfoCard label="Memory Profile" value={info.deviceMemory} />
                                    <InfoCard label="Network Stack" value={info.connection} />
                                    <InfoCard label="Color Bit-Depth" value={info.colorDepth} />
                                </div>

                                <div className="glass-card-extreme p-8 cyber-border-extreme">
                                    <h3 className="text-white text-xs font-black mb-8 tracking-[0.2em] uppercase flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#00ff88] rounded-full"></div>
                                        System_Fingerprint_Manifest
                                    </h3>
                                    <div className="space-y-4">
                                        <ManifestItem label="User Agent String" value={info.userAgent} />
                                        <ManifestItem label="Operating Platform" value={info.platform} />
                                        <ManifestItem label="Display Resolution" value={info.screenResolution} />
                                        <ManifestItem label="Temporal Zone" value={info.timezone} />
                                        <ManifestItem label="Interface Language" value={info.language} />
                                        <ManifestItem label="Canvas Identity Hash" value={info.canvasHash} color="text-[#00ff88]" />
                                    </div>
                                </div>

                                <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-[9px] text-gray-600 font-bold uppercase italic text-center">
                                    &quot;Fingerprinting leverages minor discrepancies in hardware and software configurations to bypass primary privacy shielding.&quot;
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div className="glass-card-extreme p-6 border-white/5 group hover:border-[#00ff88]/30 transition-all">
            <div className="text-[8px] text-gray-600 font-black mb-2 uppercase tracking-widest">{label}</div>
            <div className="text-lg font-black text-white italic group-hover:text-[#00ff88] transition-colors">{value}</div>
        </div>
    );
}

function ManifestItem({ label, value, color = "text-gray-400" }) {
    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
            <span className="text-[#00ff88]/60 text-[9px] font-black tracking-wider uppercase">{label}</span>
            <span className={`${color} font-mono text-[10px] break-all md:max-w-md text-right font-bold italic`}>{value}</span>
        </div>
    );
}

function StatusItem({ label, value, secure }) {
    return (
        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
            <span className="text-gray-500 text-[8px] font-black tracking-widest uppercase">{label}</span>
            <span className={`font-black text-[9px] ${secure ? "text-[#00ff88]" : "text-red-500"}`}>
                {value}
            </span>
        </div>
    );
}
