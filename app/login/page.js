"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [isResetVerifyMode, setIsResetVerifyMode] = useState(false); // Mode for entering code
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { signIn, signUp, user, resetPassword, verifyOtp, updatePassword } = useAuth();
    const router = useRouter();

    // Redirect when user is authenticated
    useEffect(() => {
        if (user) {
            router.push('/herramientas');
        }
    }, [user, router]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        let result;

        if (isResetVerifyMode) {
            // Step 2: Verify OTP and Update Password
            const { error: verifyError } = await verifyOtp(email, otp);
            if (verifyError) {
                setError("Invalid or expired code. Please try again.");
                setLoading(false);
                return;
            }

            const { error: updateError } = await updatePassword(newPassword);
            if (updateError) {
                setError(updateError.message);
            } else {
                setError("Password updated successfully! You can now login.");
                setIsResetVerifyMode(false);
                setIsResetMode(false);
                // Optionally clear fields
                setOtp('');
                setNewPassword('');
                setPassword('');
            }
            setLoading(false);
            return;
        }

        if (isResetMode) {
            // Step 1: Send Reset Link
            const { error } = await resetPassword(email);
            if (error) {
                setError(error.message);
            } else {
                setError("Check your email for the code.");
                setIsResetVerifyMode(true); // Move to verification step
            }
            setLoading(false);
            return;
        }

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
                }
                // If session exists, useEffect will handle redirect
            }
            // If sign in success, useEffect will handle redirect
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
                    <p style={{ color: "#888" }}>
                        {isResetVerifyMode ? "Set New Password" : (isResetMode ? "Reset Password" : (isSignUp ? "Create Enterprise Account" : "Enterprise Access"))}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: error.includes("created") || error.includes("Check your email") ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 77, 77, 0.1)",
                        border: `1px solid ${error.includes("created") || error.includes("Check your email") ? "#00ff88" : "#ff4d4d"}`,
                        color: error.includes("created") || error.includes("Check your email") ? "#00ff88" : "#ff4d4d",
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
                    {!isResetMode && !isResetVerifyMode && (
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
                    )}

                    {isResetVerifyMode && (
                        <>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "0.9rem" }}>Code from Email</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
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
                                    placeholder="123456"
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "0.9rem" }}>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
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
                                    placeholder="New Secure Password"
                                />
                            </div>
                        </>
                    )}

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
                        {loading ? "Processing..." : (isResetVerifyMode ? "Update Password" : (isResetMode ? "Send Reset Link" : (isSignUp ? "Create Account" : "Access Console")))}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {!isResetMode && !isResetVerifyMode && (
                        <button
                            type="button"
                            onClick={() => { setIsResetMode(true); setError(null); }}
                            style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: "0.9rem" }}
                        >
                            Forgot Password?
                        </button>
                    )}

                    {isResetMode && !isResetVerifyMode && (
                        <button
                            type="button"
                            onClick={() => { setIsResetVerifyMode(true); setError(null); }}
                            style={{ background: "none", border: "none", color: "#00ff88", cursor: "pointer", fontSize: "0.9rem" }}
                        >
                            I have a code
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (isResetVerifyMode) {
                                setIsResetVerifyMode(false);
                            } else if (isResetMode) {
                                setIsResetMode(false);
                            } else {
                                setIsSignUp(!isSignUp);
                            }
                            setError(null);
                        }}
                        style={{ background: "none", border: "none", color: "#00ff88", cursor: "pointer", textDecoration: "underline" }}
                    >
                        {isResetMode || isResetVerifyMode ? "Back to Login" : (isSignUp ? "Already have an account? Login" : "Need an account? Sign Up")}
                    </button>
                </div>

                <div style={{ marginTop: "30px", textAlign: "center", fontSize: "0.8rem", color: "#666" }}>
                    Protected by ByteGuard Identity Services
                </div>
            </div>
        </div>
    );
}
