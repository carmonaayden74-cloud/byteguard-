import { NextResponse } from 'next/server';
import { rateLimit } from '../../lib/rate-limit';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    const limiter = rateLimit(ip, 10, 60000); // 10 per minute
    if (!limiter.success) {
        return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
    }

    if (!target) {
        return NextResponse.json({ error: 'Target IP is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`http://ip-api.com/json/${target}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        const data = await res.json();

        if (data.status === 'success') {
            // Simulated Reputation Intelligence
            // In a real scenario, use AbuseIPDB or VirusTotal
            const threatScore = Math.floor(Math.random() * 20); // Base random factor
            const maliciousKeywords = ['hosting', 'vpn', 'datacenter', 'cloud', 'digitalocean', 'm247', 'packet', 'leaseweb'];
            const isp = (data.isp || '').toLowerCase();

            let threatLevel = 'Low';
            let finalScore = threatScore;

            if (maliciousKeywords.some(kw => isp.includes(kw))) {
                finalScore += 40;
                threatLevel = 'Moderate';
            }

            // Specific known "high risk" ASNs or ISPs would go here
            if (isp.includes('m247') || isp.includes('ovh') || isp.includes('hetzner')) {
                finalScore += 30;
                threatLevel = 'High';
            }

            data.reputation = {
                score: finalScore,
                threatLevel,
                isMalicious: finalScore > 70,
                lastSeen: new Date().toISOString(),
                blacklistHits: finalScore > 50 ? Math.floor(finalScore / 10) : 0
            };
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
