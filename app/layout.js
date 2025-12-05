import "./globals.css";

export const metadata = {
  title: "ByteGuard - Professional Cybersecurity Tools Suite",
  description: "Advanced cybersecurity tools for professionals and students. Features: Port Scanner, Password Auditor, DNS Lookup, Phishing Detector, and more.",
  keywords: ["cybersecurity", "hacking tools", "port scanner", "password auditor", "dns lookup", "byteguard", "security analysis"],
  openGraph: {
    title: "ByteGuard - Professional Cybersecurity Tools",
    description: "Access professional-grade security tools directly in your browser.",
    type: "website",
  },
};

import AIAssistant from "./components/AIAssistant";
import { AuthProvider } from "./context/AuthContext";

import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif" }} suppressHydrationWarning>
        <AuthProvider>
          <header style={{
            background: "#050505",
            borderBottom: "1px solid rgba(0,255,136,0.06)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: 20,
            color: "#BFBFBF"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "700", color: "#00ff88" }}>
              <img src="/logo.png" alt="ByteGuard Logo" style={{ height: "32px", width: "auto" }} />
              BYTEGUARD
            </div>

            <nav style={{ display: "flex", gap: 12, marginLeft: 12 }}>
              <Link href="/" style={linkStyle}>Inicio</Link>
              <Link href="/laboratorio" style={linkStyle}>Laboratorio</Link>
              <Link href="/herramientas" style={linkStyle}>Herramientas</Link>
              <Link href="/precios" style={linkStyle}>Precios</Link>
              <Link href="/contacto" style={linkStyle}>Contacto</Link>
            </nav>
          </header>

          <main>{children}</main>
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}

const linkStyle = {
  color: "#BFBFBF",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid transparent"
};
