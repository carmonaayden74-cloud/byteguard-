"use client";
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function KeyloggerSim() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState([]);
    const logsEndRef = useRef(null);

    const handleKeyDown = (e) => {
        const key = e.key;
        const timestamp = new Date().toLocaleTimeString();

        let displayKey = key;
        if (key === ' ') displayKey = '[SPACE]';
        if (key === 'Enter') displayKey = '[ENTER]';
        if (key === 'Backspace') displayKey = '[BACKSPACE]';
        if (key === 'Shift') displayKey = '[SHIFT]';
        if (key === 'Control') displayKey = '[CTRL]';
        if (key === 'Alt') displayKey = '[ALT]';
        if (key === 'Tab') displayKey = '[TAB]';

        setLogs(prev => {
            return [...prev, { key: displayKey, time: timestamp }];
        });
    };

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-[#00ff88] mb-6 tracking-tighter">
                    KEYLOGGER DETECTOR <span className="text-sm text-gray-500 font-normal">INPUT ANALYSIS</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Input Area */}
                    <div className="bg-[#0a0a0a] border border-[#00ff88]/20 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-4">1. VICTIM&apos;S DEVICE</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Type anything in the box below. Imagine this is a login form, an email, or a private chat.
                        </p>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full h-64 bg-white text-black border-2 border-gray-300 rounded p-4 focus:outline-none focus:border-blue-500 font-sans text-lg"
                            placeholder="Start typing here..."
                        />
                    </div>

                    {/* Hacker's View */}
                    <div className="bg-[#001100] border border-[#00ff88]/30 rounded-xl p-6 shadow-lg flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-4 border-b border-[#00ff88]/20 pb-2">
                            <h2 className="text-xl font-bold text-[#00ff88]">2. ATTACKER&apos;S LOG</h2>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-red-500">RECORDING</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto font-mono text-sm space-y-1 pr-2 custom-scrollbar">
                            {logs.length === 0 && (
                                <div className="text-gray-600 italic text-center mt-20">Waiting for keystrokes...</div>
                            )}
                            {logs.map((log, i) => (
                                <div key={i} className="flex border-b border-[#00ff88]/5 py-1 hover:bg-[#00ff88]/5">
                                    <span className="text-gray-500 w-24 text-xs">{log.time}</span>
                                    <span className="text-[#00ff88] font-bold">{log.key}</span>
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#00ff88]/20 text-xs text-gray-400">
                            <p>Keyloggers can run in the background, invisible to the user, capturing every button press including passwords and credit card numbers.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
