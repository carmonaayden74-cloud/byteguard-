'use client';
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function DNSLookup() {
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const lookupDNS = async () => {
        if (!domain) return;
        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch(`/api/dns?domain=${domain}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Lookup failed');
            }

            setResults(data.records);
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
                    DNS LOOKUP <span className="text-sm text-gray-500 font-normal">RECORDS VIEWER</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                            <label className="block text-sm text-[#00ff88] mb-2">DOMAIN NAME</label>
                            <form onSubmit={(e) => { e.preventDefault(); lookupDNS(); }} className="flex gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    className="flex-1 bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]"
                                    placeholder="google.com"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 bg-[#00ff88] text-black font-bold rounded hover:bg-[#00cc6a] disabled:opacity-50"
                                >
                                    {loading ? '...' : 'LOOKUP'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-2">
                                Retrieves all available DNS records (A, MX, TXT, NS, etc.) for the specified domain.
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
                            <div className="space-y-4 animate-fade-in">
                                {results.map((record, i) => (
                                    <div key={i} className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-[#00ff88]/20 text-[#00ff88] px-2 py-1 rounded text-xs font-bold">
                                                {record.type}
                                            </span>
                                        </div>
                                        <div className="font-mono text-sm text-gray-300 break-all">
                                            {JSON.stringify(record, null, 2).replace(/{|}|"/g, '')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-600 border border-dashed border-gray-800 rounded-xl min-h-[400px]">
                                WAITING FOR DOMAIN...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
