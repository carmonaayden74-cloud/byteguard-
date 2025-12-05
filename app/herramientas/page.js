import Link from "next/link";

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
      name: "Password Auditor",
      url: "/herramientas/bruteforce-sim",
      icon: "⚡",
      desc: "Calculate entropy and estimated crack time.",
      pro: true
    },
    {
      name: "Metadata Extractor",
      url: "/herramientas/metadata",
      icon: "📸",
      desc: "Extract hidden GPS & Exif data from images.",
      pro: true
    },
    {
      name: "Steganography",
      url: "/herramientas/steganography",
      icon: "🖼️",
      desc: "Hide secret messages inside images.",
      pro: true
    },
    {
      name: "Link Forensics",
      url: "/herramientas/phishing",
      icon: "🔎",
      desc: "Analyze URLs for phishing indicators.",
      pro: true
    },
    {
      name: "Payload Vault",
      url: "/herramientas/sqli",
      icon: "💉",
      desc: "Database of SQL injection payloads.",
      pro: true
    },
    {
      name: "Keylogger Detector",
      url: "/herramientas/keylogger",
      icon: "⌨️",
      desc: "Analyze browser input capture events.",
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
  ];

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#00ff88", marginBottom: "10px" }}>Cybersecurity Tools</h1>
        <p style={{ color: "#888" }}>Professional grade tools for analysis and education.</p>

        <div style={styles.grid}>
          {tools.map((t) => (
            <Link key={t.url} href={t.url} style={styles.card} className="hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.1)]">
              <div style={styles.cardHeader}>
                <span style={styles.icon}>{t.icon}</span>
                <div>
                  <h3 style={styles.title}>{t.name}</h3>
                </div>
                {t.pro && <span style={styles.badge}>PRO</span>}
              </div>
              <p style={styles.description}>{t.desc}</p>
            </Link>
          ))}
        </div>

        <Link href="/" style={{ display: "inline-block", marginTop: "40px", color: "#666", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
