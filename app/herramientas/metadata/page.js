"use client";
import { useState } from 'react';
import { Sidebar } from '../../components/DashboardComponents';
import EXIF from 'exif-js';
import Image from 'next/image';

export default function MetadataAnalyzer() {
    const [image, setImage] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError('');
        setMetadata(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);

            // Extract EXIF
            try {
                if (!EXIF) throw new Error('EXIF library not loaded');

                EXIF.getData(file, function () {
                    const allTags = EXIF.getAllTags(this);
                    if (!allTags || Object.keys(allTags).length === 0) {
                        setError('No metadata found in this image. (Note: Many social media platforms strip metadata)');
                    } else {
                        // Format GPS if available
                        if (allTags.GPSLatitude && allTags.GPSLongitude) {
                            const lat = convertDMSToDD(allTags.GPSLatitude, allTags.GPSLatitudeRef);
                            const lon = convertDMSToDD(allTags.GPSLongitude, allTags.GPSLongitudeRef);
                            allTags.GoogleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
                        }
                        setMetadata(allTags);
                    }
                    setLoading(false);
                });
            } catch (err) {
                console.error(err);
                setError('Error processing image metadata: ' + err.message);
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const convertDMSToDD = (dms, ref) => {
        let dd = dms[0] + dms[1] / 60 + dms[2] / (60 * 60);
        if (ref === "S" || ref === "W") {
            dd = dd * -1;
        }
        return dd;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    FORENSIC METADATA ANALYZER <span className="text-sm text-gray-500 font-normal">EXIF EXTRACTOR</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">1. EVIDENCE UPLOAD</h2>
                        <div className="border-2 border-dashed border-[#00ff88]/30 rounded-lg p-8 text-center hover:border-[#00ff88] transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/jpeg,image/tiff"
                                onChange={handleImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="text-[#00ff88] text-4xl mb-2">📸</div>
                            <p className="text-gray-400 mb-4">You&apos;re using the free version. Upgrade to PRO for full Exif analysis.</p>
                            <p className="text-xs text-gray-600 mt-2">Supports JPG/TIFF. PNGs usually don&apos;t carry EXIF.</p>
                        </div>

                        {image && (
                            <div className="mt-6 border border-[#00ff88]/20 rounded p-2">
                                <Image
                                    src={image}
                                    alt="Evidence"
                                    width={500}
                                    height={300}
                                    unoptimized
                                    className="w-full h-auto object-contain max-h-64"
                                />
                            </div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="bg-[#001100] border border-[#00ff88]/30 rounded-xl p-6 shadow-lg flex flex-col h-[600px]">
                        <div className="flex justify-between items-center mb-4 border-b border-[#00ff88]/20 pb-2">
                            <h2 className="text-xl font-bold text-[#00ff88]">2. EXTRACTION REPORT</h2>
                            {loading && <span className="text-yellow-400 animate-pulse">ANALYZING...</span>}
                        </div>

                        <div className="flex-1 overflow-y-auto font-mono text-sm custom-scrollbar">
                            {!metadata && !error && (
                                <div className="text-gray-600 italic text-center mt-20">
                                    Waiting for image data...
                                </div>
                            )}

                            {error && (
                                <div className="text-red-400 border border-red-900/50 bg-red-900/10 p-4 rounded text-center">
                                    ⚠️ {error}
                                </div>
                            )}

                            {metadata && (
                                <div className="space-y-4">
                                    {/* Critical Info */}
                                    <div className="bg-[#002200] p-4 rounded border border-[#00ff88]/20">
                                        <h3 className="text-[#00ff88] font-bold mb-2 border-b border-[#00ff88]/10">CRITICAL DATA</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-gray-400">Make/Model:</div>
                                            <div className="text-white">{metadata.Make || 'N/A'} {metadata.Model || ''}</div>

                                            <div className="text-gray-400">Date/Time:</div>
                                            <div className="text-white">{metadata.DateTime || metadata.DateTimeOriginal || 'N/A'}</div>

                                            <div className="text-gray-400">Software:</div>
                                            <div className="text-white">{metadata.Software || 'N/A'}</div>
                                        </div>
                                    </div>

                                    {/* GPS Data */}
                                    {metadata.GoogleMapsLink ? (
                                        <div className="bg-[#002200] p-4 rounded border border-[#00ff88]/20">
                                            <h3 className="text-[#00ff88] font-bold mb-2 border-b border-[#00ff88]/10">GEOLOCATION FOUND 📍</h3>
                                            <div className="text-white mb-2">
                                                Lat: {metadata.GPSLatitude ? metadata.GPSLatitude[0] : ''}°... <br />
                                                Lon: {metadata.GPSLongitude ? metadata.GPSLongitude[0] : ''}°...
                                            </div>
                                            <a
                                                href={metadata.GoogleMapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block bg-[#00ff88] text-black px-4 py-2 rounded font-bold hover:bg-white transition-colors"
                                            >
                                                OPEN IN GOOGLE MAPS
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 text-xs text-center border border-dashed border-gray-800 p-2">
                                            No GPS data found in this image.
                                        </div>
                                    )}

                                    {/* Raw Data */}
                                    <div>
                                        <h3 className="text-gray-500 font-bold mb-2">RAW METADATA DUMP</h3>
                                        <div className="space-y-1 text-xs text-gray-400">
                                            {Object.entries(metadata).map(([key, value]) => {
                                                if (typeof value === 'object') return null; // Skip complex objects for simple view
                                                if (key === 'MakerNote') return null; // Too long
                                                if (key === 'UserComment') return null; // Too long
                                                return (
                                                    <div key={key} className="flex border-b border-[#00ff88]/5 py-1">
                                                        <span className="w-1/2 overflow-hidden text-ellipsis">{key}</span>
                                                        <span className="w-1/2 text-[#00ff88] overflow-hidden text-ellipsis">{String(value)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
