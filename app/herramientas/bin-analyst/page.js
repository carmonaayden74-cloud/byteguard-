"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function BinAnalyst() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [fileName, setFileName] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalysis = () => {
        if (!fileName) return;
        setAnalyzing(true);
        setAnalysis(null);
        notify('INFO', 'BINARY_UPLINK', `Transferring ${fileName} to isolation sandbox...`);

        setTimeout(() => {
            const mockAnalysis = {
                hash: {
                    md5: '5d41402abc4b2a76b9719d911017c592',
                    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                },
                sections: [
                    { name: '.text', virtualSize: '0x1200', entropy: '6.4 (Normal)' },
                    { name: '.data', virtualSize: '0x0800', entropy: '2.1 (Normal)' },
                    { name: '.rsrc', virtualSize: '0x4500', entropy: '7.8 (High/Encrypted)' },
                    { name: '.upx', virtualSize: '0x0000', entropy: '0.0 (Packer Detected)' }
                ],
                suspiciousStrings: [
                    'ShellExecuteA', 'WriteProcessMemory', 'InternetOpenUrlA', 'RegCreateKeyExA', 'cmd.exe /c', 'http://malicious-cnc.ru'
                ],
                malwareScore: 84
            };

            setAnalysis(mockAnalysis);
            setAnalyzing(false);
            notify('WARNING', 'ANALYSIS_COMPLETE', `Binary shows ${mockAnalysis.malwareScore}% risk profile. Malicious behavior detected.`);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                BIN_<span className="text-[#00ff88]">ANALYST</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                STATIC_BINARY_FORENSICS // SANDBOX_ISOLATION_ON
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="glass-card-extreme p-10 border-dashed border-2 border-[#00ff88]/20 text-center group hover:border-[#00ff88]/50 transition-all">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={(e) => setFileName(e.target.files[0]?.name)}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block">
                                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform grayscale group-hover:grayscale-0">📦</div>
                                    <h3 className="text-xl font-black text-white mb-2">{fileName || 'DRAG_BINARY_TO_SANDBOX'}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Supports PE, ELF, Mach-O and DMG</p>
                                </label>
                                {fileName && (
                                    <button
                                        onClick={handleAnalysis}
                                        disabled={analyzing}
                                        className="mt-8 w-full bg-red-500 text-black font-black py-4 rounded-xl hover:bg-red-600 transition-all uppercase text-xs tracking-[0.3em] shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                                    >
                                        {analyzing ? 'DISSECTING_BYTES...' : 'INITIATE DEEP ANALYSIS'}
                                    </button>
                                )}
                            </div>

                            {analysis && (
                                <div className="glass-card-extreme p-8 border-white/5 space-y-6 animate-in slide-in-from-left duration-500">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-4">Static_Signature_Cache</h4>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-black/60 rounded-lg border border-white/5">
                                            <div className="text-[9px] text-[#00ff88] font-black mb-1">SHA-256</div>
                                            <div className="text-[10px] text-white font-mono break-all font-bold">{analysis.hash.sha256}</div>
                                        </div>
                                        <div className="p-4 bg-black/60 rounded-lg border border-white/5">
                                            <div className="text-[9px] text-[#00ff88] font-black mb-1">MD5</div>
                                            <div className="text-[10px] text-white font-mono break-all font-bold">{analysis.hash.md5}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            {analyzing ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                                    <div className="w-32 h-32 border-4 border-red-500/10 rounded-full flex items-center justify-center relative">
                                        <div className="w-full h-full border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
                                        <span className="text-red-500 text-2xl font-black italic">!</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[10px] font-black text-red-500 tracking-[0.5em] animate-pulse mb-2">RUNNING_HEURISTICS...</div>
                                        <div className="text-[9px] text-gray-600 font-bold uppercase">Tracing API imports & entropy clusters</div>
                                    </div>
                                </div>
                            ) : analysis ? (
                                <div className="space-y-8 animate-in zoom-in duration-500 h-full">
                                    <div className="glass-card-extreme cyber-border-extreme !p-8 bg-black/40 text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 font-black text-[80px] text-red-500 opacity-5 -rotate-12 select-none pointer-events-none">INFECTED</div>
                                        <div className="text-[10px] font-black text-red-500 uppercase mb-4 tracking-[0.5em]">Malware_Risk_Probability</div>
                                        <div className="text-8xl font-black text-white tracking-widest mb-4 tabular-nums">{analysis.malwareScore}%</div>
                                        <div className="w-full h-2 bg-gray-900 rounded-full max-w-sm mx-auto overflow-hidden">
                                            <div className="h-full bg-red-500 shadow-[0_0_15px_#ef4444]" style={{ width: `${analysis.malwareScore}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="glass-card-extreme p-6 border-white/5">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">PE_Sections</h4>
                                            <div className="space-y-3">
                                                {analysis.sections.map(s => (
                                                    <div key={s.name} className="flex justify-between items-center text-[10px] font-bold">
                                                        <span className="text-white">{s.name}</span>
                                                        <span className={s.entropy.includes('High') ? 'text-red-500' : 'text-gray-500'}>{s.virtualSize}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="glass-card-extreme p-6 border-white/5">
                                            <h4 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Suspicious_Strings</h4>
                                            <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar">
                                                {analysis.suspiciousStrings.map((s, i) => (
                                                    <div key={i} className="text-[9px] font-mono text-white/40 hover:text-red-400 transition-colors truncate whitespace-nowrap">{s}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                    <div className="text-[120px] mb-8">🧩</div>
                                    <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Awaiting signature for static decomposition</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
