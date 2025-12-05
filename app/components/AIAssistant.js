'use client';

import { useState, useRef, useEffect } from 'react';

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hola, soy Ayden IA. Tu asistente experto en ciberseguridad. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        // Load API Key from local storage
        try {
            if (typeof window !== 'undefined') {
                const storedKey = localStorage.getItem('openai_api_key');
                if (storedKey) setApiKey(storedKey);
            }
        } catch (e) {
            console.error("Error accessing localStorage:", e);
        }

        // Load chat history if exists (optional, maybe just keep session for now)
    }, [messages]);

    const handleSaveSettings = () => {
        try {
            localStorage.setItem('openai_api_key', apiKey);
            setShowSettings(false);
        } catch (e) {
            console.error("Error saving to localStorage:", e);
            alert("No se pudo guardar la configuración (Cookies bloqueadas?)");
        }
    };

    const handleClearChat = () => {
        setMessages([{ role: 'assistant', content: 'Chat limpiado. ¿En qué más puedo ayudarte?' }]);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    apiKey: apiKey // Send client-side key if available
                }),
            });

            if (!response.ok) throw new Error('Error en la respuesta');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema al procesar tu solicitud. Verifica tu API Key en configuración." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '600px',
                    backgroundColor: 'rgba(10, 10, 10, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 136, 0.2)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    marginBottom: '15px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '15px 20px',
                        background: 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)',
                        borderBottom: '1px solid rgba(0,255,136,0.1)',
                        color: '#00ff88',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%',
                                boxShadow: '0 0 10px #00ff88'
                            }}></div>
                            <span>Ayden IA</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                title="Configuración"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7, transition: 'opacity 0.2s' }}
                                onMouseOver={e => e.target.style.opacity = 1}
                                onMouseOut={e => e.target.style.opacity = 0.7}
                            >
                                ⚙️
                            </button>
                            <button
                                onClick={handleClearChat}
                                title="Limpiar Chat"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7, transition: 'opacity 0.2s' }}
                                onMouseOver={e => e.target.style.opacity = 1}
                                onMouseOut={e => e.target.style.opacity = 0.7}
                            >
                                🗑️
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#fff', lineHeight: 0.8 }}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* Settings Modal Overlay */}
                    {showSettings && (
                        <div style={{
                            position: 'absolute', top: '60px', left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.9)', zIndex: 10, padding: '20px',
                            display: 'flex', flexDirection: 'column', gap: '15px'
                        }}>
                            <h3 style={{ color: '#fff', margin: 0 }}>Configuración</h3>
                            <div>
                                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>OpenAI API Key</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk-..."
                                    style={{
                                        width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333',
                                        background: '#111', color: '#fff', outline: 'none'
                                    }}
                                />
                                <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '5px' }}>
                                    Tu clave se guarda localmente en tu navegador.
                                </p>
                            </div>
                            <button
                                onClick={handleSaveSettings}
                                style={{
                                    padding: '10px', background: '#00ff88', color: '#000', border: 'none', borderRadius: '8px',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Guardar
                            </button>
                        </div>
                    )}

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '20px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        background: 'rgba(0,0,0,0.3)'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    backgroundColor: msg.role === 'user' ? '#00ff88' : '#1a1a1a',
                                    color: msg.role === 'user' ? '#000' : '#e0e0e0',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                    border: msg.role === 'assistant' ? '1px solid #333' : 'none',
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ alignSelf: 'flex-start', color: '#00ff88', fontSize: '0.8rem', marginLeft: '10px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                                <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
                                <span style={{ width: '6px', height: '6px', background: '#00ff88', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '15px',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex',
                        gap: '10px',
                        background: 'rgba(10,10,10,0.8)'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu mensaje..."
                            style={{
                                flex: 1,
                                padding: '12px 15px',
                                borderRadius: '25px',
                                border: '1px solid #333',
                                backgroundColor: '#050505',
                                color: 'white',
                                outline: 'none',
                                fontSize: '0.95rem',
                                transition: 'border 0.2s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#00ff88'}
                            onBlur={e => e.target.style.borderColor = '#333'}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: input.trim() ? '#00ff88' : '#222',
                                border: 'none',
                                cursor: input.trim() ? 'pointer' : 'default',
                                color: input.trim() ? '#000' : '#555',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                fontSize: '1.2rem'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#00ff88',
                        border: 'none',
                        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2rem',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        color: '#000'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.4)';
                    }}
                >
                    🧠
                </button>
            )}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}
