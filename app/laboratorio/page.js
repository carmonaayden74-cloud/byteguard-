"use client";
import { Sidebar, ThreatMap, TerminalLog, StatsPanel } from '../components/DashboardComponents';
import Link from 'next/link';

export default function Laboratorio() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 border-b border-[#00ff88]/20 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#00ff88] tracking-tighter" style={{ textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
              COMMAND CENTER
            </h1>
            <p className="text-sm text-gray-500 mt-1">SECURE CONNECTION ESTABLISHED</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-gray-500">USER</div>
              <div className="text-[#00ff88] font-bold">ADMIN</div>
            </div>
            <div className="w-10 h-10 bg-[#00ff88]/20 rounded-full border border-[#00ff88] flex items-center justify-center text-[#00ff88]">
              A
            </div>
          </div>
        </header>

        {/* Top Grid: Map & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ThreatMap />
          </div>
          <div className="flex flex-col gap-6">
            <StatsPanel />
            <TerminalLog />
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-xl font-bold text-[#00ff88] mb-4 flex items-center">
          <span className="mr-2">⚡</span> AVAILABLE TOOLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ToolCard
            title="STEGANOGRAPHY"
            desc="Hide data in images"
            href="/herramientas/steganography"
            icon="🖼️"
          />
          <ToolCard
            title="PHISHING SIM"
            desc="Analyze suspicious links"
            href="/herramientas/phishing"
            icon="🎣"
          />
          <ToolCard
            title="SQL INJECTION"
            desc="Test database vulnerabilities"
            href="/herramientas/sqli"
            icon="💉"
          />
          <ToolCard
            title="KEYLOGGER DET"
            desc="Detect malicious inputs"
            href="/herramientas/keylogger"
            icon="⌨️"
          />
          <ToolCard
            title="PASSWORD GEN"
            desc="Create secure keys"
            href="/herramientas/generador-passwords"
            icon="🔑"
          />
          <ToolCard
            title="PORT SCANNER"
            desc="Simulate network scan"
            href="/herramientas/escaneo-de-puertos"
            icon="📡"
          />
        </div>
      </main>
    </div>
  );
}

function ToolCard({ title, desc, href, icon }) {
  return (
    <Link href={href} className="group block bg-[#0a0a0a] border border-[#00ff88]/20 p-6 rounded-xl hover:border-[#00ff88] hover:bg-[#00ff88]/5 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-lg font-bold text-[#00ff88] mb-2 group-hover:text-white">{title}</h3>
      <p className="text-sm text-gray-500 group-hover:text-gray-400">{desc}</p>
    </Link>
  );
}
