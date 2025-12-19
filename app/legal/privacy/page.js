import Link from "next/link";

export const metadata = {
    title: 'Privacy Policy - ByteGuard',
    description: 'Política de privacidad y protección de datos de ByteGuard'
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-8 md:p-20">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-[#00ff88] hover:underline mb-8 block">← Volver al inicio</Link>

                <h1 className="text-4xl font-bold text-white mb-8 tracking-tighter">Política de Privacidad</h1>
                <p className="text-sm text-gray-500 mb-8">Última actualización: Diciembre 2024</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
                        <p className="mb-4">
                            ByteGuard recopila la siguiente información para proporcionar y mejorar nuestros servicios:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Información de cuenta:</strong> Email, nombre de usuario, contraseña encriptada</li>
                            <li><strong>Datos de uso:</strong> Historial de escaneos, herramientas utilizadas, configuraciones</li>
                            <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
                            <li><strong>Datos de pago:</strong> Procesados de forma segura por proveedores externos (Stripe/PayPal)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Cómo Usamos tu Información</h2>
                        <p className="mb-4">Utilizamos la información recopilada para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proporcionar y mantener nuestros servicios de seguridad</li>
                            <li>Personalizar tu experiencia y mejorar nuestras herramientas</li>
                            <li>Procesar transacciones y gestionar suscripciones</li>
                            <li>Enviar notificaciones importantes sobre el servicio</li>
                            <li>Detectar y prevenir fraudes o uso indebido</li>
                            <li>Cumplir con obligaciones legales</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Protección de Datos</h2>
                        <p className="mb-4">
                            Implementamos medidas de seguridad de nivel empresarial para proteger tu información:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Encriptación:</strong> Todos los datos se transmiten mediante HTTPS/TLS</li>
                            <li><strong>Almacenamiento seguro:</strong> Contraseñas hasheadas con bcrypt, datos en Supabase con encriptación AES-256</li>
                            <li><strong>Acceso limitado:</strong> Solo personal autorizado puede acceder a datos sensibles</li>
                            <li><strong>Auditorías regulares:</strong> Revisiones de seguridad periódicas</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Compartir Información</h2>
                        <p className="mb-4">
                            <strong>No vendemos ni compartimos</strong> tu información personal con terceros, excepto:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Proveedores de servicios necesarios (hosting, procesamiento de pagos)</li>
                            <li>Cuando sea requerido por ley o para proteger nuestros derechos</li>
                            <li>Con tu consentimiento explícito</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Tus Derechos (GDPR)</h2>
                        <p className="mb-4">Si resides en la UE, tienes derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                            <li><strong>Rectificación:</strong> Corregir información inexacta</li>
                            <li><strong>Eliminación:</strong> Solicitar la eliminación de tus datos (&quot;derecho al olvido&quot;)</li>
                            <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado</li>
                            <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                        </ul>
                        <p className="mt-4">
                            Para ejercer estos derechos, contacta: <a href="mailto:privacy@byteguard.com" className="text-[#00ff88] hover:underline">privacy@byteguard.com</a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Cookies y Tecnologías Similares</h2>
                        <p className="mb-4">
                            Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas para mejorar la experiencia.
                            Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Retención de Datos</h2>
                        <p>
                            Conservamos tu información mientras tu cuenta esté activa o según sea necesario para proporcionar servicios.
                            Los datos de escaneos se conservan por 90 días (plan Pro) o ilimitadamente (plan Enterprise).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Cambios a esta Política</h2>
                        <p>
                            Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos por email
                            o mediante un aviso destacado en nuestro sitio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Contacto</h2>
                        <p>
                            Para preguntas sobre esta política de privacidad, contacta:<br />
                            Email: <a href="mailto:privacy@byteguard.com" className="text-[#00ff88] hover:underline">privacy@byteguard.com</a><br />
                            Dirección: ByteGuard Security Research, [Dirección]
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-800 mt-12">
                        <p className="text-sm text-gray-500">
                            Al usar ByteGuard, aceptas esta política de privacidad. Tu seguridad y privacidad son nuestra prioridad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
