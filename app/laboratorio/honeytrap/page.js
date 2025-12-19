'use client';

import { useEffect, useState } from 'react';

export default function HoneyTrap() {
    const [loginAttempt, setLoginAttempt] = useState(0);

    useEffect(() => {
        // Log the visit immediately
        const logIntrusion = async () => {
            try {
                // Collect basic fingerprinting data
                const fingerprint = {
                    ua: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    screen: `${window.screen.width}x${window.screen.height}`,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };

                await fetch('/api/honeypot/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ua: navigator.userAgent,
                        path: window.location.pathname,
                        headers: fingerprint
                    })
                });
            } catch (e) {
                // Silent fail
            }
        };

        logIntrusion();
    }, []);

    const handleFakeLogin = (e) => {
        e.preventDefault();
        setLoginAttempt(prev => prev + 1);

        // Simulate a "slow" backend verify to waste their time
        setTimeout(() => {
            alert("Error: Database connection refused. Code: 0x80040E14");
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f0f13',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'monospace'
        }}>
            <div style={{
                width: '400px',
                padding: '40px',
                background: '#1a1a20',
                border: '1px solid #333',
                borderRadius: '4px',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
            }}>
                <h1 style={{ color: '#ff4444', fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>SYSTEM ADMIN RECOVERY</h1>
                <p style={{ color: '#666', fontSize: '12px', marginBottom: '30px', textAlign: 'center' }}>WARNING: UNAUTHORIZED ACCESS IS LOGGED</p>

                <form onSubmit={handleFakeLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>ROOT USERNAME</label>
                        <input type="text" style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: 'white' }} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>ACCESS TOKEN</label>
                        <input type="password" style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: 'white' }} />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px',
                        background: '#cc0000',
                        color: 'white',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                        AUTHENTICATE
                    </button>
                </form>

                {loginAttempt > 0 && (
                    <div style={{ marginTop: '20px', color: 'red', fontSize: '10px', textAlign: 'center' }}>
                        ATTEMPT {loginAttempt} FAILED. IP LOGGED.
                    </div>
                )}
            </div>
        </div>
    );
}
