import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white py-20 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-2 mb-6 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5 text-[#00ff88] text-xs font-bold tracking-widest uppercase">
                        Planes y Precios
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Elige tu Plan
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Accede a herramientas profesionales de ciberseguridad. Desde principiantes hasta empresas.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                    {/* Free Plan */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 flex flex-col hover:border-gray-700 transition-all">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Gratis</h2>
                            <div className="text-5xl font-bold mb-2">$0</div>
                            <p className="text-gray-500">Para siempre</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>5 herramientas básicas</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>10 escaneos por día</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Exportar reportes básicos</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gray-600 text-xl">✗</span>
                                <span className="text-gray-600">AI Assistant</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-gray-600 text-xl">✗</span>
                                <span className="text-gray-600">Historial de escaneos</span>
                            </li>
                        </ul>
                        <Link
                            href="/login"
                            className="block w-full py-3 px-6 rounded-lg bg-gray-800 hover:bg-gray-700 font-bold transition-all text-center"
                        >
                            Comenzar Gratis
                        </Link>
                    </div>

                    {/* Pro Plan - RECOMMENDED */}
                    <div className="bg-[#0a0a0a] border-2 border-[#00ff88] rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-2xl shadow-[#00ff88]/20 transform scale-105">
                        <div className="absolute top-0 right-0 bg-[#00ff88] text-black text-xs font-bold px-4 py-2 rounded-bl-lg">
                            MÁS POPULAR
                        </div>
                        <div className="mb-6 mt-4">
                            <h2 className="text-2xl font-bold mb-2 text-[#00ff88]">Pro</h2>
                            <div className="text-5xl font-bold mb-2">$19</div>
                            <p className="text-gray-500">por mes</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span><strong>15 herramientas completas</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Escaneos ilimitados</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span><strong>AI Assistant ilimitado</strong></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Reportes PDF profesionales</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Historial completo</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Soporte prioritario</span>
                            </li>
                        </ul>
                        <button className="block w-full py-3 px-6 rounded-lg bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)]">
                            Obtener Pro
                        </button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-8 flex flex-col hover:border-gray-700 transition-all">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
                            <div className="text-5xl font-bold mb-2">Custom</div>
                            <p className="text-gray-500">Contactar ventas</p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Todo de Pro +</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Usuarios ilimitados</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>API personalizada</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Deployment on-premise</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>SLA garantizado</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#00ff88] text-xl">✓</span>
                                <span>Soporte 24/7 dedicado</span>
                            </li>
                        </ul>
                        <Link
                            href="/contacto"
                            className="block w-full py-3 px-6 rounded-lg border border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88] hover:text-black font-bold transition-all text-center"
                        >
                            Contactar Ventas
                        </Link>
                    </div>
                </div>

                {/* Feature Comparison Table */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Comparación Detallada</h2>
                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left p-6 text-gray-400 font-normal">Características</th>
                                    <th className="p-6 text-center">Gratis</th>
                                    <th className="p-6 text-center bg-[#00ff88]/5">Pro</th>
                                    <th className="p-6 text-center">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                <FeatureRow feature="Herramientas de seguridad" free="5 básicas" pro="15 completas" enterprise="15 + custom" />
                                <FeatureRow feature="Escaneos por día" free="10" pro="Ilimitados" enterprise="Ilimitados" />
                                <FeatureRow feature="AI Assistant" free="✗" pro="✓ Ilimitado" enterprise="✓ Ilimitado" />
                                <FeatureRow feature="Exportar reportes PDF" free="Básicos" pro="Profesionales" enterprise="Personalizados" />
                                <FeatureRow feature="Historial de escaneos" free="✗" pro="✓ 90 días" enterprise="✓ Ilimitado" />
                                <FeatureRow feature="Usuarios" free="1" pro="1" enterprise="Ilimitados" />
                                <FeatureRow feature="API Access" free="✗" pro="✗" enterprise="✓ Custom" />
                                <FeatureRow feature="Soporte" free="Comunidad" pro="Prioritario" enterprise="24/7 Dedicado" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
                    <div className="space-y-6">
                        <FAQItem
                            question="¿Puedo cambiar de plan en cualquier momento?"
                            answer="Sí, puedes actualizar o degradar tu plan en cualquier momento. Los cambios se reflejan inmediatamente."
                        />
                        <FAQItem
                            question="¿Ofrecen descuentos para estudiantes?"
                            answer="Sí, ofrecemos 50% de descuento en el plan Pro para estudiantes con email .edu verificado."
                        />
                        <FAQItem
                            question="¿Qué métodos de pago aceptan?"
                            answer="Aceptamos tarjetas de crédito/débito, PayPal, y transferencias bancarias para planes Enterprise."
                        />
                        <FAQItem
                            question="¿Hay garantía de devolución?"
                            answer="Sí, ofrecemos garantía de devolución de 30 días sin preguntas en todos los planes de pago."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureRow({ feature, free, pro, enterprise }) {
    return (
        <tr>
            <td className="p-6 text-gray-300">{feature}</td>
            <td className="p-6 text-center text-gray-500">{free}</td>
            <td className="p-6 text-center bg-[#00ff88]/5 font-bold">{pro}</td>
            <td className="p-6 text-center text-gray-300">{enterprise}</td>
        </tr>
    );
}

function FAQItem({ question, answer }) {
    return (
        <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{question}</h3>
            <p className="text-gray-400">{answer}</p>
        </div>
    );
}
