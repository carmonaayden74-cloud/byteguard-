'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PrivacyBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('byteguard-consent');
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            right: 24,
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '16px',
            padding: '20px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            zIndex: 2000,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 255, 136, 0.05)',
            flexWrap: 'wrap'
        }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#00ff88', fontSize: '14px', fontWeight: '900', letterSpacing: '0.1em' }}>PRIVACY_PROTOCOL_V1.0</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '12px', lineHeight: '1.6' }}>
                    This platform utilizes essential session tokens and heuristic logging to improve security diagnostic accuracy.
                    By proceeding, you acknowledge our <Link href="/legal/privacy" style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Rules</Link> and <Link href="/legal/disclaimer" style={{ color: '#fff', textDecoration: 'underline' }}>Legal Disclaimer</Link>.
                </p>
            </div>
            <button
                onClick={() => {
                    localStorage.setItem('byteguard-consent', 'true');
                    setVisible(false);
                }}
                style={{
                    background: '#00ff88',
                    color: '#003300',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                }}
            >
                Acknowledge_Uplink
            </button>
        </div>
    );
}
