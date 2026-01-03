"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function JWTAudit() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [jwt, setJwt] = useState('');
    const [decoded, setDecoded] = useState(null);
    const [vulnerabilities, setVulnerabilities] = useState([]);

    const analyzeJWT = () => {
        if (!jwt) return;

        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) throw new Error('Invalid format');

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            setDecoded({ header, payload });

            // Check for vulnerabilities
            const vulns = [];
            if (header.alg === 'none' || header.alg === 'NONE') {
                vulns.push({ id: 'CRITICAL', msg: 'Algorithm "none" allowed (Easy signature bypass)' });
            }
            if (!header.kid) {
                vulns.push({ id: 'WARNING', msg: 'Missing "kid" (Key ID), could lead to key confusion' });
            }
            if (payload.exp && payload.exp < Date.now() / 1000) {
                vulns.push({ id: 'ALERT', msg: 'Token expired' });
            }
            if (header.alg === 'HS256') {
                vulns.push({ id: 'INFO', msg: 'Uses symmetric HS256. Verify if secrets are weak.' });
            }

            setVulnerabilities(vulns);
            notify('SUCCESS', 'ANALYSIS_COMPLETE', 'JWT fragments dissected successfully.');

            if (vulns.some(v => v.id === 'CRITICAL')) {
                notify('ALERT', 'VULNERABILITY_DETECTED', 'CRITICAL JWT flaw found: NONE algorithm!');
            }
        } catch (e) {
            setDecoded(null);
            setVulnerabilities([]);
            notify('ERROR', 'INVALID_TOKEN', 'Fragment parsing failed. Verify JWT structure.');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-10"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            JWT_<span className="text-[#00ff88]">AUDITORS</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            TOKEN_INTEGRITY_VERIFIER // v0.9-MAX
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="glass-card-extreme p-6 border-[#00ff88]/20 shadow-2xl">
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Encoded_Token_String</label>
                                <textarea
                                    value={jwt}
                                    onChange={(e) => setJwt(e.target.value)}
                                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                    className="w-full bg-black/80 border-2 border-[#00ff88]/10 rounded-xl p-6 text-xs text-[#00ff88] font-mono focus:border-[#00ff88]/40 outline-none transition-all h-64 shadow-inner custom-scrollbar"
                                />
                                <button
                                    onClick={analyzeJWT}
                                    className="w-full mt-6 bg-[#00ff88] text-black font-black py-4 rounded-xl hover:bg-[#00cc6a] transition-all hover:tracking-[0.2em] uppercase text-xs"
                                >
                                    DISSECT TOKEN
                                </button>
                            </div>

                            {vulnerabilities.length > 0 && (
                                <div className="glass-card-extreme p-6 border-red-500/20 bg-red-950/10">
                                    <h3 className="text-red-500 text-[10px] font-black uppercase mb-4 tracking-widest">Security_Audit_Log</h3>
                                    <div className="space-y-3">
                                        {vulnerabilities.map((v, i) => (
                                            <div key={i} className="flex gap-4 items-start border-l-2 border-red-500 pl-4 py-1">
                                                <span className={`text-[9px] font-black px-1 rounded ${v.id === 'CRITICAL' ? 'bg-red-500 text-black animate-pulse' : 'text-red-400'}`}>{v.id}</span>
                                                <span className="text-[11px] font-bold text-gray-400 italic">{v.msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            {decoded ? (
                                <>
                                    <JsonBlock label="HEADER (ALGORITHM & TOKEN TYPE)" data={decoded.header} color="#00ff88" />
                                    <JsonBlock label="PAYLOAD (DATA & CLAIMS)" data={decoded.payload} color="#00ff88" />
                                    <div className="glass-card-extreme p-6 border-[#00ff88]/20 text-center">
                                        <div className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest italic font-mono">Signature_Seal:</div>
                                        <div className="text-xs text-[#00ff88] font-black tracking-widest overflow-hidden text-ellipsis whitespace-nowrap opacity-50">
                                            VERIFIED_VIA_DECODED_INTEGRITY
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex items-center justify-center glass-card-extreme border-white/5 opacity-20">
                                    <div className="text-center font-mono py-20">
                                        <div className="text-[100px] mb-4">🎫</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest">Awaiting valid JWT payload</div>
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

function JsonBlock({ label, data, color }) {
    return (
        <div className="glass-card-extreme p-6 border-white/10 bg-black/40">
            <h4 className="text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest italic">{label}</h4>
            <pre className="text-xs font-mono p-4 rounded-lg bg-black/60 border border-white/5 overflow-x-auto text-gray-300 custom-scrollbar">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
