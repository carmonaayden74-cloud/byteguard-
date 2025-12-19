import Link from "next/link";
import { Sidebar } from "../components/DashboardComponents";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#050505",
    color: "#e0e0e0",
    fontFamily: "'Inter', sans-serif",
    padding: "40px 20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "40px",
  },
  card: {
    background: "#0a0a0a",
    border: "1px solid rgba(0, 255, 136, 0.2)",
    borderRadius: "12px",
    padding: "25px",
    textDecoration: "none",
    color: "#fff",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
  },
  icon: {
    fontSize: "2rem",
    marginRight: "15px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#00ff88",
    margin: 0,
  },
  description: {
    fontSize: "0.9rem",
    color: "#888",
    lineHeight: "1.5",
  },
  badge: {
    background: "#00ff88",
    color: "#000",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    marginLeft: "auto",
  }
};

export default function Herramientas() {
  const tools = [
    {
      name: "AI Threat Detector",
      url: "/herramientas/ai-threat-detector",
      icon: "🤖",
      desc: "Detect AI-generated malicious code and suspicious patterns.",
      pro: true
    },
    {
      name: "Code Analyzer",
      url: "/herramientas/code-analyzer",
      icon: "🔍",
      desc: "Deep code analysis for vulnerabilities and exploits.",
      pro: true
    },
    {
      name: "Site Security Auditor",
      url: "/herramientas/site-auditor",
      icon: "🛡️",
      desc: "Analyze security headers, SSL, and vulnerabilities.",
      pro: true
    },
    {
      name: "Port Scanner",
      url: "/herramientas/port-scanner",
      icon: "🎯",
      desc: "Scan for open ports on remote servers.",
      pro: true
    },
    {
      name: "DNS Lookup",
      url: "/herramientas/dns-lookup",
      icon: "🌐",
      desc: "Retrieve detailed DNS records (A, MX, TXT).",
      pro: true
    },
    {
      name: "IP Intelligence",
      url: "/herramientas/ip-intel",
      icon: "📡",
      desc: "Geolocation and ISP data for any IP address.",
      pro: true
    },
    {
      name: "Entropy Auditor",
      url: "/herramientas/bruteforce-sim",
      icon: "⚡",
      desc: "Calculate cryptographic entropy and estimated brute-force resistance.",
      pro: true
    },
    {
      name: "Password Generator",
      url: "/herramientas/generador-passwords",
      icon: "🔑",
      desc: "Generate cryptographically secure passwords with custom entropy rules.",
      pro: true
    },
    {
      name: "Metadata Extractor",
      url: "/herramientas/metadata",
      icon: "📸",
      desc: "Extract hidden GPS, device, and EXIF metadata from digital media.",
      pro: true
    },
    {
      name: "Steganography",
      url: "/herramientas/steganography",
      icon: "🖼️",
      desc: "Conceal encrypted data within visual carriers using LSB techniques.",
      pro: true
    },
    {
      name: "Link Forensics",
      url: "/herramientas/phishing",
      icon: "🔎",
      desc: "Deep analysis of URIs for deceptive patterns and phishing clusters.",
      pro: true
    },
    {
      name: "SQLi Tester & Fuzzer",
      url: "/herramientas/sqli",
      icon: "💉",
      desc: "Advanced automated scanner for SQL injection vulnerabilities and fuzzing.",
      pro: true
    },
    {
      name: "Browser Auditor",
      url: "/herramientas/browser-auditor",
      icon: "🕵️",
      desc: "Analyze browser fingerprinting and privacy leaks.",
      pro: true
    },
    {
      name: "Terminal",
      url: "/herramientas/terminal",
      icon: "💻",
      desc: "Network connectivity tools (Ping, HTTP).",
      pro: true
    },
    {
      name: "Encryptor",
      url: "/herramientas/encriptador",
      icon: "🔒",
      desc: "Secure text with AES-256 encryption.",
      pro: true
    },
    {
      name: "Headers Analyzer",
      url: "/herramientas/headers",
      icon: "📋",
      desc: "Inspect HTTP headers and security policies.",
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
              <h1 className="text-6xl font-black text-white tracking-tighter mb-4 animate-in slide-in-from-left duration-700">
                CYBERSECURITY_<span className="text-[#00ff88]">TOOLS</span>
              </h1>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-xs uppercase tracking-[0.4em]">
                <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-ping"></span>
                ACTIVE_MODULE_DATABASE // v2.4.0
              </div>
            </div>
          </div>
          <p className="text-[#00ff88]/60 max-w-2xl leading-relaxed">
            Access the professional-grade security suite. Each module is optimized for deep analysis and defensive verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((t) => (
            <Link
              key={t.url}
              href={t.url}
              className="glass-card-extreme cyber-border-extreme p-6 group transition-all duration-300 hover:scale-[1.02] flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl group-hover:scale-110 transition-transform">{t.icon}</span>
                {t.pro && (
                  <span className="bg-[#00ff88] text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                    ENCRYPTED_ACCESS
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00ff88] transition-colors">
                  {t.name.toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500 leading-snug">
                  {t.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#00ff88]/10 flex items-center justify-between">
                <span className="text-[10px] text-[#00ff88]/40 font-bold tracking-widest">INITIATE_SCAN</span>
                <span className="text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/" className="inline-block mt-16 text-[#00ff88]/40 hover:text-[#00ff88] transition-colors text-sm font-bold tracking-widest uppercase">
          [ ESCAPE_TO_ROOT ]
        </Link>
      </main>
    </div>
  );
}
