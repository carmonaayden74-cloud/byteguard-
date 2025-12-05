import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 font-sans">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Planes y Precios
                </h1>
                <p className="text-xl text-gray-400 mb-16">
                    Elige el plan perfecto para potenciar tus habilidades en ciberseguridad.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col hover:border-gray-700 transition-colors">
                        <h2 className="text-2xl font-bold mb-2">Básico</h2>
                        <div className="text-4xl font-bold mb-6">Gratis</div>
                        <ul className="text-left space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Acceso a herramientas básicas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 5 consultas a la IA por día
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Comunidad pública
                            </li>
                        </ul>
                        <Link
                            href="/registro"
                            className="block w-full py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700 font-semibold transition-colors"
                        >
                            Comenzar Gratis
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-green-900/20">
                        <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                            RECOMENDADO
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-green-400">Pro Hacker</h2>
                        <div className="text-4xl font-bold mb-6">
                            $19 <span className="text-lg text-gray-400 font-normal">/mes</span>
                        </div>
                        <ul className="text-left space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Acceso ilimitado a todas las herramientas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> <strong>IA Asistente Ilimitada</strong>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Simulaciones avanzadas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Soporte prioritario 24/7
                            </li>
                        </ul>
                        <button
                            className="block w-full py-3 px-6 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold transition-colors"
                        >
                            Obtener Acceso Total
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
