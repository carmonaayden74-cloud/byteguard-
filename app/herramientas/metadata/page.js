"use client";

import { useState } from 'react';
import { Sidebar, TerminalLog } from '../../components/DashboardComponents';
import EXIF from 'exif-js';
import Image from 'next/image';
import { useDefense } from "../../context/DefenseContext";

export default function MetadataAnalyzer() {
    const { notify } = useDefense();
    const [image, setImage] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const convertDMSToDD = (dms, ref) => {
        let dd = dms[0] + dms[1] / 60 + dms[2] / (60 * 60);
        if (ref === "S" || ref === "W") {
            dd = dd * -1;
        }
        return dd;
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError('');
        setMetadata(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);

            try {
                if (!EXIF) throw new Error('EXIF_LIB_NOT_INITIALIZED');

                EXIF.getData(file, function () {
                    const allTags = EXIF.getAllTags(this);
                    if (!allTags || Object.keys(allTags).length === 0) {
                        setError('NO_METADATA_DETECTED: Matrix is sanitized or incompatible.');
                        notify('WARNING', 'AUDIT_EMPTY', 'No forensic metadata found in target.');
                    } else {
                        if (allTags.GPSLatitude && allTags.GPSLongitude) {
                            const lat = convertDMSToDD(allTags.GPSLatitude, allTags.GPSLatitudeRef);
                            const lon = convertDMSToDD(allTags.GPSLongitude, allTags.GPSLongitudeRef);
                            allTags.GoogleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                        }
                        setMetadata(allTags);
                        notify('SUCCESS', 'FORENSIC_EXTRACTION', 'Metadata successfully deconstructed.');
                    }
                    setLoading(false);
                });
            } catch (err) {
                setError('FATAL_PROCESS_ERROR: ' + err.message);
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="laser-line"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                                METADATA_<span className="text-[#00ff88]">FORENSICS</span>
                            </h1>
                            <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse shadow-[0_0_10px_#00ff88]"></span>
                                EXIF_DECONSTRUCTION_ENGINE // v2.0
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Evidence Upload */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="glass-card-extreme p-8 cyber-border-extreme relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 text-7xl grayscale group-hover:opacity-20 transition-all duration-1000">📸</div>
                                <h3 className="text-[#00ff88] text-[10px] font-black uppercase mb-6 tracking-widest">Target_Acquisition</h3>

                                <div className="border-2 border-dashed border-[#00ff88]/20 rounded-2xl p-10 text-center hover:border-[#00ff88] transition-all cursor-pointer relative group/upload">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/tiff"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="text-4xl mb-4 group-hover/upload:scale-110 transition-transform">📁</div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
                                        Drop secure container here<br />
                                        <span className="text-gray-600 font-bold">[JPG / TIFF / RAW]</span>
                                    </p>
                                </div>

                                {image && (
                                    <div className="mt-8 rounded-2xl overflow-hidden border-2 border-white/5 shadow-2xl animate-in zoom-in duration-500">
                                        <Image
                                            src={image}
                                            alt="Forensic Evidence"
                                            width={600}
                                            height={400}
                                            unoptimized
                                            className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                )}
                            </div>

                            <TerminalLog />
                        </div>

                        {/* Extraction Report */}
                        <div className="lg:col-span-7">
                            <div className="glass-card-extreme p-8 cyber-border-extreme min-h-[600px] flex flex-col">
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                    <h3 className="text-[#00ff88] text-[10px] font-black uppercase tracking-widest italic">Extraction_Report_Internal</h3>
                                    {loading && <span className="text-[9px] font-black text-yellow-500 animate-pulse tracking-widest">DECONSTRUCTING_MATRIX...</span>}
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
                                    {!metadata && !error && !loading && (
                                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                                            <div className="text-6xl mb-6">🛰️</div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting_Signal_Source</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="bg-red-500/10 border-2 border-red-500/30 p-6 rounded-2xl text-red-500 text-[10px] font-black tracking-widest uppercase animate-in shake">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    {metadata && (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <DataBox label="Hardware_Signature" value={`${metadata.Make || 'UNIDENTIFIED'} ${metadata.Model || ''}`} />
                                                <DataBox label="Temporal_Vector" value={metadata.DateTime || metadata.DateTimeOriginal || 'NOT_STAMPED'} />
                                                <DataBox label="Logic_System" value={metadata.Software || 'LEGACY_UNKNOWN'} />
                                                <DataBox label="Optic_Dilation" value={metadata.FNumber ? `f/${metadata.FNumber}` : 'N/A'} />
                                            </div>

                                            {metadata.GoogleMapsLink && (
                                                <div className="bg-[#00ff88]/5 border-2 border-[#00ff88]/20 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-5">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h4 className="text-[#00ff88] text-[10px] font-black uppercase tracking-widest mb-1">Geospatial_Pulse_Detected 📍</h4>
                                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Physical coordinate bridge found in metadata bridge.</p>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={metadata.GoogleMapsLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-floating-extreme !py-3 !text-[10px] w-full"
                                                    >
                                                        OPEN_COORDINATE_BRIDGE
                                                    </a>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-gray-600 text-[10px] font-black uppercase tracking-widest mb-4 italic">Raw_Buffer_Dump</h4>
                                                <div className="space-y-1 bg-black/40 p-6 rounded-2xl border border-white/5">
                                                    {Object.entries(metadata).map(([key, value]) => {
                                                        if (typeof value === 'object' || key === 'MakerNote' || key === 'UserComment' || key === 'GoogleMapsLink') return null;
                                                        return (
                                                            <div key={key} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                                                <span className="text-[9px] font-black text-gray-500 uppercase group-hover:text-gray-300">{key}</span>
                                                                <span className="text-[10px] font-mono text-[#00ff88] truncate ml-4">{String(value)}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
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

function DataBox({ label, value }) {
    return (
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl group hover:border-[#00ff88]/30 transition-all">
            <div className="text-[9px] font-black text-gray-600 mb-2 uppercase tracking-widest">{label}</div>
            <div className="text-[11px] font-black text-white uppercase tracking-tighter truncate">{value}</div>
        </div>
    );
}
