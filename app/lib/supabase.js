import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';

// If we are using the demo/dummy URL or if the URL is known to be dead/missing, we'll use a mocked client
export const supabase = (
    supabaseUrl.includes('demo.supabase.co') ||
    supabaseUrl.includes('ogidixmazmivxlrkrxuq') || // Detect the dead project URL
    !process.env.NEXT_PUBLIC_SUPABASE_URL
)
    ? {
        auth: {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signUp: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
            signInWithPassword: async () => ({ data: {}, error: { message: "Supabase not configured" } }),
            signOut: async () => ({ error: null }),
        },
        from: () => ({
            insert: () => ({ select: () => ({ data: null, error: { message: "Supabase not configured" } }) }),
            select: () => ({ data: [], error: { message: "Supabase not configured" } }),
            update: () => ({ data: null, error: { message: "Supabase not configured" } }),
        })
    }
    : createClient(supabaseUrl, supabaseAnonKey);

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (typeof window !== 'undefined') {
        console.warn('ByteGuard: Running in DEMO_MODE (Supabase keys missing). All data is local.');
    }
}
