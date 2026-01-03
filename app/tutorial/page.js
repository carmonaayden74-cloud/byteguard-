"use client";

import { Sidebar } from '../components/DashboardComponents';

export default function TutorialPage() {
    const scenarios = [
        {
            title: "ESCENARIO 1: Recuperar Facebook",
            icon: "📘",
            color: "text-blue-500",
            border: "border-blue-500",
            bg: "bg-blue-900/10",
            steps: [
                "Ve al menú lateral y busca 'Resurrección Cuentas'.",
                "Selecciona el botón AZUL de Facebook.",
                "Escribe tu correo antiguo en el campo central.",
                "Pulsa el botón VERDE 'RESURRECT FACEBOOK_ACCOUNT'.",
                "Espera a que salga el mensaje 'RESTORATION_SYNC_COMPLETE'."
            ]
        },
        {
            title: "ESCENARIO 2: Atrapar al Hacker",
            icon: "🤺",
            color: "text-red-500",
            border: "border-red-500",
            bg: "bg-red-900/10",
            steps: [
                "Ve al menú lateral y busca 'Interceptor Atacante'.",
                "Elige 'Document Canary' en el menú de la izquierda.",
                "Pulsa el botón ROJO 'DEPLOY INTERCEPTOR'.",
                "Envía el archivo falso generado al sospechoso.",
                "Espera a que aparezca su IP y ubicación en el mapa."
            ]
        },
        {
            title: "ESCENARIO 3: Expulsar Intrusos",
            icon: "☢️",
            color: "text-yellow-500",
            border: "border-yellow-500",
            bg: "bg-yellow-900/10",
            steps: [
                "Ve al menú lateral y busca 'Session Sanitizer'.",
                "Introduce tu ID de usuario.",
                "Pulsa el botón de emergencia 'EJECUTAR PURGA GLOBAL'.",
                "El sistema cerrará sesión en todos los dispositivos."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
            <div className="lightning-bg opacity-20"></div>
            <Sidebar />
            <main className="flex-1 p-8 relative z-10 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <header className="mb-12 border-b border-[#00ff88]/20 pb-8">
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">
                            MANUAL_<span className="text-[#00ff88]">OMEGA</span>
                        </h1>
                        <p className="text-gray-400 font-bold">Guía de Operaciones Tácticas Integrada</p>
                    </header>

                    <div className="space-y-12">
                        {scenarios.map((scenario, index) => (
                            <div key={index} className={`glass-card-extreme p-8 border ${scenario.border}/30 ${scenario.bg} relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl grayscale pointer-events-none select-none">
                                    {scenario.icon}
                                </div>
                                <h2 className={`text-2xl font-black ${scenario.color} uppercase mb-6 flex items-center gap-3`}>
                                    <span className="text-4xl">{scenario.icon}</span> {scenario.title}
                                </h2>
                                <div className="space-y-4 relative z-10">
                                    {scenario.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="flex gap-4 items-start">
                                            <div className={`w-8 h-8 rounded-full ${scenario.color.replace('text', 'bg')} text-black flex items-center justify-center font-black text-sm shrink-0`}>
                                                {stepIndex + 1}
                                            </div>
                                            <p className="text-lg font-bold text-gray-200 pt-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-8 bg-gray-900 rounded-2xl border border-gray-700 text-center">
                        <p className="text-gray-400 mb-4">¿Listo para probarlo?</p>
                        <a href="/laboratorio" className="inline-block bg-[#00ff88] text-black font-black px-8 py-3 rounded-lg hover:bg-white transition-colors uppercase tracking-widest">
                            IR AL LABORATORIO
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
