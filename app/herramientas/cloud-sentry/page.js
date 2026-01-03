"use client";

import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function CloudSentry() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [provider, setProvider] = useState('AWS');
    const [scannedAssets, setScannedAssets] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [stats, setStats] = useState({ secure: 0, critical: 0, warnings: 0 });

    const runCloudScan = async () => {
        setScanning(true);
        setScannedAssets([]);
        setStats({ secure: 0, critical: 0, warnings: 0 });
        notify('INFO', 'CLOUD_SCAN_STARTED', `Initiating deeper audit on ${provider} infrastructure...`);

        const assetTypes = provider === 'AWS' ? ['S3_BUCKET', 'IAM_ROLE', 'EC2_INSTANCE', 'RDS_DB', 'VPC_CONFIG'] : ['BLOB_STORAGE', 'AD_TENANT', 'VM_INSTANCE', 'SQL_DB', 'VNET_CONFIG'];

        for (let i = 0; i < 15; i++) {
            await new Promise(r => setTimeout(r, 200 + Math.random() * 300));
            const statusRoll = Math.random();
            const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];

            const newAsset = {
                id: `${provider.toLowerCase()}-${assetType.toLowerCase()}-${Math.floor(Math.random() * 9999)}`,
                type: assetType,
                status: statusRoll > 0.8 ? 'CRITICAL' : (statusRoll > 0.6 ? 'WARNING' : 'SECURE'),
                finding: statusRoll > 0.8 ? 'Public Access Detected' : (statusRoll > 0.6 ? 'Weak MFA Policy' : 'Hardened / Compliant')
            };

            setScannedAssets(prev => [newAsset, ...prev]);

            setStats(prev => ({
                ...prev,
                secure: newAsset.status === 'SECURE' ? prev.secure + 1 : prev.secure,
                critical: newAsset.status === 'CRITICAL' ? prev.critical + 1 : prev.critical,
                warnings: newAsset.status === 'WARNING' ? prev.warnings + 1 : prev.warnings
            }));

            if (newAsset.status === 'CRITICAL') {
                notify('ALERT', 'CLOUD_LEAK_DETECTED', `Exposure found in ${newAsset.id}: ${newAsset.finding}`);
            }
        }

        setScanning(false);
        notify('SUCCESS', 'CLOUD_SCAN_COMPLETE', `Finalized audit. Identified ${stats.critical + stats.warnings} potential risk vectors.`);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                CLOUD_<span className="text-[#00ff88]">SENTRY</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                INFRASTRUCTURE_HYGIENE_SCANNER // MULTI_CLOUD_V2
                            </div>
                        </div>
                        <div className="flex gap-4">
                            {['AWS', 'AZURE', 'GCP'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setProvider(p)}
                                    className={`px-6 py-2 rounded-lg border-2 font-black transition-all text-xs tracking-widest ${provider === p ? 'border-[#00ff88] text-[#00ff88] bg-[#00ff88]/5 shadow-[0_0_20px_rgba(0,255,136,0.2)]' : 'border-white/5 text-gray-500 hover:border-white/20'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 shadow-xl bg-[#00ff88]/5">
                                <h3 className="text-[10px] font-black text-[#00ff88] uppercase mb-6 tracking-widest">Control_Center</h3>
                                <button
                                    onClick={runCloudScan}
                                    disabled={scanning}
                                    className="w-full bg-[#00ff88] text-black font-black py-5 rounded-xl hover:bg-[#00cc6a] transition-all disabled:opacity-30 uppercase text-xs tracking-[0.2em]"
                                >
                                    {scanning ? 'MAPPING_INFRA...' : 'LAUNCH CLOUD AUDIT'}
                                </button>
                            </div>

                            <div className="glass-card-extreme p-8 border-white/5 space-y-6">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest">Audit_Impact</h3>
                                <div className="space-y-4">
                                    <ImpactStat label="Hardened_Assets" value={stats.secure} color="#00ff88" />
                                    <ImpactStat label="Risk_Warnings" value={stats.warnings} color="#f59e0b" />
                                    <ImpactStat label="Breach_Critical" value={stats.critical} color="#ef4444" />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-9">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 min-h-[600px] flex flex-col overflow-hidden">
                                <div className="bg-black/40 p-4 border-b border-white/5 flex justify-between items-center text-[10px] font-black tracking-widest text-gray-500 uppercase">
                                    <span>Asset_Discovery_Pipeline</span>
                                    <span className="animate-pulse">{provider}_REGION: GLOBAL</span>
                                </div>
                                <div className="flex-1 overflow-y-auto max-h-[700px] custom-scrollbar">
                                    {scannedAssets.length === 0 && !scanning ? (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-32">
                                            <div className="text-[120px] mb-8 grayscale">☁️</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase">Connect Cloud SDK to begin audit</div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6 h-fit content-start">
                                            {scannedAssets.map((asset) => (
                                                <div key={asset.id} className={`p-6 rounded-2xl border-2 bg-black/40 transition-all group hover:scale-[1.02] ${asset.status === 'CRITICAL' ? 'border-red-500/30' : (asset.status === 'WARNING' ? 'border-yellow-500/30' : 'border-[#00ff88]/10')}`}>
                                                    <div className="flex justify-between items-start mb-4 text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-gray-600">{asset.type}</span>
                                                        <span className={asset.status === 'CRITICAL' ? 'text-red-500 animate-pulse' : (asset.status === 'WARNING' ? 'text-yellow-500' : 'text-[#00ff88]')}>
                                                            {asset.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-black text-white mb-2 overflow-hidden text-ellipsis">{asset.id}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${asset.status === 'CRITICAL' ? 'bg-red-500' : (asset.status === 'WARNING' ? 'bg-yellow-500' : 'bg-[#00ff88]')}`}></div>
                                                        <span className="text-[9px] font-bold text-gray-400 italic uppercase">{asset.finding}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {scanning && (
                                                <div className="col-span-full py-12 text-center">
                                                    <div className="inline-block w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mb-4"></div>
                                                    <div className="text-[10px] font-black text-[#00ff88] tracking-[0.5em] animate-pulse uppercase">Traversing_Provider_Backbone...</div>
                                                </div>
                                            )}
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

function ImpactStat({ label, value, color }) {
    return (
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{label}</span>
            <span className="text-2xl font-black tabular-nums" style={{ color }}>{value}</span>
        </div>
    );
}
