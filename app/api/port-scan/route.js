import { NextResponse } from 'next/server';
import net from 'net';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target IP/Domain is required' }, { status: 400 });
    }

    // Common ports to scan
    const PORTS = [
        { port: 21, service: 'FTP' },
        { port: 22, service: 'SSH' },
        { port: 23, service: 'Telnet' },
        { port: 25, service: 'SMTP' },
        { port: 53, service: 'DNS' },
        { port: 80, service: 'HTTP' },
        { port: 110, service: 'POP3' },
        { port: 143, service: 'IMAP' },
        { port: 443, service: 'HTTPS' },
        { port: 3306, service: 'MySQL' },
        { port: 3389, service: 'RDP' },
        { port: 5432, service: 'PostgreSQL' },
        { port: 8080, service: 'HTTP-Alt' }
    ];

    const checkPort = (port) => {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            let status = 'closed';

            socket.setTimeout(2000); // 2s timeout

            socket.on('connect', () => {
                status = 'open';
                socket.destroy();
            });

            socket.on('timeout', () => {
                status = 'filtered'; // Likely firewall
                socket.destroy();
            });

            socket.on('error', (err) => {
                status = 'closed';
                socket.destroy();
            });

            socket.on('close', () => {
                resolve(status);
            });

            socket.connect(port, target);
        });
    };

    try {
        const results = await Promise.all(
            PORTS.map(async (p) => {
                const status = await checkPort(p.port);
                return { ...p, status };
            })
        );

        return NextResponse.json({ target, results });
    } catch (error) {
        return NextResponse.json({ error: 'Scan failed. Host might be unreachable.' }, { status: 500 });
    }
}
