"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let result;
        if (isSignUp) {
            result = await signUp({ email, password });
        } else {
            result = await signIn({ email, password });
        }

        if (result.error) {
            setError(result.error.message);
            setLoading(false);
        } else {
            if (isSignUp) {
                // Check if email confirmation is required (Supabase default)
                if (result.data?.user && !result.data.session) {
                    setError("Account created! Please check your email to confirm.");
                    setLoading(false);
                } else {
                    router.push('/herramientas');
                }
            } else {
                router.push('/herramientas');
            }
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e0e0e0",
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                padding: "40px",
                background: "#0a0a0a",
                border: "1px solid #333",
                borderRadius: "16px",
                boxShadow: "0 0 40px rgba(0, 255, 136, 0.1)"
            }}>
                <div style={{ textAlign: "center", marginBottom: "30px" }}>
                    <h1 style={{ color: "#00ff88", fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>BYTEGUARD</h1>
                    <p style={{ color: "#888" }}>{isSignUp ? "Create Enterprise Account" : "Enterprise Access"}</p>
                </div>

                {error && (
                    <div style={{
                        background: error.includes("created") ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 77, 77, 0.1)",
                        border: `1px solid ${error.includes("created") ? "#00ff88" : "#ff4d4d"}`,
                        color: error.includes("created") ? "#00ff88" : "#ff4d4d",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        fontSize: "0.9rem",
                        textAlign: "center"
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "0.9rem" }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#111",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#fff",
                                outline: "none",
                                transition: "border 0.2s"
                            }}
                            placeholder="agent@byteguard.security"
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "0.9rem" }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: "#111",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#fff",
                                outline: "none"
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "14px",
                            background: loading ? "#333" : "#00ff88",
                            color: loading ? "#888" : "#003300",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 0.2s",
                            marginTop: "10px"
                        }}
                    >
                        {loading ? "Processing..." : (isSignUp ? "Create Account" : "Access Console")}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                        style={{ background: "none", border: "none", color: "#00ff88", cursor: "pointer", textDecoration: "underline" }}
                    >
                        {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
                    </button>
                </div>

                <div style={{ marginTop: "30px", textAlign: "center", fontSize: "0.8rem", color: "#666" }}>
                    Protected by ByteGuard Identity Services
                </div>
            </div>
        </div>
    );
}
