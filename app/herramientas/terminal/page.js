"use client";
import { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/DashboardComponents';

export default function FakeTerminal() {
    const [lines, setLines] = useState(['Initializing ByteGuard Kernel...', 'Loading modules...', 'Connection established.']);
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
  ping <host>     Test reachability (HTTP HEAD)
  dns <domain>    Lookup DNS records
  http <url>      Fetch HTTP headers
  whoami          Show current user session`;
        } else if (command === 'clear') {
            setLines([]);
            return;
        } else if (command === 'whoami') {
            response = 'root (ByteGuard Security Analyst)';
        } else if (command === 'ping') {
            if (!target) {
                response = 'Usage: ping <host> (e.g., ping google.com)';
            } else {
                setLines([...newLines, `Pinging ${target}...`]);
                try {
                    const start = Date.now();
                    // Use link-check API as a proxy for reachability
                    const res = await fetch('/api/link-check', {
                        method: 'POST',
                        body: JSON.stringify({ url: target.startsWith('http') ? target : `https://${target}` })
                    });
                    const end = Date.now();
                    if (res.ok) {
                        response = `Reply from ${target}: time=${end - start}ms status=${res.status}`;
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

    // Hacker Typer Effect (Type random code on key press)
    const handleHackerTyper = (e) => {
        // Optional: If user wants just visual noise
        // const codeSnippet = "struct group_info init_groups = { .usage = ATOMIC_INIT(2) };";
        // setLines(prev => [...prev, codeSnippet.substring(0, Math.random() * 10)]);
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
                    INTERACTIVE TERMINAL SESSION - TYPE &apos;help&apos; FOR COMMANDS
                </div>
            </main >
        </div >
    );
}
