import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(req) {
    try {
        const { path, userAgent, ip, referrer } = await req.json();

        // Log the intrusion attempt
        // We use the existing 'scans' table to avoid needing new migrations
        const { data, error } = await supabase.from('scans').insert([{
            tool_name: 'Honeypot',
            target: path || 'Unknown Path',
            results: {
                ip: ip || 'Unknown',
                userAgent: userAgent,
                referrer: referrer,
                timestamp: new Date().toISOString(),
                risk: 'HIGH'
            },
            status: 'detected',
            // If user_id is required by RLS, we might need to handle that. 
            // For a system-wide honeypot, we might need a system service role or 
            // allow anonymous inserts if configured. 
            // For now, we assume authenticated context or public insert allowed for this demo.
            // If this fails due to auth, we'll need to adjust.
        }]);

        if (error) {
            console.error('Supabase Error:', error);
            // Don't reveal internal errors to the attacker
        }

        // Return a fake 404 or 403 to the attacker to confuse them
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
}
