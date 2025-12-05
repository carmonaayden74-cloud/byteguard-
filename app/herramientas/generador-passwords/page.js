"use client";

import { useState, useEffect, useCallback } from "react";

export default function PasswordGenerator() {

    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [strength, setStrength] = useState(0);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState([]);

    const calculateStrength = useCallback((pass) => {
        let score = 0;
        if (!pass) return setStrength(0);

        if (pass.length > 8) score += 1;
        if (pass.length > 12) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        setStrength(Math.min(score, 5));
    }, []);

    const generatePass = (len, opts) => {
        const charset = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
        };

        let validChars = "";
        if (opts.uppercase) validChars += charset.uppercase;
        if (opts.lowercase) validChars += charset.lowercase;
        if (opts.numbers) validChars += charset.numbers;
        if (opts.symbols) validChars += charset.symbols;

        if (validChars === "") return "";

        let generated = "";
        for (let i = 0; i < len; i++) {
            const randomIndex = Math.floor(Math.random() * validChars.length);
            generated += validChars[randomIndex];
        }
        return generated;
    };

    const [password, setPassword] = useState(() => generatePass(16, { uppercase: true, lowercase: true, numbers: true, symbols: true }));

    const generatePassword = useCallback(() => {
        const newPass = generatePass(length, options);
        setPassword(newPass);
        calculateStrength(newPass);
        setCopied(false);
        setHistory(prev => [newPass, ...prev].slice(0, 5));
    }, [length, options, calculateStrength]);

    // Auto-generate when options change
    useEffect(() => {
        const newPass = generatePass(length, options);
        // eslint-disable-next-line
        setPassword(newPass);
        calculateStrength(newPass);
    }, [length, options, calculateStrength]);

    const copyToClipboard = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (text === password) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setOptions((prev) => {
            const next = { ...prev, [name]: checked };
            // Prevent unchecking the last option
            if (!Object.values(next).some(Boolean)) return prev;
            return next;
        });
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 0:
            case 1:
                return "#ff4d4d"; // Red
            case 2:
            case 3:
                return "#ffcc00"; // Yellow
            case 4:
            case 5:
                return "#00ff88"; // Green
            default:
                return "#333";
        }
    };

    const getStrengthLabel = () => {
        switch (strength) {
            case 0:
            case 1:
                return "Débil";
            case 2:
            case 3:
                return "Media";
            case 4:
            case 5:
                return "Fuerte";
            default:
                return "";
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#0a0a0a",
                color: "#e0e0e0",
                fontFamily: "'Inter', sans-serif",
                padding: "40px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    background: "#111",
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        color: "#00ff88",
                        marginBottom: "30px",
                        fontSize: "2rem",
                        textShadow: "0 0 10px rgba(0, 255, 136, 0.3)",
                    }}
                >
                    Generador de Passwords
                </h1>

                {/* Password Display */}
                <div
                    style={{
                        background: "#050505",
                        padding: "20px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        border: "1px solid #222",
                        position: "relative",
                    }}
                >
                    <span
                        style={{
                            fontSize: "1.5rem",
                            fontFamily: "'Courier New', monospace",
                            color: "#fff",
                            wordBreak: "break-all",
                            marginRight: "10px",
                        }}
                    >
                        {password || "..."}
                    </span>
                    <button
                        onClick={() => copyToClipboard(password)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: copied ? "#00ff88" : "#888",
                            transition: "color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                        }}
                        title="Copiar"
                    >
                        {copied ? (
                            <>
                                <span>Copiado!</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Strength Meter */}
                <div style={{ marginBottom: "30px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.9rem", color: "#888" }}>
                        <span>Seguridad</span>
                        <span style={{ color: getStrengthColor(), fontWeight: "bold" }}>{getStrengthLabel()}</span>
                    </div>
                    <div style={{ display: "flex", gap: "5px", height: "8px" }}>
                        {[1, 2, 3, 4, 5].map((level) => (
                            <div
                                key={level}
                                style={{
                                    flex: 1,
                                    background: strength >= level ? getStrengthColor() : "#222",
                                    borderRadius: "4px",
                                    transition: "background 0.3s ease",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Length Slider */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <label>Longitud</label>
                            <span style={{ color: "#00ff88", fontWeight: "bold" }}>{length}</span>
                        </div>
                        <input
                            type="range"
                            min="8"
                            max="50"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            style={{ width: "100%", cursor: "pointer", accentColor: "#00ff88" }}
                        />
                    </div>

                    {/* Options */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        {[
                            { name: "uppercase", label: "Mayúsculas (A-Z)" },
                            { name: "lowercase", label: "Minúsculas (a-z)" },
                            { name: "numbers", label: "Números (0-9)" },
                            { name: "symbols", label: "Símbolos (!@#)" },
                        ].map((opt) => (
                            <label key={opt.name} style={{ display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
                                <input
                                    type="checkbox"
                                    name={opt.name}
                                    checked={options[opt.name]}
                                    onChange={handleOptionChange}
                                    style={{ marginRight: "10px", accentColor: "#00ff88", width: "18px", height: "18px" }}
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePassword}
                    style={{
                        width: "100%",
                        marginTop: "30px",
                        padding: "15px",
                        background: "linear-gradient(45deg, #00ff88, #00cc6a)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#003300",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "transform 0.1s, box-shadow 0.2s",
                        boxShadow: "0 4px 15px rgba(0, 255, 136, 0.2)",
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
                    onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
                    onMouseDown={(e) => (e.target.style.transform = "translateY(1px)")}
                >
                    Generar Nueva Contraseña
                </button>

                {/* History Section */}
                {history.length > 0 && (
                    <div style={{ marginTop: "30px", borderTop: "1px solid #333", paddingTop: "20px" }}>
                        <h3 style={{ color: "#888", fontSize: "1rem", marginBottom: "15px" }}>Historial Reciente</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {history.map((pass, idx) => (
                                <div key={idx} style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px", background: "#0a0a0a", borderRadius: "8px", border: "1px solid #222"
                                }}>
                                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.9rem", color: "#ccc", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {pass}
                                    </span>
                                    <button
                                        onClick={() => copyToClipboard(pass)}
                                        style={{ background: "none", border: "none", cursor: "pointer", color: "#00ff88" }}
                                        title="Copiar"
                                    >
                                        📋
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <a
                    href="/herramientas"
                    style={{
                        display: "block",
                        textAlign: "center",
                        marginTop: "20px",
                        color: "#666",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                    }}
                >
                    ← Volver a Herramientas
                </a>
            </div>
        </div>
    );
}
