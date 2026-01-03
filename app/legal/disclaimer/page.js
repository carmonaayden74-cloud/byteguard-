'use client';
import { Sidebar } from '../../components/DashboardComponents';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>
                <div className="max-w-4xl mx-auto mt-20">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-8 border-b border-white/10 pb-4">
                        LEGAL_<span className="text-[#00ff88]">DISCLAIMER</span>.v1
                    </h1>

                    <div className="space-y-8 text-sm leading-relaxed text-gray-400">
                        <section className="glass-card p-6 border-l-4 border-yellow-500/50 bg-yellow-500/5">
                            <h2 className="text-[#00ff88] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                ⚠️ ATTENTION_REQUIRED
                            </h2>
                            <p>
                                ByteGuard is a diagnostic and educational cybersecurity tool suite. The results provided by this platform reflect a point-in-time assessment based on publicly available data and heuristic analysis. It does NOT substitute for a full, professional security audit or penetration test conducted by certified specialists.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-white font-bold uppercase tracking-wider">1. LIMITATION_OF_LIABILITY</h3>
                            <p>
                                Under no circumstances shall ByteGuard, its developers, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the tools provided. Users assume 100% responsibility for the actions taken based on ByteGuard reports.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-white font-bold uppercase tracking-wider">2. NO_WARRANTY</h3>
                            <p>
                                The software is provided &quot;AS IS&quot;, without warranty of any kind. We do not guarantee that &quot;Clean&quot; or &quot;Secure&quot; ratings reflect absolute safety from advanced persistent threats (APTs) or zero-day vulnerabilities.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-white font-bold uppercase tracking-wider">3. DATA_PRIVACY</h3>
                            <p>
                                ByteGuard prioritizes client-side processing. Sensitive operations (such as Steganography and Password Generation) occur exclusively in your browser&apos;s memory. No sensitive files or plain-text passwords are stored on our servers unless explicitly stated (e.g., incident logs for SOC simulation).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-white font-bold uppercase tracking-wider">4. ETHICAL_USE_POLICY</h3>
                            <p>
                                You agree to use these tools only on systems you own or have explicit, written permission to audit. Unauthorized testing is illegal and strictly prohibited.
                            </p>
                        </section>

                        <div className="mt-12 pt-8 border-t border-white/5 text-[10px] uppercase font-bold text-white/30 tracking-[0.3em] flex justify-between items-center">
                            <span>Last Updated: Jan 2026</span>
                            <span className="text-[#00ff88]">ByteGuard Research Protocol Verified</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
