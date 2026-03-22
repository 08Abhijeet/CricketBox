"use client";

import { useTransition } from "./TransitionProvider";

export default function CTA() {
  const { navigateTo } = useTransition();

  return (
    <div
      style={{
        padding: "80px 48px",
        textAlign: "center",
        background: "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,67,179,0.06), transparent)",
      }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🏏</div>
        <h2 className="section-title" style={{ marginBottom: 16 }}>
          Ready to Know Cricket<br />
          <span className="gradient-text-blue">Like Never Before?</span>
        </h2>
        <p style={{ color: "#f97316", fontSize: 16, marginBottom: 8 }}>
          Start asking. No sign up needed.
        </p>
        <p style={{ color: "#fdba74", fontSize: 15, marginBottom: 32 }}>
          Your first question is one click away.
        </p>
        <button
          className="btn-hero-primary"
          style={{ margin: "0 auto" }}
          onClick={() => navigateTo("/chat")}
        >
          Ask Your First Question 🏏
        </button>
      </div>
    </div>
  );
}
