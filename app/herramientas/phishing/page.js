"use client";

import { useState } from "react";

export default function LinkForensicsPage() {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/link-check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || "Error al analizar el enlace");
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
            <div style={{ width: "100%", maxWidth: "800px" }}>
                <h1 style={{
                    textAlign: "center",
                    color: "#00ff88",
                    marginBottom: "10px",
                    fontSize: "2.5rem",
                    textShadow: "0 0 15px rgba(0, 255, 136, 0.3)"
                }}>
                    🔎 Link Forensics
                </h1>
                <p style={{ textAlign: "center", color: "#888", marginBottom: "40px" }}>
                    Analiza enlaces sospechosos de forma segura sin visitarlos.
                </p>

                <form onSubmit={analyzeLink} style={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "40px",
                    background: "#111",
                    padding: "10px",
                    borderRadius: "12px",
                    border: "1px solid #333",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Ingresa el enlace sospechoso (ej: http://bit.ly/...)"
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            color: "#fff",
                            fontSize: "1rem",
                            padding: "10px",
                            outline: "none"
                        }}
                    />
                    <button type="submit" style={{
                        background: "#00ff88",
                        color: "#003300",
                        border: "none",
                        padding: "10px 25px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}>
                        Analizar
                    </button>
                </form>

                {loading && (
                    <div style={{ textAlign: "center", padding: "40px", color: "#00ff88" }}>
                        <div className="loader" style={{ fontSize: "1.5rem" }}>Conectando con el objetivo...</div>
                    </div>
                )}

                {error && (
                    <div style={{
                        background: "rgba(255, 77, 77, 0.1)",
                        border: "1px solid #ff4d4d",
                        color: "#ff4d4d",
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center"
                    }}>
                        ❌ Error: {error}
                    </div>
                )}

                {result && (
                    <div style={{ animation: "fadeIn 0.5s ease-in-out" }}>
                        {/* Status Card */}
                        <div style={{
                            background: result.status === 200 ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 77, 77, 0.1)",
                            border: `1px solid ${result.status === 200 ? "#00ff88" : "#ff4d4d"}`,
                            padding: "20px",
                            borderRadius: "12px",
                            marginBottom: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <h3 style={{ margin: 0, color: "#fff" }}>Estado del Servidor</h3>
                                <p style={{ margin: "5px 0 0 0", color: "#888" }}>Código de respuesta HTTP</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <span style={{
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    color: result.status === 200 ? "#00ff88" : "#ff4d4d"
                                }}>
                                    {result.status}
                                </span>
                                <div style={{ color: "#fff" }}>{result.statusText}</div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr",
                            gap: "20px",
                            marginBottom: "30px"
                        }}>
                            <ResultCard label="Título de la Página" value={result.title} />
                            <ResultCard label="URL Final (Tras redirecciones)" value={result.finalUrl} highlight={result.redirected} />
                            <ResultCard label="Servidor (Server Header)" value={result.headers['server'] || 'Oculto'} />
                        </div>

                        {/* Risk Analysis */}
                        <div style={{
                            background: "#111",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #333",
                            marginBottom: "30px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                <h3 style={{ margin: 0, color: "#00ff88", fontSize: "1rem" }}>🛡️ Análisis Heurístico</h3>
                                <div style={{
                                    background: result.analysis.riskScore > 50 ? "#ff4d4d" : result.analysis.riskScore > 0 ? "#ffcc00" : "#00ff88",
                                    color: "#000",
                                    padding: "5px 10px",
                                    borderRadius: "4px",
                                    fontWeight: "bold",
                                    fontSize: "0.8rem"
                                }}>
                                    RIESGO: {result.analysis.riskScore}%
                                </div>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: "20px", color: "#e0e0e0" }}>
                                {result.analysis.riskFactors.map((factor, i) => (
                                    <li key={i} style={{ marginBottom: "5px" }}>{factor}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Raw Headers */}
                        <div style={{
                            background: "#111",
                            padding: "20px",
                            borderRadius: "12px",
                            border: "1px solid #333"
                        }}>
                            <h3 style={{ marginTop: 0, color: "#00ff88", fontSize: "1rem" }}>📡 Cabeceras Completas</h3>
                            <pre style={{
                                color: "#888",
                                fontSize: "0.85rem",
                                overflowX: "auto",
                                whiteSpace: "pre-wrap"
                            }}>
                                {JSON.stringify(result.headers, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

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
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

function ResultCard({ label, value, highlight = false }) {
    return (
        <div style={{
            background: "#111",
            padding: "20px",
            borderRadius: "12px",
            border: highlight ? "1px solid #ffcc00" : "1px solid #222",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
        }}>
            <span style={{ fontSize: "0.9rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px" }}>
                {label}
            </span>
            <span style={{
                fontSize: "1.1rem",
                color: highlight ? "#ffcc00" : "#fff",
                fontWeight: "500",
                wordBreak: "break-all"
            }}>
                {value}
            </span>
        </div>
    );
}
