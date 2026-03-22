"use client";

import { useTransition } from "./TransitionProvider";

const TOPICS = [
  { icon: "🏏", label: "Basic Objective" },
  { icon: "⏱️", label: "Formats of Cricket" },
  { icon: "📐", label: "DLS Method" },
  { icon: "🚫", label: "LBW Rule" },
  { icon: "🔴", label: "Ball Tampering" },
  { icon: "🌀", label: "Spin Bowling Types" },
];

export default function Topics() {
  const { navigateTo } = useTransition();

  return (
    <div id="topics" className="topics-bg" style={{ padding: "80px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="section-label">Knowledge Base</div>
        <h2 className="section-title">
          Every Rule. Every Tactic.
          <br />
          <span className="gradient-text-blue">Every Question — Answered.</span>
        </h2>
        <p className="section-sub">
          The cricket rulebook is 200+ pages long. We made it conversational.
          Click any topic to jump straight in.
        </p>

        <div className="topics-grid">
          {TOPICS.map((t, i) => (
            <button
              key={i}
              id={`topic-${i}`}
              className="topic-pill"
              onClick={() =>
                navigateTo(`/chat?q=${encodeURIComponent("Tell me about " + t.label)}`)
              }
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
