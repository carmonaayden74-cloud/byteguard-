'use client';
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function NetworkIntel() {
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const fetchIntel = async () => {
        if (!target) return;
        setLoading(true);
        setError('');
        setData(null);

        try {
            // Use internal API proxy to avoid CORS issues
            const res = await fetch(`/api/ip-lookup?target=${target}`);

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const json = await res.json();

            if (json.error) {
                throw new Error(json.error);
            }

            if (json.status === 'fail') {
                throw new Error(json.message || 'Failed to scan target');
            }

            setData(json);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to fetch data. Please check the IP address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    IP INTELLIGENCE <span className="text-sm text-gray-500 font-normal">OSINT TOOL</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                            <label className="block text-sm text-[#00ff88] mb-2">TARGET IP ADDRESS</label>
                            <form onSubmit={(e) => { e.preventDefault(); fetchIntel(); }} className="flex gap-2 relative z-10">
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    className="flex-1 bg-black border border-[#00ff88]/30 rounded p-3 text-white focus:outline-none focus:border-[#00ff88]"
                                    placeholder="8.8.8.8"
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
                                Retrieves geolocation, ISP, and ASN data for any public IP address.
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
                        {data ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Map Placeholder (Could be real map later) */}
                                <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 h-48 flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                                    <div className="z-10 text-center">
                                        <div className="text-4xl font-bold text-white">{data.countryCode}</div>
                                        <div className="text-[#00ff88]">{data.country}</div>
                                        <div className="text-gray-500 text-sm">{data.city}, {data.regionName}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InfoCard label="ISP / ORGANIZATION" value={data.isp} sub={data.org} />
                                    <InfoCard label="ASN (AUTONOMOUS SYSTEM)" value={data.as} />
                                    <InfoCard label="TIMEZONE" value={data.timezone} />
                                    <InfoCard label="COORDINATES" value={`${data.lat}, ${data.lon}`} />
                                </div>

                                <div className="bg-black border border-gray-800 rounded-xl p-4 font-mono text-xs text-gray-400">
                                    <p>RAW DATA:</p>
                                    <pre className="mt-2 text-[#00ff88]">{JSON.stringify(data, null, 2)}</pre>
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

function InfoCard({ label, value, sub }) {
    return (
        <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-xl font-bold text-white truncate" title={value}>{value}</div>
            {sub && <div className="text-sm text-[#00ff88] truncate">{sub}</div>}
        </div>
    );
}

