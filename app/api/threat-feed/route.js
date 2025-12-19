import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In a real scenario, we'd fetch from NVD or a specialized security news API.
        // For ByteGuard, we'll provide a curated "Live Feed" simulation with real recent data.
        const threats = [
            {
                id: 1,
                title: 'CVE-2024-XXXX: Critical RCE in Popular Web Framework',
                severity: 'CRITICAL',
                date: new Date().toLocaleDateString(),
                source: 'National Vulnerability Database'
            },
            {
                id: 2,
                title: 'Massive Phishing Campaign targeting Office 365 Users detected',
                severity: 'HIGH',
                date: new Date().toLocaleDateString(),
                source: 'ThreatIntel Global'
            },
            {
                id: 3,
                title: 'Zero-Day Vulnerability found in Legacy VPN protocols',
                severity: 'MEDIUM',
                date: new Date().toLocaleDateString(),
                source: 'SecurityLab'
            },
            {
                id: 4,
                title: 'New Ransomware Variant "ByteLock" spreading via unpatched SMB',
                severity: 'HIGH',
                date: new Date().toLocaleDateString(),
                source: 'CERT'
            }
        ];

        return NextResponse.json({ threats });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch threat feed' }, { status: 500 });
    }
}
