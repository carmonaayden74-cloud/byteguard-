"use client";
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function WebTerminal() {
    const [lines, setLines] = useState(['ByteGuard Web Terminal v2.1.0', 'Type "help" for available commands.']);
    const [input, setInput] = useState('');
    const terminalRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // Focus input on click
    const handleFocus = () => {
        terminalRef.current?.focus();
    };

    // Handle typing
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            processCommand(input);
            setInput('');
        }
    };

    const processCommand = async (cmd) => {
        const newLines = [...lines, `root@byteguard:~# ${cmd}`];
        setLines(newLines);

        const args = cmd.trim().split(' ');
        const command = args[0].toLowerCase();
        const target = args[1];

        let response = '';

        if (command === 'help') {
            response = `Available commands:
  help            Show this help message
  clear           Clear the terminal screen
  ping <host>     Check HTTP reachability
  dns <domain>    Lookup DNS records
  http <url>      Inspect HTTP headers
  whoami          Show current session info`;
        } else if (command === 'clear') {
            setLines([]);
            return;
        } else if (command === 'whoami') {
            response = 'uid=0(root) gid=0(root) groups=0(root)';
        } else if (command === 'ping') {
            if (!target) {
                response = 'Usage: ping <host> (e.g., ping google.com)';
            } else {
                setLines([...newLines, `Pinging ${target}...`]);
                try {
                    const start = Date.now();
                    const res = await fetch('/api/link-check', {
                        method: 'POST',
                        body: JSON.stringify({ url: target.startsWith('http') ? target : `https://${target}` })
                    });
                    const end = Date.now();
                    if (res.ok) {
                        response = `64 bytes from ${target}: time=${end - start}ms status=${res.status}`;
                    } else {
                        response = `Request timed out or failed.`;
                    }
                } catch (e) {
                    response = `Ping failed: ${e.message}`;
                }
            }
        } else if (command === 'dns') {
            if (!target) {
                response = 'Usage: dns <domain>';
            } else {
                setLines([...newLines, `Resolving ${target}...`]);
                try {
                    const res = await fetch(`/api/dns?domain=${target}`);
                    const data = await res.json();
                    if (data.records) {
                        response = data.records.map(r => `${r.type.padEnd(5)} ${JSON.stringify(r).replace(/"/g, '')}`).join('\n');
                    } else {
                        response = 'No records found.';
                    }
                } catch (e) {
                    response = `DNS lookup failed: ${e.message}`;
                }
            }
        } else if (command === 'http') {
            if (!target) {
                response = 'Usage: http <url>';
            } else {
                setLines([...newLines, `Fetching headers from ${target}...`]);
                try {
                    const res = await fetch('/api/link-check', {
                        method: 'POST',
                        body: JSON.stringify({ url: target })
                    });
                    const data = await res.json();
                    response = Object.entries(data.headers || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
                } catch (e) {
                    response = `HTTP request failed: ${e.message}`;
                }
            }
        } else if (command === '') {
            response = '';
        } else {
            response = `Command not found: ${command}. Type 'help' for available commands.`;
        }

        if (response) {
            setLines(prev => [...prev, response]);
        }
    };

    return (
        <div className="min-h-screen bg-black text-[#00ff88] font-mono flex" onClick={handleFocus}>
            <Sidebar />
            <main className="flex-1 p-4 h-screen overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                    {lines.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
                    ))}

                    <div className="flex items-center">
                        <span className="mr-2 text-[#00ff88]">root@byteguard:~#</span>
                        <input
                            ref={terminalRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-[#00ff88] flex-1 focus:ring-0"
                            autoFocus
                        />
                    </div>
                    <div ref={bottomRef} />
                </div>

                <div className="p-2 border-t border-[#00ff88]/20 text-xs text-gray-500 text-center">
                    WEB TERMINAL SESSION - CONNECTED
                </div>
            </main >
        </div >
    );
}
