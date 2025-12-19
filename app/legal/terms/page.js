import Link from "next/link";

export const metadata = {
    title: 'Terms of Service - ByteGuard',
    description: 'Términos y condiciones de uso de ByteGuard'
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-8 md:p-20">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="text-[#00ff88] hover:underline mb-8 block">← Volver al inicio</Link>

                <h1 className="text-4xl font-bold text-white mb-8 tracking-tighter">Términos de Servicio</h1>
                <p className="text-sm text-gray-500 mb-8">Última actualización: Diciembre 2024</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
                        <p>
                            Al acceder y usar ByteGuard (&quot;el Servicio&quot;), aceptas estar legalmente vinculado por estos Términos de Servicio.
                            Si no estás de acuerdo con alguna parte de estos términos, no debes usar el Servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
                        <p className="mb-4">
                            ByteGuard es una plataforma de herramientas de ciberseguridad diseñada para:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Auditorías de seguridad autorizadas</li>
                            <li>Educación en ciberseguridad</li>
                            <li>Investigación defensiva</li>
                            <li>Pruebas de penetración éticas</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Uso Aceptable</h2>
                        <p className="mb-4"><strong>DEBES:</strong></p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Usar el Servicio solo en sistemas que posees o para los que tienes autorización explícita</li>
                            <li>Cumplir con todas las leyes locales, estatales, nacionales e internacionales</li>
                            <li>Reportar vulnerabilidades de forma responsable</li>
                            <li>Mantener la confidencialidad de tus credenciales de acceso</li>
                        </ul>
                        <p className="mb-4"><strong>NO DEBES:</strong></p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Usar el Servicio para atacar sistemas sin autorización</li>
                            <li>Distribuir malware o contenido malicioso</li>
                            <li>Intentar eludir medidas de seguridad del Servicio</li>
                            <li>Revender o redistribuir el Servicio sin permiso</li>
                            <li>Usar el Servicio para actividades ilegales</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Cuentas de Usuario</h2>
                        <p className="mb-4">Para usar ciertas funciones, debes crear una cuenta. Eres responsable de:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Mantener la seguridad de tu contraseña</li>
                            <li>Todas las actividades que ocurran bajo tu cuenta</li>
                            <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                        </ul>
                        <p className="mt-4">
                            Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Suscripciones y Pagos</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Facturación:</strong> Las suscripciones se facturan mensualmente o anualmente según tu plan</li>
                            <li><strong>Renovación automática:</strong> Las suscripciones se renuevan automáticamente hasta que las canceles</li>
                            <li><strong>Cancelación:</strong> Puedes cancelar en cualquier momento desde tu panel de control</li>
                            <li><strong>Reembolsos:</strong> Ofrecemos reembolsos dentro de 30 días de la compra inicial</li>
                            <li><strong>Cambios de precio:</strong> Te notificaremos con 30 días de anticipación sobre cambios de precio</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Propiedad Intelectual</h2>
                        <p className="mb-4">
                            El Servicio y su contenido original, características y funcionalidad son propiedad de ByteGuard y están protegidos
                            por derechos de autor, marcas registradas y otras leyes de propiedad intelectual.
                        </p>
                        <p>
                            Se te otorga una licencia limitada, no exclusiva e intransferible para usar el Servicio según estos términos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Limitación de Responsabilidad</h2>
                        <p className="mb-4">
                            <strong>EL SERVICIO SE PROPORCIONA &quot;TAL CUAL&quot; Y &quot;SEGÚN DISPONIBILIDAD&quot;.</strong> No garantizamos que:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>El Servicio será ininterrumpido o libre de errores</li>
                            <li>Los resultados obtenidos serán precisos o confiables</li>
                            <li>Todos los defectos serán corregidos</li>
                        </ul>
                        <p className="mt-4">
                            En ningún caso ByteGuard será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos,
                            incluyendo pérdida de beneficios, datos, uso, o pérdidas intangibles.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Indemnización</h2>
                        <p>
                            Aceptas indemnizar y eximir de responsabilidad a ByteGuard de cualquier reclamo, daño, obligación, pérdida,
                            responsabilidad, costo o deuda, y gastos (incluyendo honorarios de abogados) que surjan de:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li>Tu uso del Servicio</li>
                            <li>Violación de estos Términos</li>
                            <li>Violación de derechos de terceros</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Modificaciones del Servicio</h2>
                        <p>
                            Nos reservamos el derecho de modificar o discontinuar el Servicio (o cualquier parte) en cualquier momento,
                            con o sin previo aviso. No seremos responsables ante ti o terceros por cualquier modificación, suspensión o
                            discontinuación del Servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Ley Aplicable</h2>
                        <p>
                            Estos Términos se regirán e interpretarán de acuerdo con las leyes de [Jurisdicción], sin tener en cuenta
                            sus disposiciones sobre conflictos de leyes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Contacto</h2>
                        <p>
                            Para preguntas sobre estos Términos, contacta:<br />
                            Email: <a href="mailto:legal@byteguard.com" className="text-[#00ff88] hover:underline">legal@byteguard.com</a>
                        </p>
                    </section>

                    <div className="pt-8 border-t border-gray-800 mt-12">
                        <p className="text-sm text-gray-500">
                            Al usar ByteGuard, reconoces que has leído, entendido y aceptas estar vinculado por estos Términos de Servicio.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
