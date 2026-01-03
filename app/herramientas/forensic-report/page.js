"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function ForensicReport() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [generating, setGenerating] = useState(false);
    const [reportData, setReportData] = useState({
        incidentId: 'INC-PENDING',
        target: 'Meta/Facebook Account @johndoe',
        type: 'Intrusion / Identity Theft',
        evidenceCount: 14
    });

    useEffect(() => {
        setTimeout(() => {
            setReportData(prev => ({
                ...prev,
                incidentId: `INC-${Math.floor(Math.random() * 999999)}`
            }));
        }, 0);
    }, []);

    const generatePDF = () => {
        setGenerating(true);
        notify('INFO', 'GENERATING_EVIDENCE', 'Aggregating logs, IP traces, and cryptographic signatures...');

        setTimeout(() => {
            setGenerating(false);
            notify('SUCCESS', 'REPORT_READY', `Forensic Dossier ${reportData.incidentId} is ready for submission to law enforcement.`);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-10"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                FORENSIC_<span className="text-[#00ff88]">REPORT</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                                LAW_ENFORCEMENT_COMPLIANT // OMEGA_PACK_V2
                            </div>
                        </div>
                    </header>

                    <div className="glass-card-extreme cyber-border-extreme !p-12 space-y-12 bg-black/40">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <IncidentField label="Incident_ID" value={reportData.incidentId} />
                                <IncidentField label="Asset_Target" value={reportData.target} />
                                <IncidentField label="Violation_Type" value={reportData.type} />
                                <IncidentField label="Evidence_Nodes" value={`${reportData.evidenceCount} Segments Detected`} />
                            </div>
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                <div className="text-7xl mb-4">📋</div>
                                <div className="text-[10px] font-black tracking-widest uppercase">Digital_Proof_Chain</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest italic">Compliance_Checklist</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CheckItem label="IP Geolocation Traces" />
                                <CheckItem label="Device Fingerprint Hashes" />
                                <CheckItem label="OAuth Revocation Logs" />
                                <CheckItem label="Identity Verification Pack" />
                                <CheckItem label="Timestamp Integrity (NTP)" />
                                <CheckItem label="Attacker Metadata" />
                            </div>
                        </div>

                        <button
                            onClick={generatePDF}
                            disabled={generating}
                            className="w-full bg-white text-black font-black py-6 rounded-2xl hover:bg-[#00ff88] transition-all disabled:opacity-30 flex items-center justify-center gap-4 text-xs tracking-[0.5em] uppercase active:scale-95 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
                        >
                            {generating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                    COMPILING_DOSSIER...
                                </>
                            ) : (
                                <>EXPORT FORENSIC PDF Dossier</>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 p-6 glass-card-extreme border-white/5 opacity-40 text-center">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                            Warning: This document contains sensitive cryptographic proofs. Handle with extreme caution during transfer to third parties.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function IncidentField({ label, value }) {
    return (
        <div className="border-b border-white/5 pb-4">
            <div className="text-[9px] font-black text-[#00ff88] uppercase tracking-widest mb-1 italic opacity-60">Field_{label}</div>
            <div className="text-lg font-black text-white tracking-tight">{value}</div>
        </div>
    );
}

function CheckItem({ label }) {
    return (
        <div className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-white/5">
            <div className="w-2 h-2 bg-[#00ff88] rounded-full shadow-[0_0_8px_#00ff88]"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
        </div>
    );
}
