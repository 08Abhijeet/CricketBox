"use client";

import { useTransition } from "./TransitionProvider";

const STEPS = [
  { num: "1", title: "Just Ask", desc: "Type your question in plain English. No complicated searches. No rulebook diving." },
  { num: "2", title: "We Search", desc: "Your question is matched against 40+ cricket topics using vector search." },
  { num: "3", title: "Context Found", desc: "The most relevant passages from our knowledge base are retrieved and prepared." },
  { num: "4", title: "You Know", desc: "A clear, grounded answer is generated — sourced directly from our cricket knowledge base." },
];

const SAMPLE_QUESTIONS = [
  "What happens if it rains during an ODI?",
  "Why was that not out LBW?",
  "What is reverse swing and how is it bowled?",
  "Can a batsman be out on a no ball?",
];

export default function HowItWorks() {
  const { navigateTo } = useTransition();

  return (
    <div id="how-it-works" style={{ padding: "80px 0" }}>
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="section-label">How It Works</div>
        <h2 className="section-title">
          Just Ask.
        </h2>
        <p className="section-sub">
          No complicated searches. No rulebook diving. Cricket — the way
          it was meant to be understood.
        </p>

        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-number">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Sample questions */}
        <div className="sample-questions">
          <div className="sample-questions-label">People ask things like —</div>
          <div className="sample-questions-list">
            {SAMPLE_QUESTIONS.map((q, i) => (
              <div key={i} className="sample-question-bubble" onClick={() => navigateTo(`/chat?q=${encodeURIComponent(q)}`)}>
                &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
          <p className="sample-questions-footer">Ask anything. We&apos;ll handle the rest.</p>
        </div>
      </div>
    </div>
  );
}
