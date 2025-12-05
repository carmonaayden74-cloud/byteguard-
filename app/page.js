import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#00ff88] selection:text-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-[#00ff88]">BYTEGUARD</div>
        <div className="space-x-6 text-sm font-medium text-gray-400">
          <Link href="/login" className="hover:text-white transition-colors">LOGIN</Link>
          <Link href="/herramientas" className="px-4 py-2 bg-[#00ff88] text-black rounded hover:bg-[#00cc6a] transition-colors font-bold">
            DASHBOARD
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <div className="inline-block px-3 py-1 mb-6 border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5 text-[#00ff88] text-xs font-bold tracking-widest uppercase">
          Professional Security Suite v2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          Advanced Cyber<br />Defense Platform
        </h1>

        <p className="text-gray-400 max-w-2xl text-lg mb-10 leading-relaxed">
          A complete suite of professional-grade tools for security auditing,
          forensic analysis, and defensive intelligence. Built for researchers,
          developers, and ethical hackers.
        </p>

        <div className="flex gap-4">
          <Link href="/laboratorio" className="px-8 py-4 bg-[#00ff88] text-black font-bold rounded-lg hover:bg-[#00cc6a] transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)]">
            LAUNCH CONSOLE
          </Link>
          <Link href="/legal" className="px-8 py-4 border border-gray-700 text-gray-300 font-bold rounded-lg hover:border-gray-500 hover:text-white transition-all">
            READ MANIFESTO
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-32 mb-20">
          <FeatureCard
            icon="🛡️"
            title="Site Auditor"
            desc="Analyze HTTP security headers and detect vulnerabilities in real-time."
          />
          <FeatureCard
            icon="📡"
            title="Network Intel"
            desc="Advanced OSINT tool for IP geolocation, ISP tracking, and ASN analysis."
          />
          <FeatureCard
            icon="🖼️"
            title="Secure Stego"
            desc="Military-grade AES-256 encryption for hiding data within digital images."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-10 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} ByteGuard Security Research. All rights reserved.</p>
        <p className="mt-2">For educational and defensive purposes only.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-gray-800 hover:border-[#00ff88]/50 transition-colors text-left group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
