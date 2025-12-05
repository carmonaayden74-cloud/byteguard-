'use client';
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

import { generatePDF } from '../../lib/reports';

export default function PortScanner() {
    const { user } = useAuth();
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const scanPorts = async () => {
        if (!target) return;
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch(`/api/port-scan?target=${target}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Scan failed');
            }

            setResults(data.results);

            // Save to Database (Enterprise Feature)
            if (user) {
                const { error: dbError } = await supabase
                    .from('scans')
                    .insert([
                        {
                            user_id: user.id,
                            tool_name: 'Port Scanner',
                            target: target,
                            results: data.results,
                            status: 'completed'
                        }
                    ]);

                if (dbError) console.error('Error saving scan:', dbError);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!results) return;
        generatePDF('Port Scanner', target, results);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-[#00ff88] tracking-tighter">
                        PORT SCANNER <span className="text-sm text-gray-500 font-normal">ACTIVE RECON</span>
                    </h1>
                    {results && (
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 flex items-center gap-2"
                        >
                            <span>📄</span> EXPORT REPORT
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                            <label className="block text-sm text-[#00ff88] mb-2">TARGET HOST</label>
                            <form onSubmit={(e) => { e.preventDefault(); scanPorts(); }} className="flex gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="flex-1 bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]"
                                    placeholder="scanme.nmap.org"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 bg-[#00ff88] text-black font-bold rounded hover:bg-[#00cc6a] disabled:opacity-50"
                                >
                                    {loading ? '...' : 'SCAN'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-2">
                                Checks for open ports on the target. Legal warning: Only scan targets you own or have permission to test.
                            </p>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-900/20 border border-red-500 text-red-400 rounded">
                                ERROR: {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                        {results ? (
                            <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl overflow-hidden">
                                <div className="grid grid-cols-3 bg-[#00ff88]/10 p-3 text-sm font-bold text-[#00ff88]">
                                    <div>PORT</div>
                                    <div>SERVICE</div>
                                    <div>STATUS</div>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    {results.map((r, i) => (
                                        <div key={i} className="grid grid-cols-3 p-3 text-sm hover:bg-white/5">
                                            <div className="font-mono">{r.port}</div>
                                            <div className="text-gray-400">{r.service}</div>
                                            <div>
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'open' ? 'bg-green-500/20 text-green-400' :
                                                    r.status === 'filtered' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {r.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
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
