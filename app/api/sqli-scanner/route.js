import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Ensure URL has protocol
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        // Basic SQLi payloads to test
        const payloads = [
            "'", "\"", " OR 1=1", "' OR '1'='1", "\" OR \"1\"=\"1", " AND 1=2",
            "'; WAITFOR DELAY '0:0:5'--", // SQL Server Time Based
            "'; SELECT pg_sleep(5);--", // PostgreSQL Time Based
            " AND SLEEP(5)--", // MySQL Time Based
            " UNION SELECT NULL,NULL,NULL,NULL,NULL--" // Union Based
        ];

        // SQL Error patterns
        const errorPatterns = [
            "SQL syntax", "mysql_fetch", "SQLServer JDBC Driver", "ORA-01756",
            "SQLite/JDBCDriver", "System.Data.SqlClient.SqlException", "MySqlException",
            "pg_query", "MariaDB server version", "PostgreSQL query failed"
        ];

        const results = [];
        let score = 100;

        // Base check
        let originalText = "";
        try {
            const urlObj = new URL(targetUrl);
            const originalParams = urlObj.searchParams;
            if (Array.from(originalParams.keys()).length === 0) {
                return NextResponse.json({
                    url: targetUrl,
                    vulnerable: false,
                    details: ["No parameters found to fuzz. Provide a URL like ?id=1"]
                });
            }

            const startTime = Date.now();
            const res = await fetch(targetUrl);
            const baseDuration = Date.now() - startTime;
            originalText = await res.text();

            // Fuzz parameters
            const params = Array.from(originalParams.keys());

            for (const param of params) {
                for (const payload of payloads) {
                    const testUrl = new URL(targetUrl);
                    testUrl.searchParams.set(param, payload);

                    const testStart = Date.now();
                    try {
                        const testRes = await fetch(testUrl.toString(), { signal: AbortSignal.timeout(10000) });
                        const testDuration = Date.now() - testStart;
                        const text = await testRes.text();

                        // 1. Time-Based Detection
                        if (payload.includes('SLEEP') || payload.includes('WAITFOR') || payload.includes('pg_sleep')) {
                            if (testDuration > baseDuration + 4000) {
                                results.push({
                                    type: 'Time-Based Blind SQLi',
                                    param: param,
                                    payload: payload,
                                    evidence: `Confirmed: Response delayed by ${Math.round(testDuration / 1000)}s`
                                });
                                score -= 40;
                                continue; // Found a hit for this payload
                            }
                        }

                        // 2. Error-Based Detection
                        for (const pattern of errorPatterns) {
                            if (text.includes(pattern)) {
                                results.push({
                                    type: 'Error-Based SQLi',
                                    param: param,
                                    payload: payload,
                                    evidence: `SQL Error Leakage: "${pattern}"`
                                });
                                score -= 30;
                                break;
                            }
                        }

                        // 3. Boolean-Inference (Basic)
                        if (originalText.length > 0 && Math.abs(originalText.length - text.length) > originalText.length * 0.3) {
                            if (!results.some(r => r.payload === payload)) {
                                results.push({
                                    type: 'Boolean-Based Anomaly',
                                    param: param,
                                    payload: payload,
                                    evidence: `Page structure mutation detected (${Math.abs(originalText.length - text.length)} bytes diff)`
                                });
                                score -= 15;
                            }
                        }
                    } catch (e) {
                        // Likely timeout or connection issue, could be a false positive for time-based
                    }
                }
            }
        } catch (e) {
            return NextResponse.json({ error: 'Target unreachable: ' + e.message }, { status: 500 });
        }

        return NextResponse.json({
            url: targetUrl,
            vulnerable: results.length > 0,
            score: Math.max(0, score),
            details: results
        });

    } catch (error) {
        return NextResponse.json({ error: 'Analysis failed.' }, { status: 500 });
    }
}
