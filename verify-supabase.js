
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('Testing Supabase Connection...');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('ERROR: Missing Supabase URL or Key in .env.local');
    console.error(`URL: ${url ? 'Found' : 'Missing'}`);
    console.error(`Key: ${key ? 'Found' : 'Missing'}`);
    process.exit(1);
}

try {
    const supabase = createClient(url, key);
    console.log(`URL: ${url}`);

    // Try a simple health check or fetch
    supabase.from('something_random_123').select('*').limit(1).then(({ data, error }) => {
        if (error) {
            // It's expected to fail on "something_random" but we want to see if it's a network/auth error
            // or just a "table not found" error.
            // "PGRST204" means table not found, which implies connection WORKED.
            // Network error would be different.
            console.log('Connection Attempt Result:', error.message);
            console.log('Error Code:', error.code);
            console.log('Detailed:', error);
        } else {
            console.log('Connection Successful (Unexpectedly found table?)');
        }
    });

} catch (e) {
    console.error('Exception creating client:', e.message);
}
