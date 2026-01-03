import "./globals.css";

export const metadata = {
  title: "ByteGuard - Professional Cybersecurity Tools Suite",
  description: "Advanced cybersecurity tools for professionals and students. Features: AI Threat Detector, Port Scanner, Steganography, and Phishing Analysis.",
  keywords: ["cybersecurity", "hacking tools", "port scanner", "steganography", "phishing detector", "byteguard", "security analysis"],
  metadataBase: new URL('https://byteguard.netlify.app'),
  openGraph: {
    title: "ByteGuard - Professional Cybersecurity Tools",
    description: "Access professional-grade security tools directly in your browser. Encrypt, analyze, and protect.",
    type: "website",
    url: "https://byteguard.netlify.app",
    siteName: "ByteGuard",
    images: [
      {
        url: "/bg.png",
        width: 1200,
        height: 630,
        alt: "ByteGuard Cybersecurity Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ByteGuard - Professional Cybersecurity tools",
    description: "Advanced cybersecurity tools for professionals and students.",
    images: ["/bg.png"],
  },
};

import AIAssistant from "./components/AIAssistant";
import { AuthProvider } from "./context/AuthContext";
import { DefenseProvider } from "./context/DefenseContext";

import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ff88" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/pwabuilder-sw.js')
                    .then(reg => console.log('Service Worker registered'))
                    .catch(err => console.log('Service Worker registration failed:', err));
                });
              }

              // Prevent PWA auto-installation prompt
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                console.log('PWA installation prompt prevented.');
              });
            `,
          }}
        />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, Arial, sans-serif" }} suppressHydrationWarning>
        <div className="lightning-bg"></div>
        <AuthProvider>
          <DefenseProvider>
            <header style={{
              background: "#050505",
              borderBottom: "1px solid rgba(0,255,136,0.06)",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              color: "#BFBFBF",
              position: "relative",
              zIndex: 100
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "700", color: "#00ff88" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

            <main className="relative z-10">
              {/* Trap Link for Bots - Invisible to humans */}
              <a href="/wp-admin" style={{ display: 'none' }} aria-hidden="true">Admin Login</a>
              {children}
            </main>
            <AIAssistant />
          </DefenseProvider>
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
