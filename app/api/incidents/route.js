import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching incidents:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ incidents: data });
}

export async function POST(request) {
    try {
        const { userId, type, title, description, severity, metadata } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('incidents')
            .insert([{
                user_id: userId,
                type,
                title,
                description,
                severity,
                metadata,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) throw error;

        return NextResponse.json({ success: true, incident: data[0] });
    } catch (error) {
        console.error('Error logging incident:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
