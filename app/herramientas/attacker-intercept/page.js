"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function AttackerIntercept() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [tokenType, setTokenType] = useState('DOC_BEACON');
    const [generating, setGenerating] = useState(false);
    const [captureLog, setCaptureLog] = useState([]);

    const tokenTypes = {
        DOC_BEACON: { name: 'Document Canary', icon: '📄', desc: 'A PDF/Docx decoy that pings home when opened by intruders.' },
        SQL_LURE: { name: 'SQL Honeypot', icon: '🗄️', desc: 'Faked database credentials that alert on connection attempts.' },
        WEB_SNARE: { name: 'Login Snare', icon: '🕸️', desc: 'Hidden login portal that logs attacker IP & browser fingerprint.' }
    };

    const generateToken = async () => {
        setGenerating(true);
        notify('INFO', 'DEPLOYING_DECOY', `Generating tactical ${tokenType} and priming sensors...`);

        setTimeout(() => {
            setGenerating(false);
            notify('SUCCESS', 'TOKEN_ACTIVE', `${tokenType} deployed. Sensors are live and awaiting interaction.`);

            // Simulate a "capture" after 10 seconds for demo
            setTimeout(() => {
                const newCapture = {
                    time: new Date().toLocaleTimeString(),
                    ip: '185.12.4' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255),
                    location: 'St. Petersburg, RU',
                    device: 'Kali Linux / Firefox 120.0',
                    action: 'DECOY_OPENED_CRITICAL'
                };
                setCaptureLog(prev => [newCapture, ...prev]);
                notify('ALERT', 'INTRUDER_TRAPPED', `Interceptor captured connection from ${newCapture.ip}! Retaliation data logged.`);
            }, 8000);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-30"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-red-500/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                ATTACKER_<span className="text-red-500">INTERCEPT</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                                OFFENSIVE_RETALIATION_SYSTEM // OMEGA_PACK_V2
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-card-extreme p-8 border-red-500/20 bg-red-950/5 shadow-2xl">
                                <h3 className="text-red-500 text-[10px] font-black uppercase mb-6 tracking-widest italic">Tactical_Decoy_Config</h3>
                                <div className="space-y-4">
                                    {Object.keys(tokenTypes).map(k => (
                                        <div
                                            key={k}
                                            onClick={() => setTokenType(k)}
                                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${tokenType === k ? 'border-red-500 bg-red-500/10' : 'border-white/5 opacity-40 hover:opacity-100 hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-2xl">{tokenTypes[k].icon}</span>
                                                <span className="text-xs font-black text-white">{tokenTypes[k].name}</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed">{tokenTypes[k].desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={generateToken}
                                    disabled={generating}
                                    className="w-full mt-8 bg-red-500 text-black font-black py-5 rounded-xl hover:bg-red-600 transition-all disabled:opacity-30 uppercase text-xs tracking-widest active:scale-95 shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                                >
                                    {generating ? 'PRIMING_SENSOR...' : 'DEPLOY INTERCEPTOR'}
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-8 space-y-8">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 min-h-[600px] flex flex-col overflow-hidden bg-black/40 relative">
                                <div className="bg-red-500/10 p-5 border-b border-red-500/20 flex justify-between items-center z-10">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Offensive_Intel_Capture_Log</span>
                                    <div className="flex gap-4 items-center">
                                        <span className="text-[9px] text-gray-600">{captureLog.length} INTERCEPTIONS_LOGGED</span>
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    {captureLog.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                            <div className="text-[150px] mb-8 font-black">🤺</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Awaiting intruder triggering sensors</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {captureLog.map((log, i) => (
                                                <div key={i} className="glass-card-extreme p-8 border-red-500/20 bg-red-950/10 animate-in slide-in-from-right duration-500 group relative">
                                                    <div className="absolute top-0 right-0 p-4 font-black text-[50px] text-red-500 opacity-5 -rotate-12 select-none pointer-events-none group-hover:opacity-10 transition-all uppercase">Exposed</div>
                                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center">
                                                        <div>
                                                            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Time_Log</div>
                                                            <div className="text-sm font-bold text-white">{log.time}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Source_IP</div>
                                                            <div className="text-sm font-bold text-white font-mono">{log.ip}</div>
                                                        </div>
                                                        <div className="hidden lg:block">
                                                            <div className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Location_Trace</div>
                                                            <div className="text-sm font-bold text-white">{log.location}</div>
                                                        </div>
                                                        <div>
                                                            <button className="text-[10px] bg-red-500 text-black font-black px-4 py-2 rounded-lg hover:bg-white transition-all uppercase tracking-widest">Execute_Retaliation →</button>
                                                        </div>
                                                    </div>
                                                    <div className="mt-6 pt-4 border-t border-red-500/10 flex items-center justify-between">
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Fingerprint: <span className="text-gray-200">{log.device}</span></div>
                                                        <div className="text-[10px] font-black text-red-500 uppercase animate-pulse">{log.action}</div>
                                                    </div>
                                                </div>
                                            ))}
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
