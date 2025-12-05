import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Ensure protocol
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        const response = await fetch(targetUrl, {
            method: 'HEAD', // Only fetch headers
            cache: 'no-store'
        });

        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });

        // Security Grade Calculation
        let score = 100;
        const missingHeaders = [];
        const importantHeaders = [
            'strict-transport-security',
            'content-security-policy',
            'x-frame-options',
            'x-content-type-options',
            'referrer-policy',
            'permissions-policy'
        ];

        importantHeaders.forEach(header => {
            if (!headers[header]) {
                score -= 15;
                missingHeaders.push(header);
            }
        });

        let grade = 'A';
        if (score < 90) grade = 'B';
        if (score < 70) grade = 'C';
        if (score < 50) grade = 'D';
        if (score < 30) grade = 'F';

        return NextResponse.json({
            headers,
            grade,
            score: Math.max(0, score),
            missingHeaders,
            status: response.status,
            url: targetUrl
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch URL. Ensure it is valid and accessible.' }, { status: 500 });
    }
}
