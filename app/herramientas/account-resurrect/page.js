"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function AccountResurrect() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [platform, setPlatform] = useState('FACEBOOK');
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [steps, setSteps] = useState([]);

    const platformConfig = {
        FACEBOOK: {
            color: '#1877F2',
            icon: '📘',
            guide: [
                'Identifying compromised primary email...',
                'Fetching Meta Trusted Contact verification URL...',
                'Generating Identity Shield Appeal document...',
                'Bypassing malicious 2FA (Recovery Mode)...',
                'Finalizing account restoration request.'
            ]
        },
        INSTAGRAM: {
            color: '#E4405F',
            icon: '📸',
            guide: [
                'Scanning for linked Facebook account integrity...',
                'Verifying original sign-up device ID...',
                'Generating Video Selfie verification bypass protocol...',
                'Requesting secure link to original email...',
                'Locking attacker out of current sessions.'
            ]
        },
        GOOGLE: {
            color: '#4285F4',
            icon: '📧',
            guide: [
                'Verifying original recovery phone number...',
                'Locating last known secure sign-in location...',
                'Generating "Account Recovery" escalation ticket...',
                'Checking for unauthorized app permissions...',
                'Restoring primary security control.'
            ]
        }
    };

    const startResurrection = async () => {
        if (!email) return;
        setProcessing(true);
        setSteps([]);
        notify('INFO', 'RESURRECTION_STARTED', `Initiating deep recovery protocol for ${platform} account: ${email}`);

        const config = platformConfig[platform];
        for (let i = 0; i < config.guide.length; i++) {
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
            setSteps(prev => [...prev, config.guide[i]]);
            notify('SUCCESS', 'STEP_COMPLETE', `Phase ${i + 1} verified.`);
        }

        setProcessing(false);
        notify('SUCCESS', 'RESTORATION_COMPLETE', `Final recovery package generated for ${email}. Follow instructions to regain access.`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                            ACCOUNT_<span className="text-[#00ff88]">RESURRECT</span>
                        </h1>
                        <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                            META_GOOGLE_RESTORATION_ENGINE // OMEGA_PACK_V2
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-1 border-r border-white/5 pr-8 space-y-4">
                            {Object.keys(platformConfig).map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPlatform(p)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${platform === p ? 'border-[#00ff88] bg-[#00ff88]/10' : 'border-white/5 grayscale opacity-40 hover:opacity-100 hover:grayscale-0'}`}
                                >
                                    <span className="text-3xl">{platformConfig[p].icon}</span>
                                    <span className="text-[10px] font-black">{p}</span>
                                </button>
                            ))}
                        </div>

                        <div className="lg:col-span-4 space-y-8">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 shadow-xl bg-black/40">
                                <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest italic">Target_Identity_Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="original-email@domain.com"
                                    className="w-full bg-black border-2 border-white/10 rounded-xl p-5 text-white font-bold focus:border-[#00ff88] outline-none transition-all placeholder:text-gray-800"
                                />
                                <button
                                    onClick={startResurrection}
                                    disabled={processing || !email}
                                    className="w-full mt-8 bg-[#00ff88] text-black font-black py-5 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] transition-all disabled:opacity-30 uppercase text-xs tracking-widest"
                                >
                                    {processing ? 'EXECUTING_RECOVERY...' : `RESURRECT ${platform}_ACCOUNT`}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-6 border-yellow-500/20 bg-yellow-950/5">
                                <h3 className="text-yellow-500 text-[10px] font-black uppercase mb-2">Legal_Disclaimer</h3>
                                <p className="text-[10px] font-bold text-gray-500 italic leading-relaxed uppercase">
                                    Resurrection tools use original owner verification protocols. Unauthorized use violates terms of service and local cyber-laws.
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 h-full min-h-[500px] flex flex-col overflow-hidden bg-black/60">
                                <div className="bg-[#00ff88]/5 p-5 border-b border-[#00ff88]/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest italic">Restoration_Pipeline</span>
                                    <span className="text-[9px] text-gray-600 font-bold">{processing ? 'UPLINK_ACTIVE' : 'READY'}</span>
                                </div>
                                <div className="p-8 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                                    {steps.length === 0 && !processing ? (
                                        <div className="flex-1 flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                            <div className="text-[120px] mb-8 font-black">{platformConfig[platform].icon}</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Awaiting target parameters</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {steps.map((text, i) => (
                                                <div key={i} className="flex gap-4 items-center animate-in slide-in-from-left duration-300">
                                                    <div className="w-8 h-8 rounded-full bg-[#00ff88] text-black flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(0,255,136,0.3)]">✓</div>
                                                    <div className="text-xs font-bold text-gray-200 uppercase tracking-widest">{text}</div>
                                                </div>
                                            ))}
                                            {processing && (
                                                <div className="flex gap-4 items-center animate-pulse">
                                                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-black text-xs animate-spin border-2 border-t-[#00ff88] border-gray-800"></div>
                                                    <div className="text-xs font-bold text-[#00ff88] uppercase tracking-[0.3em]">Processing_Next_Phase...</div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {!processing && steps.length > 0 && (
                                        <div className="mt-8 p-10 bg-[#00ff88]/10 rounded-3xl border-2 border-[#00ff88]/30 text-center animate-in zoom-in duration-500">
                                            <div className="text-6xl mb-6">🔱</div>
                                            <h4 className="text-2xl font-black text-white mb-2 uppercase">RESTORATION_SYNC_COMPLETE</h4>
                                            <p className="text-sm text-gray-500 mb-8 italic">Download the verification bypass packet and follow the original owner authentication link.</p>
                                            <button className="bg-[#00ff88] text-black font-black px-12 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] transition-all uppercase text-xs tracking-widest">DOWNLOAD_RECOVERY_KEY</button>
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
