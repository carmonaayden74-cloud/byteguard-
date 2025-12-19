'use client';

import { useEffect } from 'react';

export default function TrapPage() {
    useEffect(() => {
        // Log the intruder
        fetch('/api/honeypot/log', {
            method: 'POST',
            body: JSON.stringify({
                path: '/wp-admin',
                userAgent: navigator.userAgent,
                referrer: document.referrer
            })
        });
    }, []);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center text-black">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">403 Forbidden</h1>
                <p>You do not have permission to access this resource.</p>
                <hr className="my-4" />
                <address>Apache/2.4.41 (Ubuntu) Server at localhost Port 80</address>
                {/* Fake server signature to mislead attackers */}
            </div>
        </div>
    );
}
