"use client";
import { Sidebar, ThreatMap, TerminalLog } from '../components/DashboardComponents';
import SystemStatus from '../components/SystemStatus';
import Link from 'next/link';
import { useTranslation } from '../context/LanguageContext';

export default function Laboratorio() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#050505] text-[#cfeed8] font-mono flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8 border-b border-[#00ff88]/20 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-[#00ff88] tracking-tighter" style={{ textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
              {t('dashboard.title')}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{t('dashboard.connection')}</p>
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
            <SystemStatus />
            <TerminalLog />
          </div>
        </div>

        {/* Tools Grid */}
        <h2 className="text-xl font-bold text-[#00ff88] mb-4 flex items-center">
          <span className="mr-2">⚡</span> {t('dashboard.available_tools')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <ToolCard
            title={t('sidebar.steganography')}
            desc={t('tools.steganography.desc')}
            href="/herramientas/steganography"
            icon="🖼️"
          />
          <ToolCard
            title={t('sidebar.link_forensics')}
            desc={t('tools.phishing.desc')}
            href="/herramientas/phishing"
            icon="🔎"
          />
          <ToolCard
            title={t('sidebar.sqli_tester')}
            desc={t('tools.sqli.desc')}
            href="/herramientas/sqli"
            icon="💉"
          />
          <ToolCard
            title={t('sidebar.browser_auditor')}
            desc={t('tools.browser_auditor.desc')}
            href="/herramientas/browser-auditor"
            icon="🕵️"
          />
          <ToolCard
            title={t('sidebar.entropy_auditor')}
            desc={t('tools.entropy_auditor.desc')}
            href="/herramientas/bruteforce-sim"
            icon="⚡"
          />
          <ToolCard
            title={t('sidebar.ai_threat_detector')}
            desc={t('tools.ai_threat_detector.desc')}
            href="/herramientas/ai-threat-detector"
            icon="🤖"
          />
          <ToolCard
            title={t('sidebar.data_leak')}
            desc={t('tools.data_leak.desc')}
            href="/herramientas/data-leak"
            icon="🔐"
          />
          <ToolCard
            title={t('sidebar.threat_intel')}
            desc={t('tools.threat_intel.desc')}
            href="/herramientas/threat-intel"
            icon="🌍"
          />
          <ToolCard
            title={t('sidebar.cve_oracle')}
            desc={t('tools.cve_oracle.desc')}
            href="/herramientas/cve-oracle"
            icon="📖"
          />
          <ToolCard
            title={t('sidebar.cloud_sentry')}
            desc={t('tools.cloud_sentry.desc')}
            href="/herramientas/cloud-sentry"
            icon="☁️"
          />
          <ToolCard
            title={t('sidebar.bin_analyst')}
            desc={t('tools.bin_analyst.desc')}
            href="/herramientas/bin-analyst"
            icon="🧩"
          />
          <ToolCard
            title={t('sidebar.hash_cracker')}
            desc={t('tools.hash_cracker.desc')}
            href="/herramientas/hash-cracker"
            icon="💀"
          />
          <ToolCard
            title={t('sidebar.osint_searcher')}
            desc={t('tools.osint_searcher.desc')}
            href="/herramientas/osint-searcher"
            icon="👤"
          />
          <ToolCard
            title={t('sidebar.dark_web_monitor')}
            desc={t('tools.dark_web_monitor.desc')}
            href="/herramientas/dark-web-monitor"
            icon="🔦"
          />
          <ToolCard
            title={t('sidebar.geo_tracker')}
            desc={t('tools.geo_tracker.desc')}
            href="/herramientas/geo-tracker"
            icon="📍"
          />
          <ToolCard
            title={t('sidebar.recovery_protocol')}
            desc={t('tools.recovery_protocol.desc')}
            href="/herramientas/recovery-protocol"
            icon="🆘"
          />
          <ToolCard
            title={t('sidebar.account_resurrect')}
            desc={t('tools.account_resurrect.desc')}
            href="/herramientas/account-resurrect"
            icon="🧟"
          />
          <ToolCard
            title={t('sidebar.attacker_intercept')}
            desc={t('tools.attacker_intercept.desc')}
            href="/herramientas/attacker-intercept"
            icon="🤺"
          />
          <ToolCard
            title={t('sidebar.session_sanitizer')}
            desc={t('tools.session_sanitizer.desc')}
            href="/herramientas/session-sanitizer"
            icon="🧼"
          />
          <ToolCard
            title={t('sidebar.forensic_report')}
            desc={t('tools.forensic_report.desc')}
            href="/herramientas/forensic-report"
            icon="📋"
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
