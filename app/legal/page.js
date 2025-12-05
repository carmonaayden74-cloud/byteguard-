import Link from "next/link";

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-8 md:p-20">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="text-[#00ff88] hover:underline mb-8 block">← Back to Home</Link>

                <h1 className="text-4xl font-bold text-white mb-8 tracking-tighter">Legal & Ethics Manifesto</h1>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Purpose & Intent</h2>
                        <p>
                            ByteGuard is a professional cybersecurity suite designed exclusively for <strong>educational purposes, authorized security auditing, and defensive research</strong>.
                            The tools provided herein are intended to help developers, administrators, and security researchers identify vulnerabilities in their own systems to improve security posture.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Authorized Use Only</h2>
                        <p>
                            Usage of ByteGuard tools (including but not limited to Site Auditor, Network Intelligence, and Payload Vault) against systems, networks, or targets for which you do not have <strong>explicit, written permission</strong> is strictly prohibited and may violate local, state, and international laws (such as the CFAA in the US or GDPR in Europe).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Disclaimer of Liability</h2>
                        <p>
                            The creators and maintainers of ByteGuard accept <strong>no responsibility or liability</strong> for any damage, data loss, or legal consequences caused by the use or misuse of this software. The user assumes full responsibility for their actions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Ethical Guidelines</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Do no harm:</strong> Never use these tools to disrupt services or steal data.</li>
                            <li><strong>Respect privacy:</strong> Do not collect or expose personal information of others.</li>
                            <li><strong>Report vulnerabilities:</strong> If you find a flaw in a system, report it responsibly to the owner.</li>
                        </ul>
                    </section>

                    <div className="pt-8 border-t border-gray-800 mt-12">
                        <p className="text-sm text-gray-500">
                            By using ByteGuard, you agree to these terms. Stay safe, stay ethical.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
