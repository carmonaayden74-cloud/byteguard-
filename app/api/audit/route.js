import { NextResponse } from 'next/server';
import { rateLimit } from '../../lib/rate-limit';
import https from 'https';
import tls from 'tls';

const getSSLCert = (hostname) => {
    return new Promise((resolve) => {
        try {
            const socket = tls.connect(443, hostname, { servername: hostname }, () => {
                const cert = socket.getPeerCertificate();
                socket.destroy();
                if (cert && Object.keys(cert).length > 0) {
                    resolve({
                        issuer: cert.issuer.O,
                        validFrom: cert.valid_from,
                        validTo: cert.valid_to,
                        subject: cert.subject.CN,
                        daysRemaining: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24))
                    });
                } else {
                    resolve(null);
                }
            });
            socket.on('error', () => resolve(null));
            socket.setTimeout(3000, () => {
                socket.destroy();
                resolve(null);
            });
        } catch (e) {
            resolve(null);
        }
    });
};

export async function POST(request) {
    try {
        const { url } = await request.json();
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

        const limiter = rateLimit(ip, 5, 60000); // 5 per minute for heavy audit
        if (!limiter.success) {
            return NextResponse.json({ error: 'Rate limit exceeded. Try again in a minute.' }, { status: 429 });
        }

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Ensure URL has protocol
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;
        const hostname = new URL(targetUrl).hostname;

        const [response, sslData] = await Promise.all([
            fetch(targetUrl, {
                method: 'HEAD',
                redirect: 'follow',
            }),
            getSSLCert(hostname)
        ]);

        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        // Security Analysis
        const analysis = {
            score: 100,
            issues: [],
            good: [],
        };

        const checkHeader = (name, goodMsg, badMsg, penalty) => {
            if (headers[name.toLowerCase()]) {
                analysis.good.push(goodMsg);
            } else {
                analysis.score -= penalty;
                analysis.issues.push(badMsg);
            }
        };

        checkHeader('strict-transport-security', 'HSTS Enabled', 'Missing HSTS (Risk: Man-in-the-Middle)', 20);
        checkHeader('content-security-policy', 'CSP Configured', 'Missing CSP (Risk: XSS Attacks)', 25);
        checkHeader('x-frame-options', 'Anti-Clickjacking', 'Missing X-Frame-Options (Risk: Clickjacking)', 15);
        checkHeader('x-content-type-options', 'MIME Sniffing Blocked', 'Missing X-Content-Type-Options (Risk: MIME Sniffing)', 10);
        checkHeader('referrer-policy', 'Referrer Policy Set', 'Missing Referrer-Policy (Privacy Risk)', 5);
        checkHeader('permissions-policy', 'Permissions Policy Set', 'Missing Permissions-Policy (Feature Abuse Risk)', 5);

        if (sslData) {
            analysis.good.push(`SSL Valid: ${sslData.daysRemaining} days left`);
            if (sslData.daysRemaining < 30) {
                analysis.issues.push(`SSL Certificate expiring soon (${sslData.daysRemaining} days)`);
                analysis.score -= 10;
            }
        } else {
            analysis.issues.push('Could not verify SSL Certificate details');
            analysis.score -= 20;
        }

        // Technology Detection
        const tech = {
            server: headers['server'] || 'Unknown',
            poweredBy: headers['x-powered-by'] || 'Unknown',
            cms: 'Undetected',
            cdn: 'Undetected'
        };

        if (headers['server']?.includes('cloudflare')) tech.cdn = 'Cloudflare';
        if (headers['server']?.includes('nginx')) tech.server = 'Nginx';
        if (headers['server']?.includes('Apache')) tech.server = 'Apache';
        if (headers['x-powered-by']?.includes('Next.js')) tech.poweredBy = 'Next.js';
        if (headers['x-powered-by']?.includes('PHP')) tech.poweredBy = 'PHP';
        if (headers['x-nextjs-cache']) tech.poweredBy = 'Next.js';

        // Fake/Simulated Reputation Score (since real ones require paid API keys usually)
        // In a real app, you'd use something like Web of Trust or Google Safe Browsing
        const reputation = {
            status: 'Clean',
            threatLevel: 'Low',
            blacklistCount: 0
        };

        if (headers['server']?.toLowerCase().includes('hosting')) {
            reputation.threatLevel = 'Moderate';
            reputation.status = 'Potential Hosting Provider';
        }

        // --- NEW: Exposed Files Scanner ---
        const sensitiveFiles = [
            { path: '/.env', name: 'Environment File (.env)' },
            { path: '/.git/config', name: 'Git Configuration' },
            { path: '/.ssh/id_rsa', name: 'SSH Private Key' },
            { path: '/wp-config.php.bak', name: 'WordPress Backup Config' },
            { path: '/phpinfo.php', name: 'PHP Information Page' },
            { path: '/server-status', name: 'Apache Server Status' },
            { path: '/.aws/credentials', name: 'AWS Credentials' },
            { path: '/.docker/config.json', name: 'Docker Config' },
            { path: '/backup.sql', name: 'SQL Database Backup' }
        ];

        const exposedFiles = [];
        await Promise.all(sensitiveFiles.map(async (file) => {
            try {
                const baseUrl = new URL(targetUrl).origin;
                const fileCheck = await fetch(`${baseUrl}${file.path}`, {
                    method: 'HEAD',
                    signal: AbortSignal.timeout(1500)
                });
                if (fileCheck.status === 200) {
                    const contentType = fileCheck.headers.get('content-type');
                    // Avoid false positives from custom 404 pages that return 200
                    if (contentType && !contentType.includes('text/html')) {
                        exposedFiles.push({ name: file.name, url: `${baseUrl}${file.path}` });
                        analysis.score -= 20;
                        analysis.issues.push(`CRITICAL: Exposed sensitive file: ${file.name}`);
                    }
                }
            } catch (e) { }
        }));

        if (analysis.score < 0) analysis.score = 0;

        return NextResponse.json({
            url: targetUrl,
            status: response.status,
            headers,
            tech,
            reputation,
            analysis,
            exposedFiles,
            ssl: sslData
        });

    } catch (error) {
        console.error("Audit error:", error);
        return NextResponse.json({ error: 'Failed to analyze URL. Host might be unreachable.' }, { status: 500 });
    }
}
