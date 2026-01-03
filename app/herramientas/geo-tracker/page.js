"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import { useTranslation } from '../../context/LanguageContext';
import { useDefense } from '../../context/DefenseContext';

export default function GeoTracker() {
    const { t } = useTranslation();
    const { notify } = useDefense();
    const [target, setTarget] = useState('');
    const [tracking, setTracking] = useState(false);
    const [stats, setStats] = useState(null);

    const startTracking = () => {
        if (!target) return;
        setTracking(true);
        setStats(null);
        notify('INFO', 'GPS_PULSE_SENT', `Satellite uplink established for target ${target}`);

        setTimeout(() => {
            const mockStats = {
                lat: (Math.random() * 180 - 90).toFixed(6),
                lng: (Math.random() * 360 - 180).toFixed(6),
                city: 'Tijuana',
                country: 'Mexico',
                isp: 'Izzi Telecom',
                accuracy: '1.2m',
                altitude: '24m',
                speed: '0.4km/h'
            };
            setStats(mockStats);
            setTracking(false);
            notify('SUCCESS', 'TARGET_LOCKED', `Precise coordinates pinpointed within ${mockStats.accuracy} radius.`);
        }, 2200);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 uppercase">
                                GEO_<span className="text-[#00ff88]">TRACKER</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                                REAL_TIME_GEOINT_OVERLAY // OMEGA_PACK_V1
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-card-extreme p-8 border-[#00ff88]/20 bg-[#00ff88]/5 shadow-xl">
                                <label className="block text-[10px] font-black text-[#00ff88] uppercase mb-4 tracking-widest italic font-mono">Input_Target_IP / Host</label>
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="8.8.8.8"
                                    className="w-full bg-black border-2 border-[#00ff88]/30 rounded-xl p-5 text-white font-bold focus:border-[#00ff88] outline-none transition-all placeholder:text-gray-800"
                                />
                                <button
                                    onClick={startTracking}
                                    disabled={tracking || !target}
                                    className="w-full mt-6 bg-[#00ff88] text-black font-black py-4 rounded-xl hover:bg-[#00cc6a] transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95 text-xs tracking-[0.3em] uppercase"
                                >
                                    {tracking ? 'PULSING_SATELLITE...' : 'LOCK_TARGET'}
                                </button>
                            </div>

                            {stats && (
                                <div className="glass-card-extreme p-8 border-white/10 space-y-4 animate-in slide-in-from-bottom duration-500">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2">Target_Geographics</h3>
                                    <div className="space-y-4 font-bold uppercase tracking-widest text-[9px]">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-600">LATITUDE:</span>
                                            <span className="text-white">{stats.lat}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-600">LONGITUDE:</span>
                                            <span className="text-white">{stats.lng}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-600">LOCATION:</span>
                                            <span className="text-[#00ff88]">{stats.city}, {stats.country}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-600">ACCURACY:</span>
                                            <span className="text-[#00ff88]">{stats.accuracy}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-gray-600">ISP_UPLINK:</span>
                                            <span className="text-gray-400">{stats.isp}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-3">
                            <div className="glass-card-extreme cyber-border-extreme !p-0 min-h-[600px] flex flex-col overflow-hidden bg-black/40 relative">
                                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=2&size=1000x800&key=MOCK')] bg-center bg-cover"></div>
                                <div className="bg-black/80 p-5 border-b border-white/5 flex justify-between items-center z-10 relative">
                                    <span className="text-[10px] font-black text-[#00ff88] uppercase tracking-widest italic">Live_Geospatial_HUD</span>
                                    <span className="text-[8px] text-gray-600 animate-pulse">UPDATING_TELEMETRY...</span>
                                </div>
                                <div className="flex-1 flex items-center justify-center relative z-10">
                                    {tracking ? (
                                        <div className="text-center">
                                            <div className="relative inline-block mb-8">
                                                <div className="w-32 h-32 border-2 border-[#00ff88]/20 rounded-full animate-ping"></div>
                                                <div className="w-24 h-24 border-2 border-[#00ff88]/40 rounded-full animate-ping absolute top-4 left-4" style={{ animationDelay: '0.4s' }}></div>
                                                <div className="w-16 h-16 border-4 border-[#00ff88] border-t-transparent rounded-full animate-spin absolute top-8 left-8"></div>
                                            </div>
                                            <div className="text-[10px] font-black text-[#00ff88] tracking-[0.5em] animate-pulse">SYNCHRONIZING_ORBITAL_PLANE...</div>
                                        </div>
                                    ) : stats ? (
                                        <div className="w-full h-full p-20 flex items-center justify-center">
                                            <div className="text-center space-y-8 animate-in zoom-in duration-700">
                                                <div className="text-[120px] drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">📍</div>
                                                <div className="space-y-2">
                                                    <div className="text-4xl font-black text-white uppercase tracking-tighter">Target_Acquired</div>
                                                    <div className="text-[10px] font-black text-[#00ff88] tracking-[0.3em] uppercase opacity-60">Triangulation completed successfully</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-32 grayscale">
                                            <div className="text-[150px] mb-8 font-black">🌏</div>
                                            <div className="text-[10px] font-black tracking-[1em] uppercase text-center">Global satellite grid idle</div>
                                        </div>
                                    )}
                                </div>

                                {/* HUD Overlays */}
                                {stats && (
                                    <div className="absolute top-20 right-8 p-4 glass-card-extreme border-white/5 text-[9px] font-black uppercase tracking-widest space-y-2 z-20">
                                        <div className="text-[#00ff88] mb-2">TELEMETRY_LOG</div>
                                        <div className="flex justify-between w-40 text-gray-500"><span>SPEED:</span> <span className="text-white">{stats.speed}</span></div>
                                        <div className="flex justify-between w-40 text-gray-500"><span>ALT:</span> <span className="text-white">{stats.altitude}</span></div>
                                        <div className="flex justify-between w-40 text-gray-500"><span>SAT_SYNC:</span> <span className="text-[#00ff88]">98%</span></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
