"use client";
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function HeadersAnalyzer() {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const analyze = async () => {
        if (!url) return;
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch('/api/headers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Analysis failed');
            setResults(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (grade) => {
        if (grade === 'A') return 'text-[#00ff88]';
        if (grade === 'B') return 'text-blue-400';
        if (grade === 'C') return 'text-yellow-400';
        if (grade === 'D') return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    HTTP SECURITY AUDITOR <span className="text-sm text-gray-500 font-normal">HEADER ANALYSIS</span>
                </h1>

                <div className="max-w-4xl mx-auto">
                    {/* Input Area */}
                    <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg mb-8">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter target URL (e.g., google.com)"
                                className="flex-1 bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]"
                                onKeyDown={(e) => e.key === 'Enter' && analyze()}
                            />
                            <button
                                onClick={analyze}
                                disabled={loading}
                                className="bg-[#00ff88] text-black px-8 py-3 rounded font-bold hover:bg-[#00cc6a] disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'SCANNING...' : 'AUDIT TARGET'}
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4 text-sm">❌ {error}</p>}
                    </div>

                    {/* Results */}
                    {results && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                            {/* Score Card */}
                            <div className="md:col-span-1 bg-[#001100] border border-[#00ff88]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <div className="text-sm text-gray-400 mb-2">SECURITY GRADE</div>
                                <div className={`text-9xl font-bold ${getGradeColor(results.grade)}`}>{results.grade}</div>
                                <div className="text-2xl font-bold text-white mt-2">{results.score}/100</div>
                                <div className="text-xs text-gray-500 mt-4">Based on presence of critical security headers</div>
                            </div>

                            {/* Details */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Missing Headers */}
                                {results.missingHeaders.length > 0 && (
                                    <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-6">
                                        <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                            ⚠️ MISSING PROTECTION ({results.missingHeaders.length})
                                        </h3>
                                        <div className="grid grid-cols-1 gap-2">
                                            {results.missingHeaders.map(h => (
                                                <div key={h} className="flex items-center gap-2 text-sm text-red-300">
                                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                    {h}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Headers */}
                                <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6">
                                    <h3 className="text-[#00ff88] font-bold mb-4">RAW HEADERS DUMP</h3>
                                    <div className="space-y-2 text-xs font-mono text-gray-400 max-h-96 overflow-y-auto custom-scrollbar">
                                        {Object.entries(results.headers).map(([key, value]) => (
                                            <div key={key} className="break-all border-b border-gray-800 pb-1 mb-1">
                                                <span className="text-gray-300 font-bold">{key}:</span> {value}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
