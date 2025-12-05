# 🛡️ ByteGuard - Cybersecurity Laboratory

ByteGuard is an interactive, educational cybersecurity platform designed to demonstrate how digital threats work and how to protect against them. It features a professional "Command & Control" dashboard and a suite of simulated hacking tools.

## 🚀 Features

### 🖥️ Command & Control Dashboard
A Hollywood-style hacker interface with:
- **Global Threat Map**: Visualizing simulated cyber attacks in real-time.
- **System Logs**: Live terminal feed of system events.
- **Stats Panel**: Monitoring simulated network traffic and resources.

### 🛠️ The Tools

1.  **🖼️ Steganography Lab**
    - **What it does**: Hides secret text messages inside image files using LSB (Least Significant Bit) encoding.
    - **Why it matters**: Demonstrates how data can be exfiltrated or hidden in plain sight.

2.  **🎣 Phishing Simulator**
    - **What it does**: Analyzes URLs and email text for suspicious patterns, typosquatting, and urgency triggers.
    - **Why it matters**: Helps users identify common social engineering tactics.

3.  **💉 SQL Injection Playground**
    - **What it does**: Simulates a vulnerable login form where you can use SQL injection techniques (like `' OR '1'='1`) to bypass authentication.
    - **Why it matters**: Teaches the importance of input sanitization and secure coding.

4.  **⌨️ Keylogger Detector**
    - **What it does**: Captures your keystrokes in real-time and displays them in an "Attacker's Log".
    - **Why it matters**: Visualizes how malware can steal passwords and sensitive data without you knowing.

5.  **🔐 Encryption & Passwords**
    - **What it does**: Generates cryptographically secure passwords and hashes.

## 💻 Tech Stack
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS + Custom CSS for "Neon Hacker" aesthetics
- **Logic**: Pure Client-Side JavaScript (No backend database required for simulations)

## 🏁 Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to enter the lab.
