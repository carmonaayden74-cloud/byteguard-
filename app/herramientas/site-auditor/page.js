"use client";
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function SiteAuditor() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    const runAudit = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setReport(null);

        try {
            const res = await fetch('/api/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Audit failed');
            }

            setReport(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    SITE SECURITY AUDITOR <span className="text-sm text-gray-500 font-normal">PROFESSIONAL</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                            <label className="block text-sm text-[#00ff88] mb-2">TARGET URL</label>
                            <div className="flex gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-1 bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]"
                                    placeholder="example.com"
                                />
                                <button
                                    onClick={runAudit}
                                    disabled={loading}
                                    className="px-6 bg-[#00ff88] text-black font-bold rounded hover:bg-[#00cc6a] disabled:opacity-50"
                                >
                                    {loading ? '...' : 'SCAN'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Performs a real-time analysis of HTTP security headers and server configuration.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/20 border border-red-500 text-red-400 rounded">
                                ERROR: {error}
                            </div>
                        )}
                    </div>

                    {/* Report */}
                    <div className="lg:col-span-2">
                        {report ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Score Card */}
                                <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">SECURITY SCORE</h2>
                                        <p className="text-gray-500 text-sm">{report.url}</p>
                                    </div>
                                    <div className={`text-5xl font-bold ${report.analysis.score >= 80 ? 'text-[#00ff88]' :
                                        report.analysis.score >= 50 ? 'text-yellow-400' : 'text-red-500'
                                        }`}>
                                        {report.analysis.score}/100
                                    </div>
                                </div>

                                {/* Issues */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#0a0a0a] border border-red-500/30 rounded-xl p-6">
                                        <h3 className="text-red-400 font-bold mb-4 flex items-center">
                                            <span className="mr-2">⚠️</span> VULNERABILITIES FOUND
                                        </h3>
                                        {report.analysis.issues.length === 0 ? (
                                            <p className="text-gray-500 italic">No critical issues detected.</p>
                                        ) : (
                                            <ul className="space-y-2 text-sm">
                                                {report.analysis.issues.map((issue, i) => (
                                                    <li key={i} className="text-red-300">• {issue}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="bg-[#0a0a0a] border border-[#00ff88]/30 rounded-xl p-6">
                                        <h3 className="text-[#00ff88] font-bold mb-4 flex items-center">
                                            <span className="mr-2">✅</span> GOOD PRACTICES
                                        </h3>
                                        {report.analysis.good.length === 0 ? (
                                            <p className="text-gray-500 italic">No security headers found.</p>
                                        ) : (
                                            <ul className="space-y-2 text-sm">
                                                {report.analysis.good.map((item, i) => (
                                                    <li key={i} className="text-[#00ff88]/80">• {item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Raw Headers */}
                                <div className="bg-black border border-gray-800 rounded-xl p-6 font-mono text-xs">
                                    <h3 className="text-gray-500 mb-4">RAW HEADERS</h3>
                                    <div className="space-y-1 text-gray-400">
                                        {Object.entries(report.headers).map(([key, value]) => (
                                            <div key={key} className="break-all">
                                                <span className="text-blue-400">{key}:</span> {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 border border-dashed border-gray-800 rounded-xl min-h-[400px]">
                                WAITING FOR TARGET...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
