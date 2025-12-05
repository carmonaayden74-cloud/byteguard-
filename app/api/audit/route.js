import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Ensure URL has protocol
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await fetch(targetUrl, {
            method: 'HEAD', // We only need headers
            redirect: 'follow',
        });

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

        checkHeader('strict-transport-security', 'HSTS is enabled (Good)', 'Missing HSTS header (Risk: Man-in-the-Middle attacks)', 20);
        checkHeader('content-security-policy', 'CSP is configured (Good)', 'Missing Content-Security-Policy (Risk: XSS attacks)', 25);
        checkHeader('x-frame-options', 'Clickjacking protection enabled (Good)', 'Missing X-Frame-Options (Risk: Clickjacking)', 15);
        checkHeader('x-content-type-options', 'MIME-sniffing protection enabled (Good)', 'Missing X-Content-Type-Options', 10);
        checkHeader('referrer-policy', 'Referrer Policy is set', 'Missing Referrer-Policy', 5);
        checkHeader('permissions-policy', 'Permissions Policy is set', 'Missing Permissions-Policy', 5);

        // Check for information leakage
        if (headers['server']) {
            analysis.score -= 5;
            analysis.issues.push(`Server header revealed: "${headers['server']}" (Information Leakage)`);
        }
        if (headers['x-powered-by']) {
            analysis.score -= 5;
            analysis.issues.push(`X-Powered-By header revealed: "${headers['x-powered-by']}" (Information Leakage)`);
        }

        if (analysis.score < 0) analysis.score = 0;

        return NextResponse.json({
            url: targetUrl,
            status: response.status,
            headers,
            analysis
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to analyze URL. Host might be unreachable.' }, { status: 500 });
    }
}
