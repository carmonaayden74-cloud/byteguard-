"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

// Mock Mode Flag - Force true because we know Supabase is broken
const USE_MOCK_AUTH = true;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (USE_MOCK_AUTH) {
            // Mock Session Check
            const storedUser = localStorage.getItem('byteguard_mock_user');
            if (storedUser) {
                // eslint-disable-next-line
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
            return;
        }

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mockAuth = {
        signUp: async (data) => {
            const newUser = { id: 'mock-user-id', email: data.email, role: 'authenticated' };
            localStorage.setItem('byteguard_mock_user', JSON.stringify(newUser));
            setUser(newUser);
            return { data: { user: newUser, session: { user: newUser } }, error: null };
        },
        signIn: async (data) => {
            // Accept any password for demo purposes, or specific one
            if (data.email) {
                const newUser = { id: 'mock-user-id', email: data.email, role: 'authenticated' };
                localStorage.setItem('byteguard_mock_user', JSON.stringify(newUser));
                setUser(newUser);
                return { data: { user: newUser, session: { user: newUser } }, error: null };
            }
            return { error: { message: "Invalid credentials" } };
        },
        signOut: async () => {
            localStorage.removeItem('byteguard_mock_user');
            setUser(null);
            return { error: null };
        },
        resetPassword: async (email) => {
            console.log(`[Mock Auth] Reset password requested for ${email}`);
            console.log(`[Mock Auth] Use code: 123456`);
            return { data: {}, error: null };
        },
        verifyOtp: async ({ email, token, type }) => {
            if (token === '123456') {
                return { data: { session: { user: { email } } }, error: null };
            }
            return { error: { message: "Invalid code (Try 123456)" } };
        },
        updateUser: async ({ password }) => {
            console.log(`[Mock Auth] Password updated to: ${password}`);
            return { data: { user: { id: 'mock-user-id' } }, error: null };
        }
    };

    const value = {
        signUp: USE_MOCK_AUTH ? mockAuth.signUp : (data) => supabase.auth.signUp(data),
        signIn: USE_MOCK_AUTH ? mockAuth.signIn : (data) => supabase.auth.signInWithPassword(data),
        signOut: USE_MOCK_AUTH ? mockAuth.signOut : () => supabase.auth.signOut(),
        resetPassword: USE_MOCK_AUTH ? mockAuth.resetPassword : (email) => supabase.auth.resetPasswordForEmail(email),
        verifyOtp: USE_MOCK_AUTH ? mockAuth.verifyOtp : (email, token) => supabase.auth.verifyOtp({ email, token, type: 'recovery' }),
        updatePassword: USE_MOCK_AUTH ? mockAuth.updateUser : (password) => supabase.auth.updateUser({ password }),
        user,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
