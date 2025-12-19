'use client';
import { useState, createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DefenseContext = createContext();

export function DefenseProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const logIncident = async (n) => {
        if (!user) return;
        try {
            await fetch('/api/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    type: n.type,
                    title: n.message,
                    description: n.details,
                    severity: n.type === 'ALERT' ? 'CRITICAL' : 'HIGH',
                    metadata: { timestamp: new Date().toISOString() }
                })
            });
        } catch (e) {
            console.error("Failed to log incident:", e);
        }
    };

    const notify = (type, message, details) => {
        const id = Date.now();
        const severity = type === 'ALERT' ? 'CRITICAL' : 'HIGH';
        const newNotification = { id, type, message, details, severity };

        setNotifications(prev => [newNotification, ...prev].slice(0, 5));

        // Log to backend for SOC persistence
        logIncident(newNotification);

        // Escalation Simulation (Enterprise Hook)
        if (severity === 'CRITICAL') {
            triggerEscalation(newNotification);
        }

        // Auto-remove after 6 seconds (slightly longer for enterprise focus)
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000);
    };

    const triggerEscalation = (n) => {
        console.log(`[ENTERPRISE_ESC] Sending critical alert to security webhooks: ${n.message}`);
        // In a real enterprise env, this would hit a Slack/Teams webhook or PagerDuty
    };

    return (
        <DefenseContext.Provider value={{ notify }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {notifications.map(n => (
                    <div key={n.id} className="pointer-events-auto animate-in slide-in-from-right duration-500">
                        <div className={`glass-card p-5 rounded-2xl border-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${n.type === 'ALERT' ? 'border-red-500/50 bg-red-950/20' : 'border-yellow-500/50 bg-yellow-950/20'
                            } min-w-[320px] relative overflow-hidden group`}>
                            <div className="scanner-overlay opacity-20"></div>

                            <div className="flex items-center gap-3 mb-2 relative z-10">
                                <div className={`p-1.5 rounded-lg ${n.type === 'ALERT' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {n.type === 'ALERT' ? '🚫' : '⚠️'}
                                </div>
                                <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/50">
                                    {n.type === 'ALERT' ? 'Defense Protocol Active' : 'System Anomaly Detected'}
                                </span>
                            </div>

                            <div className="text-sm font-bold text-white mb-1 relative z-10">{n.message}</div>
                            {n.details && <div className="text-[10px] text-gray-400 font-mono relative z-10 p-2 bg-black/40 rounded-lg border border-white/5 mt-2">{n.details}</div>}

                            <div className={`absolute bottom-0 left-0 h-1 transition-all duration-[5000ms] ease-linear ${n.type === 'ALERT' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: '100%', animation: 'shrink 5s linear forwards' }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </DefenseContext.Provider>
    );
}

export const useDefense = () => useContext(DefenseContext);
