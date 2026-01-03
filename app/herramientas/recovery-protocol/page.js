"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function RecoveryProtocol() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [step, setStep] = useState(0);
    const [type, setType] = useState(null);

    const protocols = {
        SOCIAL: [
            "Disconnect all connected applications (API access).",
            "Generate a legal report of impersonation/hacking.",
            "Contact official support with identity verification (ID/Selfie).",
            "Enable 2FA (TOTP preferred) and change backup codes.",
            "Verify recovery email/phone security history."
        ],
        WEB: [
            "Lock domain at registrar level (Transfer Lock).",
            "Flush all DNS/Cloudflare cache and reset API keys.",
            "Check for malicious hidden files in root directory.",
            "Contact hosting provider's safety department.",
            "Submit abuse report to Google Search Console to protect SEO."
        ]
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            RECOVERY_<span className="text-[#00ff88]">PROTOCOL</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            ASSET_RESTORATION_GUIDE // OMEGA_PACK_V1
                        </div>
                    </header>

                    {!type ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-500">
                            <ProtocolCard
                                icon="👤"
                                title="SOCIALRECOVERY"
                                desc="Regain access to Instagram, X, Facebook or Gmail accounts."
                                onClick={() => { setType('SOCIAL'); notify('INFO', 'RECOVERY_INIT', 'Starting Social Identity Restoration Protocol'); }}
                            />
                            <ProtocolCard
                                icon="🌐"
                                title="DOMAINRESCUE"
                                desc="Recover hijacked domains, websites or control panels."
                                onClick={() => { setType('WEB'); notify('INFO', 'RECOVERY_INIT', 'Starting Infrastructure Restoration Protocol'); }}
                            />
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right duration-500">
                            <div className="flex justify-between items-center bg-[#00ff88]/5 p-6 rounded-2xl border border-[#00ff88]/20">
                                <div>
                                    <h4 className="text-[10px] font-black text-[#00ff88] uppercase tracking-[0.3em] mb-1">Active_Scenario</h4>
                                    <div className="text-2xl font-black text-white">{type === 'SOCIAL' ? 'SOCIAL_IDENTITY_HIJACK' : 'WEB_ASSET_TAKEOVER'}</div>
                                </div>
                                <button
                                    onClick={() => { setType(null); setStep(0); }}
                                    className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    Cancel_Operation [X]
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-8 space-y-4">
                                    {protocols[type].map((action, i) => (
                                        <div
                                            key={i}
                                            className={`p-6 rounded-2xl border-2 transition-all duration-300 flex gap-6 items-center ${i <= step ? 'border-[#00ff88] bg-[#00ff88]/5' : 'border-white/5 opacity-30 grayscale'}`}
                                            onClick={() => i === step && setStep(prev => prev + 1)}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${i < step ? 'bg-[#00ff88] text-black' : 'bg-black border border-white/20 text-white'}`}>
                                                {i < step ? '✓' : i + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-xs font-bold leading-relaxed">{action}</div>
                                            </div>
                                        </div>
                                    ))}

                                    {step === protocols[type].length && (
                                        <div className="p-10 glass-card-extreme border-[#00ff88] text-center animate-in zoom-in duration-500">
                                            <div className="text-5xl mb-6">✅</div>
                                            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Protocol Completed</h3>
                                            <p className="text-sm text-gray-500 mb-8 italic">Your assets have been functionally hardened. Monitor for 48 hours for lateral re-entry attempts.</p>
                                            <button
                                                onClick={() => { setType(null); setStep(0); notify('SUCCESS', 'ASSET_SECURED', 'Post-incident recovery protocol finalized.'); }}
                                                className="bg-[#00ff88] text-black font-black px-12 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all uppercase text-[10px] tracking-widest"
                                            >
                                                Close Incident
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="lg:col-span-4 flex flex-col gap-6">
                                    <div className="glass-card-extreme p-8 border-yellow-500/20 bg-yellow-950/5">
                                        <h3 className="text-yellow-500 text-[10px] font-black uppercase mb-4 tracking-widest">Legal_Notice</h3>
                                        <p className="text-[10px] font-bold text-gray-400 italic leading-relaxed uppercase">
                                            Follow these steps ONLY for assets you legally own. Unauthorized access to third-party accounts is a criminal offense.
                                        </p>
                                    </div>
                                    <div className="flex-1 glass-card-extreme p-8 border-white/5 bg-black/40 flex flex-col justify-center text-center opacity-40">
                                        <div className="text-4xl mb-4">🆘</div>
                                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Incident Response Support is online.</div>
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

function ProtocolCard({ icon, title, desc, onClick }) {
    return (
        <div
            onClick={onClick}
            className="glass-card-extreme p-10 border-2 border-white/5 hover:border-[#00ff88]/40 transition-all group flex flex-col items-center text-center cursor-pointer active:scale-95"
        >
            <div className="text-7xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform">{icon}</div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tighter group-hover:text-[#00ff88] transition-colors uppercase">{title}</h3>
            <p className="text-sm text-gray-500 font-bold max-w-xs">{desc}</p>
            <div className="mt-10 text-[10px] font-black text-[#00ff88] opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.4em]">INITIATE_TASK →</div>
        </div>
    );
}
