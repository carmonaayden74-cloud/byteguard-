"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- UTILS ---
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// --- COMPONENTS ---

export function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'DASHBOARD', path: '/laboratorio', icon: '⚡' },
        { name: 'SITE AUDITOR', path: '/herramientas/site-auditor', icon: '🛡️' },
        { name: 'PORT SCANNER', path: '/herramientas/port-scanner', icon: '🎯' },
        { name: 'DNS LOOKUP', path: '/herramientas/dns-lookup', icon: '🌐' },
        { name: 'IP INTELLIGENCE', path: '/herramientas/ip-intel', icon: '📡' },
        { name: 'STEGANOGRAPHY', path: '/herramientas/steganography', icon: '🖼️' },
        { name: 'LINK FORENSICS', path: '/herramientas/phishing', icon: '🔎' },
        { name: 'SQLI TESTER & FUZZER', path: '/herramientas/sqli', icon: '💉' },
        { name: 'BROWSER AUDITOR', path: '/herramientas/browser-auditor', icon: '🕵️' },
        { name: 'PASSWORD FORGE', path: '/herramientas/generador-passwords', icon: '🔑' },
        { name: 'METADATA FORENSICS', path: '/herramientas/metadata', icon: '📸' },
        { name: 'ENTROPY AUDITOR', path: '/herramientas/bruteforce-sim', icon: '⚡' },
        { name: 'WEB HONEYPOT', path: '/herramientas/honeypot', icon: '🕸️' },
        { name: 'EXIT', path: '/', icon: '🚪' },
    ];

    return (
        <div className="w-64 h-screen bg-[#050505]/90 backdrop-blur-xl border-r border-[#00ff88]/20 flex flex-col p-4 font-mono sticky top-0 shrink-0 z-[100]">
            <div className="mb-8 p-4 border-2 border-[#00ff88] text-[#00ff88] text-center font-black text-2xl tracking-[0.2em] shadow-[0_0_20px_rgba(0,255,136,0.3)] cyber-border-extreme">
                BYTEGUARD
            </div>

            <nav className="flex-1 space-y-1 custom-scrollbar overflow-y-auto pr-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center space-x-3 p-3 text-xs font-bold tracking-widest transition-all duration-300 rounded-lg group ${isActive
                                ? 'bg-[#00ff88] text-black shadow-[0_0_15px_rgba(0,255,136,0.4)]'
                                : 'text-gray-500 hover:text-[#00ff88] hover:bg-[#00ff88]/5 border border-transparent hover:border-[#00ff88]/20'
                                }`}
                        >
                            <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-120'}`}>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-6 pt-4 border-t border-[#00ff88]/10 text-[10px] text-[#00ff88]/40 font-bold tracking-[3px] text-center">
                STATUS: SECURE<br />
                V2.4.0-PRO
            </div>
        </div>
    );
}

export function ThreatMap() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        const dots = [];
        for (let i = 0; i < 50; i++) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }

        let gridCanvas = null;
        const renderGrid = (w, h) => {
            const gCanvas = document.createElement('canvas');
            gCanvas.width = w;
            gCanvas.height = h;
            const gCtx = gCanvas.getContext('2d');
            gCtx.strokeStyle = '#00ff88';
            gCtx.lineWidth = 0.5;
            gCtx.globalAlpha = 0.1;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                gCtx.beginPath();
                gCtx.moveTo(x, 0);
                gCtx.lineTo(x, h);
                gCtx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                gCtx.beginPath();
                gCtx.moveTo(0, y);
                gCtx.lineTo(w, y);
                gCtx.stroke();
            }
            return gCanvas;
        };

        gridCanvas = renderGrid(width, height);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Pre-rendered Grid
            if (gridCanvas) ctx.drawImage(gridCanvas, 0, 0);

            // Draw Dots (Threats)
            dots.forEach(dot => {
                ctx.fillStyle = '#00ff88';
                ctx.globalAlpha = dot.alpha;
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                ctx.fill();

                // Blink effect
                dot.alpha += dot.speed;
                if (dot.alpha > 1 || dot.alpha < 0.1) dot.speed *= -1;
            });

            // Random "Attack" lines
            if (Math.random() > 0.95) {
                const start = dots[randomInt(0, dots.length - 1)];
                const end = dots[randomInt(0, dots.length - 1)];
                ctx.beginPath();
                ctx.strokeStyle = '#ff0033'; // Red for attack
                ctx.globalAlpha = 0.6;
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            }

            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            gridCanvas = renderGrid(width, height);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-full h-64 bg-black border border-[#00ff88]/30 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <div className="absolute top-2 left-2 text-[#00ff88] text-xs font-bold bg-black/80 px-2 py-1 border border-[#00ff88]/50">
                GLOBAL THREAT MAP
            </div>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}

export function TerminalLog() {
    const [logs, setLogs] = useState([
        "> SYSTEM_INIT...",
        "> CONNECTING TO SECURE SERVER...",
        "> AUTHENTICATION: SUCCESS",
        "> LOADING MODULES...",
    ]);
    const bottomRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const actions = [
                "SCANNING PORT 8080...",
                "PACKET INTERCEPTED [192.168.1.45]",
                "ENCRYPTION KEY ROTATED",
                "MALWARE SIGNATURE DETECTED: CLEAN",
                "PING: 14ms",
                "UPDATING FIREWALL RULES...",
                "USER_AGENT: MOZILLA/5.0 DETECTED"
            ];
            const newLog = `> ${actions[randomInt(0, actions.length - 1)]}`;

            setLogs(prev => {
                const updated = [...prev, newLog];
                if (updated.length > 20) updated.shift();
                return updated;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [logs]);

    return (
        <div className="h-64 bg-black border border-[#00ff88]/30 rounded-lg p-4 font-mono text-xs text-[#00ff88] overflow-y-auto shadow-[0_0_15px_rgba(0,255,136,0.1)]">
            <div className="mb-2 border-b border-[#00ff88]/20 pb-1 text-gray-500">SYSTEM LOGS</div>
            <div className="space-y-1">
                {logs.map((log, i) => (
                    <div key={i} className="opacity-90">{log}</div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

export function StatsPanel() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatBox label="CPU LOAD" value="12%" color="#00ff88" />
            <StatBox label="MEMORY" value="4.2GB" color="#00ff88" />
            <StatBox label="NETWORK" value="1.2 Gbps" color="#00ff88" />
            <StatBox label="THREATS" value="0" color="#00ff88" />
        </div>
    );
}

function StatBox({ label, value, color }) {
    return (
        <div className="bg-black border border-[#00ff88]/30 p-3 rounded-lg flex flex-col items-center justify-center shadow-[0_0_10px_rgba(0,255,136,0.05)]">
            <span className="text-gray-500 text-[10px] tracking-wider mb-1">{label}</span>
            <span className="text-xl font-bold" style={{ color }}>{value}</span>
        </div>
    );
}
