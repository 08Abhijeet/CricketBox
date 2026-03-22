"use client";

import { useTransition } from "./TransitionProvider";

export default function Footer() {
  const { navigateTo } = useTransition();

  return (
    <footer>
      <div className="footer-main">
        <div>
          <div className="nav-logo" style={{ marginBottom: 0 }}>
            <div className="logo-ball" style={{ width: 32, height: 32 }} />
            <span className="logo-name" style={{ fontSize: 18 }}>
              Cricket<span>IQ</span>
            </span>
          </div>
          <p className="footer-brand-desc">
            Built for fans. Powered by cricket knowledge.
            Not just another chatbot — built specifically on cricket rules,
            tactics, formats, and the laws of the gentleman game.
          </p>
          <div className="footer-socials">
            {["🐦", "💼", "🐙"].map((icon, i) => (
              <div key={i} className="footer-social-btn">{icon}</div>
            ))}
          </div>
        </div>

        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How it Works</a></li>
            <li><a href="#topics">Topics</a></li>
            <li><button onClick={() => navigateTo("/chat")} style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Chat Now</button></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Tech Stack</div>
          <ul className="footer-links">
            <li><a href="https://nextjs.org" target="_blank">Next.js</a></li>
            <li><a href="https://vercel.com" target="_blank">Vercel</a></li>
            <li><a href="https://react.dev" target="_blank">React</a></li>
            <li><a href="https://www.typescriptlang.org" target="_blank">TypeScript</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Cricket</div>
          <ul className="footer-links">
            <li><button onClick={() => navigateTo("/chat?q=What+is+DLS+method")} style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>DLS Method</button></li>
            <li><button onClick={() => navigateTo("/chat?q=Explain+LBW+rule")} style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>LBW Rule</button></li>
            <li><button onClick={() => navigateTo("/chat?q=Types+of+spin+bowling")} style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Spin Bowling</button></li>
            <li><button onClick={() => navigateTo("/chat?q=What+is+Mankading")} style={{ background: 'transparent', border: 'none', padding: 0, font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}>Mankading</button></li>
          </ul>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="footer-copy">
          © 2026 CricketIQ — Built with 🏏 and True RAG
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {["Next.js", "React", "TypeScript", "AI"].map((t) => (
            <span key={t} className="footer-stack-badge">{t}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
