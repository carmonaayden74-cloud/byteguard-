"use client";
import { useState, useCallback } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { useDefense } from '../../context/DefenseContext';
import { supabase } from '../../lib/supabase';

export default function CodeAnalyzer() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const runAnalysis = async () => {
        if (!code.trim()) {
            setError('INPUT_REQUIRED: Provide source code for neural deconstruction.');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        // Simulation delay for "Processing" feel
        await new Promise(r => setTimeout(r, 1500));

        try {
            const analysis = {
                codeLength: code.length,
                lineCount: code.split('\n').length,
                language,
                timestamp: new Date().toISOString(),
                vulnerabilities: [],
                warnings: [],
                info: []
            };

            // Heuristic Analysis Blocks
            checkSQLInjection(code, analysis);
            checkXSS(code, analysis);
            checkCommandInjection(code, analysis);
            checkHardcodedSecrets(code, analysis);
            checkWeakCrypto(code, analysis);
            checkObfuscation(code, analysis);

            const totalScore = Math.min(100, (analysis.vulnerabilities.length * 25) + (analysis.warnings.length * 10));
            analysis.riskScore = totalScore;
            analysis.riskLevel = totalScore >= 70 ? 'CRITICAL' : totalScore >= 40 ? 'HIGH' : 'LOW';

            setResults(analysis);

            if (user) {
                await supabase.from('scans').insert([{
                    user_id: user.id,
                    tool_name: 'Code Analyzer',
                    target: `${language}_source`,
                    results: analysis,
                    status: 'completed'
                }]);
            }

            if (analysis.vulnerabilities.length > 0) {
                notify('ALERT', 'VULN_DETECTED', `Found ${analysis.vulnerabilities.length} high-severity issues in code fragment.`);
            }

        } catch (err) {
            setError('CORE_FAULT: Analysis engine interrupted.');
        } finally {
            setLoading(false);
        }
    };

    // --- HEURISTICS ---
    const checkSQLInjection = (code, ana) => {
        if (/SELECT.*FROM.*WHERE.*\+/gi.test(code) || /db\.query\(.*['"]\+/gi.test(code)) {
            ana.vulnerabilities.push({ type: 'SQL_INJECTION', gravity: 'CRITICAL', desc: 'String concatenation in query detected.' });
        }
    };
    const checkXSS = (code, ana) => {
        if (/innerHTML\s*=/gi.test(code) || /dangerouslySetInnerHTML/gi.test(code)) {
            ana.vulnerabilities.push({ type: 'XSS_VECTOR', gravity: 'HIGH', desc: 'Unsanitized DOM injection potential.' });
        }
    };
    const checkCommandInjection = (code, ana) => {
        if (/exec\(|spawn\(|system\(|eval\(/gi.test(code)) {
            ana.vulnerabilities.push({ type: 'DYNAMIC_EXEC', gravity: 'CRITICAL', desc: 'Arbitrary code execution primitive detected.' });
        }
    };
    const checkHardcodedSecrets = (code, ana) => {
        if (/api_key|secret|password|token/i.test(code) && /['"][a-z0-9_-]{16,}['"]/i.test(code)) {
            ana.vulnerabilities.push({ type: 'SECRET_EXPOSURE', gravity: 'CRITICAL', desc: 'Likely hardcoded credentials identified.' });
        }
    };
    const checkWeakCrypto = (code, ana) => {
        if (/md5\(|sha1\(|rc4\(/gi.test(code)) {
            ana.warnings.push({ type: 'WEAK_CRYPT', gravity: 'MEDIUM', desc: 'Deprecated hash/cipher algorithm in use.' });
        }
    };
    const checkObfuscation = (code, ana) => {
        if (/\\x[0-9a-f]{2}|String\.fromCharCode/gi.test(code)) {
            ana.warnings.push({ type: 'OBFUSCATION', gravity: 'LOW', desc: 'Active non-literal character encoding detected.' });
        }
    };

    const exportPDF = async () => {
        if (!results) return;
        const { default: jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        doc.setFillColor(5, 5, 5);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(0, 255, 136);
        doc.setFontSize(24);
        doc.text("BYTEGUARD // STATIC_CODE_AUDIT", 20, 25);
        doc.setTextColor(0);
        doc.setFontSize(14);
        doc.text(`RISK_LVL: ${results.riskScore}% (${results.riskLevel})`, 20, 55);
        doc.save(`audit_report_${Date.now()}.pdf`);
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
                                CODE_<span className="text-[#00ff88]">ANALYZER</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                NEURAL_STATIC_ANALYSIS // V4.2
                            </div>
                        </div>
                        {results && (
                            <button onClick={exportPDF} className="btn-futuristic !py-3 !px-6 !text-[10px]">
                                EXPORT_FORENSIC_PDF
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Editor Area */}
                        <div className="lg:col-span-12 xl:col-span-7 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="glass-card-extreme p-8 cyber-border-extreme">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-[10px] font-black text-[#00ff88] tracking-widest uppercase">Input_Source_Buffer</div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="bg-black border border-[#00ff88]/30 rounded px-3 py-1 text-[10px] text-white font-bold outline-none"
                                    >
                                        <option value="javascript">JS_NODE</option>
                                        <option value="python">PY_VEC</option>
                                        <option value="php">PHP_HYPER</option>
                                        <option value="java">JAVA_CORE</option>
                                    </select>
                                </div>

                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="PASTE_SOURCE_FRAGMENT_HERE..."
                                    className="w-full h-80 bg-black/60 border-2 border-white/5 rounded-2xl p-6 text-white text-xs font-mono focus:border-[#00ff88]/40 outline-none transition-all resize-none shadow-inner"
                                />

                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={runAnalysis}
                                        disabled={loading}
                                        className="btn-floating-extreme flex-1 !py-5 !text-xs"
                                    >
                                        {loading ? 'RUNNING_DYNAMIC_SCAN...' : 'EXECUTE_AUDIT_SEQUENCE'}
                                    </button>
                                    <button
                                        onClick={() => { setCode(''); setResults(null); }}
                                        className="btn-futuristic !px-8 !text-[10px]"
                                    >
                                        WIPE_CACHE
                                    </button>
                                </div>
                            </div>

                            <TerminalLog />
                        </div>

                        {/* Intelligence Area */}
                        <div className="lg:col-span-12 xl:col-span-5">
                            {!results && !loading ? (
                                <div className="h-full glass-card-extreme border-dashed border-white/10 flex flex-col items-center justify-center p-20 text-center opacity-30 grayscale">
                                    <div className="text-8xl mb-8">🧬</div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] mb-4">Core_Idle</h3>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-loose">
                                        Static analysis engine waiting for input.<br />
                                        Heuristics will identify SQLi, XSS, and command injection patterns.
                                    </p>
                                </div>
                            ) : loading ? (
                                <div className="h-full glass-card-extreme flex flex-col items-center justify-center p-20 border-[#00ff88]/20 animate-pulse">
                                    <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_#00ff88]"></div>
                                    <div className="text-[10px] font-black text-[#00ff88] tracking-[0.5em] uppercase">Processing_Neural_Layers...</div>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                                    {/* Risk Badge */}
                                    <div className="glass-card-extreme p-8 border-[#00ff88]/10 bg-gradient-to-br from-transparent to-[#00ff88]/5">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Compromise_Risk_Score</div>
                                                <div className={`text-6xl font-black italic ${results.riskScore >= 70 ? 'text-red-500' : results.riskScore >= 40 ? 'text-yellow-500' : 'text-[#00ff88]'}`}>
                                                    {results.riskScore}%
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-black text-gray-600 mb-1">AUDIT_STATUS</div>
                                                <div className={`text-xs font-black px-3 py-1 rounded-lg border ${results.riskScore >= 70 ? 'border-red-500 text-red-500' : 'border-[#00ff88] text-[#00ff88]'}`}>
                                                    {results.riskLevel}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Findings List */}
                                    <div className="glass-card-extreme p-8 border-white/5 space-y-6">
                                        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 bg-[#00ff88] rounded-full"></span>
                                            High_Probability_Vectors
                                        </h3>

                                        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                            {results.vulnerabilities.length === 0 && results.warnings.length === 0 && (
                                                <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/5 opacity-40">
                                                    <div className="text-3xl mb-4">🛡️</div>
                                                    <div className="text-[9px] font-black uppercase tracking-widest">No immediate threats identified.</div>
                                                </div>
                                            )}

                                            {results.vulnerabilities.map((v, i) => (
                                                <div key={i} className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl group hover:border-red-500/50 transition-all">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-red-500 text-[10px] font-black italic tracking-widest">{v.type}</span>
                                                        <span className="text-red-500/40 text-[8px] font-black uppercase">{v.gravity}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{v.desc}</p>
                                                </div>
                                            ))}

                                            {results.warnings.map((w, i) => (
                                                <div key={i} className="p-5 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl group hover:border-yellow-500/50 transition-all">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-yellow-500 text-[10px] font-black italic tracking-widest">{w.type}</span>
                                                        <span className="text-yellow-500/40 text-[8px] font-black uppercase">{w.gravity}</span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed">{w.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-[9px] text-gray-600 font-black tracking-widest uppercase italic text-center">
                                        Audit_Engine: StaticHeuristics_v2.0_SecureNode
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
