'use client';
import { Sidebar } from '../components/DashboardComponents';

export default function Contacto() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>
                <div className="max-w-4xl mx-auto mt-20 text-center">
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-8 animate-pulse">
                        CONTACT_<span className="text-[#00ff88]">UPLINK</span>
                    </h1>
                    <div className="glass-card-extreme p-10 cyber-border-extreme inline-block text-left">
                        <div className="space-y-6">
                            <div>
                                <div className="text-[10px] font-black text-[#00ff88] uppercase tracking-[0.3em] mb-2">Secure_Email</div>
                                <div className="text-2xl font-bold text-white italic">ops@byteguard.research</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-[#00ff88] uppercase tracking-[0.3em] mb-2">Encrypted_Signal</div>
                                <div className="text-2xl font-bold text-white italic">+1 (555) BYTE-GUARD</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
