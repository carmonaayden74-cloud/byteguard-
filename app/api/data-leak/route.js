import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Simplified simulation of HIBP check
        // In reality, you'd use a real API key or a curated local dataset.
        const knownBreaches = [
            { title: 'Adobe (2013)', date: '2013-10-01', dataClasses: ['Email', 'Password', 'Password hints', 'Usernames'] },
            { title: 'LinkedIn (2016)', date: '2016-05-01', dataClasses: ['Email', 'Password'] },
            { title: 'Myspace (2016)', date: '2016-05-31', dataClasses: ['Email', 'Password', 'Usernames'] },
            { title: 'Canva (2019)', date: '2019-05-24', dataClasses: ['Email', 'Password', 'Usernames', 'Real names'] },
            { title: 'Wattpad (2020)', date: '2020-07-06', dataClasses: ['Email', 'Password', 'Usernames', 'Birth dates'] }
        ];

        // Seeded random for "demo" consistency
        const seed = email.length;
        const leaksCount = Math.floor((seed % 4));
        const leaks = leaksCount > 0 ? knownBreaches.slice(0, leaksCount) : [];

        return NextResponse.json({
            email,
            found: leaks.length > 0,
            count: leaks.length,
            leaks
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to check data leak' }, { status: 500 });
    }
}
