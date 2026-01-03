"use client";

import Link from "next/link";
import { Sidebar } from "../components/DashboardComponents";
import { useTranslation } from "../context/LanguageContext";

export default function Herramientas() {
  const { t } = useTranslation();

  const tools = [
    {
      name: t('sidebar.ai_threat_detector') || "AI Threat Detector",
      url: "/herramientas/ai-threat-detector",
      icon: "🤖",
      desc: t('tools.ai_threat_detector.desc'),
      pro: true
    },
    {
      name: t('sidebar.code_analyzer') || "Code Analyzer",
      url: "/herramientas/code-analyzer",
      icon: "🔍",
      desc: t('tools.code_analyzer.desc'),
      pro: true
    },
    {
      name: t('sidebar.site_auditor') || "Site Security Auditor",
      url: "/herramientas/site-auditor",
      icon: "🛡️",
      desc: t('tools.site_auditor.desc'),
      pro: true
    },
    {
      name: t('sidebar.port_scanner') || "Port Scanner",
      url: "/herramientas/port-scanner",
      icon: "🎯",
      desc: t('tools.port_scanner.desc'),
      pro: true
    },
    {
      name: t('sidebar.dns_lookup') || "DNS Lookup",
      url: "/herramientas/dns-lookup",
      icon: "🌐",
      desc: t('tools.dns_lookup.desc'),
      pro: true
    },
    {
      name: t('sidebar.ip_intel') || "IP Intelligence",
      url: "/herramientas/ip-intel",
      icon: "📡",
      desc: t('tools.ip_intel.desc'),
      pro: true
    },
    {
      name: t('sidebar.entropy_auditor') || "Entropy Auditor",
      url: "/herramientas/bruteforce-sim",
      icon: "⚡",
      desc: t('tools.entropy_auditor.desc'),
      pro: true
    },
    {
      name: t('sidebar.password_generator') || "Password Generator",
      url: "/herramientas/generador-passwords",
      icon: "🔑",
      desc: t('tools.password_generator.desc'),
      pro: true
    },
    {
      name: t('sidebar.metadata_forensics') || "Metadata Extractor",
      url: "/herramientas/metadata",
      icon: "📸",
      desc: t('tools.metadata.desc'),
      pro: true
    },
    {
      name: t('sidebar.steganography') || "Steganography",
      url: "/herramientas/steganography",
      icon: "🖼️",
      desc: t('tools.steganography.desc'),
      pro: true
    },
    {
      name: t('sidebar.link_forensics') || "Link Forensics",
      url: "/herramientas/phishing",
      icon: "🔎",
      desc: t('tools.phishing.desc'),
      pro: true
    },
    {
      name: t('sidebar.sqli_tester') || "SQLi Tester & Fuzzer",
      url: "/herramientas/sqli",
      icon: "💉",
      desc: t('tools.sqli.desc'),
      pro: true
    },
    {
      name: t('sidebar.browser_auditor') || "Browser Auditor",
      url: "/herramientas/browser-auditor",
      icon: "🕵️",
      desc: t('tools.browser_auditor.desc'),
      pro: true
    },
    {
      name: t('sidebar.terminal') || "Terminal",
      url: "/herramientas/terminal",
      icon: "💻",
      desc: t('tools.terminal.desc'),
      pro: true
    },
    {
      name: t('sidebar.encriptador') || "Encryptor",
      url: "/herramientas/encriptador",
      icon: "🔒",
      desc: t('tools.encriptador.desc'),
      pro: true
    },
    {
      name: t('sidebar.headers') || "Headers Analyzer",
      url: "/herramientas/headers",
      icon: "📋",
      desc: t('tools.headers.desc'),
      pro: true
    },
    {
      name: t('sidebar.data_leak') || "Data Leak Detector",
      url: "/herramientas/data-leak",
      icon: "🔐",
      desc: t('tools.data_leak.desc'),
      pro: true
    },
    {
      name: t('sidebar.web_honeypot') || "Web Honeypot",
      url: "/herramientas/honeypot",
      icon: "🕸️",
      desc: t('tools.honeypot.desc'),
      pro: true
    },
    {
      name: t('sidebar.subdomain_recon') || "Subdomain Recon",
      url: "/herramientas/subdomain-recon",
      icon: "🛰️",
      desc: t('tools.subdomain_recon.desc'),
      pro: true
    },
    {
      name: t('sidebar.hash_cracker') || "Hash Cracker",
      url: "/herramientas/hash-cracker",
      icon: "💀",
      desc: t('tools.hash_cracker.desc'),
      pro: true
    },
    {
      name: t('sidebar.jwt_audit') || "JWT Audit",
      url: "/herramientas/jwt-audit",
      icon: "🎫",
      desc: t('tools.jwt_audit.desc'),
      pro: true
    },
    {
      name: t('sidebar.payload_lab') || "Payload Lab",
      url: "/herramientas/payload-lab",
      icon: "🧪",
      desc: t('tools.payload_lab.desc'),
      pro: true
    },
    {
      name: t('sidebar.threat_intel') || "Threat Intel",
      url: "/herramientas/threat-intel",
      icon: "🌍",
      desc: t('tools.threat_intel.desc'),
      pro: true
    },
    {
      name: t('sidebar.cve_oracle') || "CVE Oracle",
      url: "/herramientas/cve-oracle",
      icon: "📖",
      desc: t('tools.cve_oracle.desc'),
      pro: true
    },
    {
      name: t('sidebar.cloud_sentry') || "Cloud Sentry",
      url: "/herramientas/cloud-sentry",
      icon: "☁️",
      desc: t('tools.cloud_sentry.desc'),
      pro: true
    },
    {
      name: t('sidebar.bin_analyst') || "Bin Analyst",
      url: "/herramientas/bin-analyst",
      icon: "🧩",
      desc: t('tools.bin_analyst.desc'),
      pro: true
    },
    {
      name: t('sidebar.osint_searcher') || "OSINT Searcher",
      url: "/herramientas/osint-searcher",
      icon: "👤",
      desc: t('tools.osint_searcher.desc'),
      pro: true
    },
    {
      name: t('sidebar.dark_web_monitor') || "Dark Web Monitor",
      url: "/herramientas/dark-web-monitor",
      icon: "🔦",
      desc: t('tools.dark_web_monitor.desc'),
      pro: true
    },
    {
      name: t('sidebar.geo_tracker') || "Geo Tracker",
      url: "/herramientas/geo-tracker",
      icon: "📍",
      desc: t('tools.geo_tracker.desc'),
      pro: true
    },
    {
      name: t('sidebar.recovery_protocol') || "Recovery Protocol",
      url: "/herramientas/recovery-protocol",
      icon: "🆘",
      desc: t('tools.recovery_protocol.desc'),
      pro: true
    },
    {
      name: t('sidebar.account_resurrect') || "Account Resurrector",
      url: "/herramientas/account-resurrect",
      icon: "🧟",
      desc: t('tools.account_resurrect.desc'),
      pro: true
    },
    {
      name: t('sidebar.attacker_intercept') || "Attacker Intercept",
      url: "/herramientas/attacker-intercept",
      icon: "🤺",
      desc: t('tools.attacker_intercept.desc'),
      pro: true
    },
    {
      name: t('sidebar.session_sanitizer') || "Session Sanitizer",
      url: "/herramientas/session-sanitizer",
      icon: "🧼",
      desc: t('tools.session_sanitizer.desc'),
      pro: true
    },
    {
      name: t('sidebar.forensic_report') || "Forensic Report",
      url: "/herramientas/forensic-report",
      icon: "📋",
      desc: t('tools.forensic_report.desc'),
      pro: true
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-mono flex relative overflow-hidden">
      <div className="lightning-bg"></div>
      <Sidebar />
      <main className="flex-1 p-8 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 border-b border-[#00ff88]/20 pb-8 flex justify-between items-end">
            <div>
              <h1
                className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700"
                dangerouslySetInnerHTML={{ __html: t('herramientas.title') }}
              />
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                {t('herramientas.active_modules')} {"// v2.4.0"}
              </div>
            </div>
          </div>
          <p className="text-[#00ff88]/60 max-w-2xl leading-relaxed">
            {t('herramientas.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((t_tool) => (
            <Link
              key={t_tool.url}
              href={t_tool.url}
              className="glass-card-extreme cyber-border-extreme p-6 group transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{t_tool.icon}</span>
                {t_tool.pro && (
                  <span className="bg-[#00ff88] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                    {t('herramientas.encrypted_access')}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                  {t_tool.name.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 leading-snug">
                  {t_tool.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#00ff88]/10 flex items-center justify-between">
                <span className="text-[10px] text-[#00ff88]/40 font-bold tracking-widest">{t('herramientas.initiate_scan')}</span>
                <span className="text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/" className="inline-block mt-16 text-[#00ff88]/40 hover:text-[#00ff88] transition-colors text-sm font-bold tracking-widest uppercase">
          {t('herramientas.escape')}
        </Link>
      </main>
    </div>
  );
}
