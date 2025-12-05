import { NextResponse } from 'next/server';
import dns from 'dns';
import util from 'util';

const resolveAny = util.promisify(dns.resolveAny);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
        return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    try {
        const records = await resolveAny(domain);
        return NextResponse.json({ domain, records });
    } catch (error) {
        return NextResponse.json({ error: `Failed to resolve DNS for ${domain}. ${error.message}` }, { status: 500 });
    }
}
