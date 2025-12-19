"use client";

import { useState, useEffect, useRef } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { jsPDF } from 'jspdf';
import { useAuth } from "../../context/AuthContext";
import { useDefense } from "../../context/DefenseContext";
import { saveScan } from "../../lib/history";

export default function AIThreatDetector() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanStage, setScanStage] = useState(0);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const stages = [
        "INITIALIZING_NEURAL_LAYERS",
        "DECOMPOSING_VECTOR_STRUCTURE",
        "ANALYZING_HEURISTIC_BRANCHES",
        "GPT_CONSENSUS_SYNTAX_PARSING",
        "FINALIZING_THREAT_SIGNATURE"
    ];

    const analyzeCode = async () => {
        if (!input.trim()) {
            setError('SCAN_TARGET_MISSING: Inject code or object for analysis.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);
        setScanStage(0);

        // Simulation Timing
        const stageInterval = setInterval(() => {
            setScanStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
        }, 1500);

        try {
            const response = await fetch('/api/threat-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: input })
            });

            const data = await response.json();

            if (response.status === 429) {
                notify('WARNING', 'Core Overload', 'AI Neural core throttling. Use local heuristics.');
            }

            // Local fallback if AI fails
            if (!response.ok) {
                const local = performLocalAnalysis(input);
                setResults(local);
            } else {
                setResults(data);
            }

            if (user) {
                await saveScan(user.id, 'AI Neural Analysis', input.substring(0, 50), data);
            }

        } catch (err) {
            const local = performLocalAnalysis(input);
            setResults(local);
        } finally {
            clearInterval(stageInterval);
            setLoading(false);
        }
    };

    const performLocalAnalysis = (code) => {
        // ... (Same local analysis logic as before but with better formatting) ...
        const maliciousPatterns = [
            { name: 'Base64 Obfuscation', regex: /btoa\(|atob\(|base64/gi, weight: 15 },
            { name: 'Eval Execution', regex: /eval\(/gi, weight: 25 },
            { name: 'Suspicious Domains', regex: /\.tk|\.ml|\.ga/gi, weight: 20 },
            { name: 'DOM Hijacking', regex: /innerHTML\s*=/gi, weight: 12 }
        ];

        let score = 0;
        let detected = [];
        maliciousPatterns.forEach(p => {
            const matches = code.match(p.regex);
            if (matches) {
                score += p.weight * matches.length;
                detected.push({ name: p.name, severity: score > 50 ? 'high' : 'medium', description: 'Local heuristic match.' });
            }
        });

        const riskScore = Math.min(100, score);
        return {
            riskScore,
            threatLevel: riskScore > 75 ? 'CRITICAL' : riskScore > 40 ? 'HIGH' : 'LOW',
            summary: "LOCAL_HEURISTIC_FALLBACK: Offline analysis completed due to uplink constraints.",
            detectedPatterns: detected,
            recommendation: "Review code manually for hidden logic."
        };
    };

    const exportPDF = () => {
        if (!results) return;
        const doc = new jsPDF();
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(24);
        doc.text("BYTEGUARD // NEURAL_CORE", 20, 25);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`RISK_LEVEL: ${results.threatLevel} (${results.riskScore}%)`, 20, 55);
        doc.setFontSize(10);
        doc.text(`SUMMARY: ${results.summary}`, 20, 65);

        doc.save(`neural_report_${Date.now()}.pdf`);
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
                                NEURAL_<span className="text-[#00ff88]">DETECTOR</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#a855f7]"></span>
                                AI_THREAT_INTELLIGENCE // v4.0
                            </div>
                        </div>
                        {results && (
                            <button onClick={exportPDF} className="btn-futuristic !py-3 !px-6 !text-[10px]">
                                EXPORT_REPORT
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Input & Simulation Area */}
                        <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="glass-card-extreme p-8 cyber-border-extreme relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl grayscale group-hover:opacity-20 transition-all duration-1000">🧠</div>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="PASTE_PAYLOAD_OR_SCRIPTS_HERE..."
                                    className="w-full bg-black/60 border-2 border-[#00ff88]/10 rounded-2xl p-6 text-white text-xs font-mono min-h-[300px] focus:border-[#00ff88]/40 transition-all outline-none"
                                />

                                <button
                                    onClick={analyzeCode}
                                    disabled={loading}
                                    className="btn-floating-extreme w-full mt-6 !py-5 !text-sm"
                                >
                                    {loading ? 'NEURAL_PROCESSING...' : 'EXECUTE_THREAT_ANALYSIS'}
                                </button>
                            </div>

                            {loading && (
                                <div className="glass-card-extreme p-8 border-purple-500/20 bg-purple-950/5 animate-pulse">
                                    <div className="text-[10px] font-black text-purple-400 mb-4 tracking-widest uppercase italic">Processing_Chain:</div>
                                    <div className="space-y-3">
                                        {stages.map((s, i) => (
                                            <div key={i} className={`flex items-center gap-3 text-[9px] font-bold ${i === scanStage ? 'text-white' : i < scanStage ? 'text-purple-400 opacity-40' : 'text-gray-700'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${i === scanStage ? 'bg-purple-500' : 'bg-gray-800'}`}></div>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!loading && !results && <div className="hidden lg:block"><TerminalLog /></div>}
                        </div>

                        {/* Results Dashboard */}
                        <div className="lg:col-span-7">
                            {!results && !loading && (
                                <div className="h-full glass-card-extreme border-dashed border-white/5 flex flex-col items-center justify-center p-20 text-center opacity-40">
                                    <div className="text-7xl mb-8 animate-pulse grayscale">🧬</div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Neural_Idle</h3>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                                        Feed the core with code snippets, URLs, or log blocks.<br />
                                        AI will deconstruct logic to identify non-human patterns.
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="glass-card-extreme p-12 border-red-500/30 text-center">
                                    <div className="text-5xl mb-6">⚠️</div>
                                    <div className="text-red-500 font-black text-xs uppercase tracking-[0.5em]">{error}</div>
                                </div>
                            )}

                            {results && (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                                    {/* Risk Header */}
                                    <div className="glass-card-extreme p-10 flex items-center justify-between border-[#00ff88]/10 bg-gradient-to-br from-transparent to-[#00ff88]/5">
                                        <div>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Threat_Confidence_Level</div>
                                            <div className={`text-6xl font-black italic tracking-tighter ${results.riskScore > 75 ? 'text-red-500 shadow-[0_0_20px_#ef444450]' : results.riskScore > 40 ? 'text-yellow-500' : 'text-[#00ff88]'}`}>
                                                {results.riskScore}%
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-black uppercase tracking-[0.3em] mb-2 px-4 py-1 rounded-full border ${results.riskScore > 75 ? 'border-red-500 text-red-500' : 'border-[#00ff88] text-[#00ff88]'}`}>
                                                VERDICT: {results.threatLevel}
                                            </div>
                                            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Analysis Engine Ref: #NEURAL-AI-BYPASS</div>
                                        </div>
                                    </div>

                                    {/* Summary & Recommendation */}
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                        <div className="glass-card-extreme p-8 border-white/5">
                                            <div className="text-[#00ff88] text-[9px] font-black uppercase mb-4 tracking-widest italic flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></div>
                                                Intelligence_Summary
                                            </div>
                                            <p className="text-xs font-bold leading-relaxed text-gray-300 italic">&quot;{results.summary}&quot;</p>
                                        </div>

                                        <div className="glass-card-extreme p-8 border-[#00ff88]/20 bg-[#00ff88]/5">
                                            <div className="text-[#00ff88] text-[9px] font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                                                🛡️ Defensive_Protocol
                                            </div>
                                            <p className="text-xs font-bold text-white">{results.recommendation}</p>
                                        </div>
                                    </div>

                                    {/* Patterns List */}
                                    <div className="glass-card-extreme p-8 border-white/5 overflow-hidden">
                                        <h3 className="text-white/40 text-[9px] font-black uppercase tracking-[0.6em] mb-8 text-center">Detected_Structural_Indicators</h3>
                                        <div className="space-y-3">
                                            {results.detectedPatterns?.map((p, i) => (
                                                <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#00ff88]/30 transition-all cursor-crosshair">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-2 h-2 rounded-full ${p.severity === 'critical' || p.severity === 'high' ? 'bg-red-500' : 'bg-[#00ff88]'}`}></div>
                                                        <div>
                                                            <div className="text-[11px] font-black text-white uppercase tracking-wider">{p.name}</div>
                                                            <div className="text-[9px] text-gray-600 italic">{p.description}</div>
                                                        </div>
                                                    </div>
                                                    <div className={`text-[8px] font-black px-3 py-1 rounded border ${p.severity === 'critical' ? 'border-red-500 text-red-500' : 'border-white/10 text-gray-500'}`}>
                                                        {p.severity.toUpperCase()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
