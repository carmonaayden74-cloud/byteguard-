import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');

    if (!target) {
        return NextResponse.json({ error: 'Target IP is required' }, { status: 400 });
    }

    try {
        const res = await fetch(`http://ip-api.com/json/${target}?fields=status,message,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
