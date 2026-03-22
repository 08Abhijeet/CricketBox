"use client";

const FEATURES = [
  {
    icon: "🏏",
    title: "Rules Simplified",
    desc: "From LBW to Mankading — get crystal clear explanations without the confusing jargon. Finally understand the rules you've always wondered about.",
    tag: "Plain English",
  },
  {
    icon: "🎯",
    title: "Tactics Decoded",
    desc: "Understand why captains make the decisions they do. Field placements, bowling changes, powerplay strategies — all explained.",
    tag: "Cricket Strategy",
  },
  {
    icon: "📊",
    title: "Formats Explained",
    desc: "Test, ODI, T20, The Hundred — know the difference and what makes each format uniquely beautiful.",
    tag: "All Formats",
  },
  {
    icon: "⚡",
    title: "Answers",
    desc: "No searching through rulebooks or watching 30-minute videos. Just ask and get your answer in seconds.",
    tag: "~500ms Response",
  },
  {
    icon: "📚",
    title: "40+ Cricket Topics",
    desc: "From the basic objective of the game to complex scenarios like Duckworth-Lewis — our knowledge base covers it all.",
    tag: "40 Documents",
  },
  {
    icon: "🔍",
    title: "Source Citations",
    desc: "Every answer shows exactly which topics were retrieved, so you know the answer is grounded — not guessed.",
    tag: "Transparent",
  },
];

import { useState } from "react";

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<typeof FEATURES[number] | null>(null);

  return (
    <div id="features" style={{ background: "#0a0a0a", padding: "80px 48px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#f97316",
          marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "inline-block", width: 24, height: 2, background: "#f97316", borderRadius: 2 }} />
          What We Cover
        </div>

        <h2 style={{
          fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800,
          letterSpacing: "-0.03em", lineHeight: 1.15,
          color: "#f97316", marginBottom: 16,
        }}>
          Built for Fans.<br />
          <span style={{ color: "#fb923c" }}>Powered by Cricket Knowledge.</span>
        </h2>

        <p style={{ fontSize: 16, color: "#fdba74", lineHeight: 1.7, maxWidth: 560, marginBottom: 0 }}>
          Whether you are watching your first match or your thousandth,
          there is always something new to learn.
        </p>

        {/* 3 × 2 Grid */}
        <div className="features-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 48,
        }}>
          {FEATURES.map((f, i) => (
            <div 
              key={i} 
              className="feature-card" 
              onClick={() => setActiveFeature(f)}
              style={{
                background: "#111111",
                border: "1px solid rgba(249,115,22,0.18)",
                borderRadius: 24,
                padding: "32px 28px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Orange glow at bottom of each card */}
              <div style={{
                position: "absolute",
                bottom: 0, left: "50%",
                transform: "translateX(-50%)",
                width: "80%", height: "40%",
                background: "radial-gradient(ellipse at bottom, rgba(249,115,22,0.18) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />

              {/* Icon box */}
              <div className="feature-icon-box" style={{
                width: 52, height: 52,
                background: "rgba(249,115,22,0.10)",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
                marginBottom: 20,
              }}>{f.icon}</div>

              {/* Title */}
              <div className="feature-title" style={{ fontSize: 18, fontWeight: 700, color: "#f97316", marginBottom: 10, lineHeight: 1.3 }}>
                {f.title}
              </div>

              {/* Description */}
              <div className="feature-desc" style={{ fontSize: 14, lineHeight: 1.75, color: "#fdba74", marginBottom: 20 }}>
                {f.desc}
              </div>

              {/* Tag */}
              <div className="feature-tag" style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 12px", borderRadius: 999,
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
                fontSize: 11, fontWeight: 600,
                color: "#fb923c", letterSpacing: "0.05em",
              }}>✦ {f.tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile Popup Modal ── */}
      {activeFeature && (
        <div className="feature-mobile-modal" onClick={() => setActiveFeature(null)}>
          <div className="feature-mobile-content" onClick={(e) => e.stopPropagation()}>
            <button className="feature-mobile-close" onClick={() => setActiveFeature(null)}>×</button>
            <div className="feature-icon-box" style={{
              width: 52, height: 52, margin: "0 auto 20px",
              background: "rgba(249,115,22,0.10)", border: "1px solid rgba(249,115,22,0.25)",
              borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>{activeFeature.icon}</div>
            
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f97316", marginBottom: 16, textAlign: "center" }}>
              {activeFeature.title}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#fdba74", marginBottom: 24, textAlign: "center" }}>
              {activeFeature.desc}
            </p>
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 16px", borderRadius: 999,
                background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)",
                fontSize: 12, fontWeight: 600, color: "#fb923c",
              }}>✦ {activeFeature.tag}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
