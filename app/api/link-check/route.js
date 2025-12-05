import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Ensure protocol
        let targetUrl = url;
        if (!/^https?:\/\//i.test(url)) {
            targetUrl = 'http://' + url;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(targetUrl, {
            method: 'GET',
            redirect: 'follow',
            signal: controller.signal,
            headers: {
                'User-Agent': 'ByteGuard-Security-Scanner/1.0',
            },
        });

        clearTimeout(timeoutId);

        const html = await response.text();
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title found';

        // Extract some interesting headers
        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        // Heuristic Analysis
        const riskFactors = [];
        let riskScore = 0;

        // 1. Check for IP address usage
        if (/^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(targetUrl)) {
            riskScore += 50;
            riskFactors.push("Direct IP address usage (Suspicious)");
        }

        // 2. Check for excessive subdomains
        const domainParts = new URL(targetUrl).hostname.split('.');
        if (domainParts.length > 4) {
            riskScore += 20;
            riskFactors.push("Excessive subdomains (Potential obfuscation)");
        }

        // 3. Check for suspicious TLDs
        const suspiciousTLDs = ['.xyz', '.top', '.gq', '.tk', '.ml', '.cf', '.ga', '.cn', '.ru'];
        if (suspiciousTLDs.some(tld => targetUrl.endsWith(tld))) {
            riskScore += 30;
            riskFactors.push("High-risk TLD detected");
        }

        // 4. Check for Punycode (IDN homograph attacks)
        if (targetUrl.includes('xn--')) {
            riskScore += 40;
            riskFactors.push("Punycode detected (Potential Homograph Attack)");
        }

        // 5. Check for @ symbol (Authority obfuscation)
        if (targetUrl.includes('@')) {
            riskScore += 60;
            riskFactors.push("Authority field obfuscation (@ symbol used)");
        }

        return NextResponse.json({
            status: response.status,
            statusText: response.statusText,
            finalUrl: response.url,
            redirected: response.redirected,
            title: title.trim(),
            headers: headers,
            analysis: {
                riskScore: Math.min(100, riskScore),
                riskFactors: riskFactors.length > 0 ? riskFactors : ["No obvious risk factors detected"]
            }
        });

    } catch (error) {
        return NextResponse.json({
            error: 'Failed to analyze link',
            details: error.message
        }, { status: 500 });
    }
}
