"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { useAuth } from "../../context/AuthContext";
import { useDefense } from "../../context/DefenseContext";
import { saveScan } from "../../lib/history";

export default function DataLeakPage() {
    const { user } = useAuth();
    const { notify } = useDefense();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const checkLeak = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/data-leak", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();

            if (res.status === 429) {
                notify('WARNING', 'Rate Limit Hit', 'Checking breaches too fast. Please wait.');
            }

            setResult(data);

            if (data.found) {
                notify('ALERT', 'Account Compromised', `${email} has been found in ${data.count} data breaches.`);
            }

            // Save to History
            if (user) {
                await saveScan(user.id, 'Data Leak Detector', email, data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 100, 0);
        doc.text("ByteGuard - Data Leak Report", 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Target Email: ${email} | Generated: ${new Date().toLocaleString()}`, 20, 30);

        let y = 50;
        doc.setFontSize(14);
        doc.text(`Found in ${result.leaks.length} Breaches`, 20, y);
        y += 10;

        doc.setFontSize(10);
        result.leaks.forEach(leak => {
            doc.setTextColor(200, 0, 0);
            doc.text(`- ${leak.title} (${leak.date})`, 20, y);
            y += 7;
            doc.setTextColor(50, 50, 50);
            doc.text(`  Data: ${leak.dataClasses.join(", ")}`, 25, y);
            y += 10;
            if (y > 270) { doc.addPage(); y = 20; }
        });

        doc.save(`leak_audit_${email}.pdf`);
    };

    return (
        <div style={{ minHeight: "100vh", background: "#050505", color: "white", padding: "40px 20px" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
                    <h1 style={{ color: "#00ff88", fontSize: "2.5rem", textShadow: "0 0 15px rgba(0, 255, 136, 0.3)", margin: 0 }}>
                        🔐 Data Leak Detector
                    </h1>
                    {result && result.leaks.length > 0 && (
                        <button onClick={generatePDF} style={{ background: "#00ff88", color: "#003300", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                            📄 EXPORT PDF
                        </button>
                    )}
                </div>

                <form onSubmit={checkLeak} style={{ background: "#0a0a0a", border: "1px solid rgba(0, 255, 136, 0.2)", padding: "30px", borderRadius: "15px", marginBottom: "40px", textAlign: "center" }}>
                    <p style={{ color: "#888", marginBottom: "20px" }}>Verifica si tu cuenta ha sido comprometida en alguna brecha de datos global.</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            style={{ flex: 1, background: "black", border: "1px solid rgba(0, 255, 136, 0.3)", borderRadius: "8px", padding: "15px", color: "white", outline: "none" }}
                        />
                        <button disabled={loading} style={{ background: "#00ff88", color: "#003300", border: "none", padding: "0 30px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                            {loading ? "SEARCHING..." : "ANALYZE"}
                        </button>
                    </div>
                </form>

                {result && (
                    <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        {result.leaks.length > 0 ? (
                            <div style={{ border: "1px solid rgba(255, 68, 68, 0.3)", background: "rgba(255, 68, 68, 0.05)", borderRadius: "15px", padding: "30px" }}>
                                <h2 style={{ color: "#ff4444", marginBottom: "25px" }}>⚠️ BRECHAS ENCOTRADAS: {result.leaks.length}</h2>
                                <div style={{ display: "grid", gap: "20px" }}>
                                    {result.leaks.map((leak, i) => (
                                        <div key={i} style={{ borderLeft: "3px solid #ff4444", paddingLeft: "20px", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "0 10px 10px 0" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{leak.title}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "5px" }}>Fecha: {leak.date}</div>
                                            <div style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "10px" }}>
                                                <strong>Datos filtrados:</strong> {leak.dataClasses.join(", ")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ border: "1px solid rgba(0, 255, 136, 0.3)", background: "rgba(0, 255, 136, 0.05)", borderRadius: "15px", padding: "40px", textAlign: "center" }}>
                                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
                                <h2 style={{ color: "#00ff88" }}>¡Buenas noticias!</h2>
                                <p style={{ color: "#888" }}>No hemos encontrado brechas públicas asociadas a <strong>{email}</strong>.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
