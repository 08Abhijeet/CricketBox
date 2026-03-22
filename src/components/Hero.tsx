"use client";

import { useTransition } from "./TransitionProvider";

export default function Hero() {
  const { navigateTo } = useTransition();

  return (
    <section className="hero-section">
      <div className="pitch-bg" />

      <div className="hero-inner">
        {/* Left: Content */}
        <div className="hero-content">

          <h1 className="hero-title anim-fade-up">
            The Game You Love.
            <br />
            <span className="gradient-text-blue">The Answers</span>{" "}
            <span className="gradient-text-saffron">You Need.</span>
          </h1>

          <p className="hero-subtitle anim-fade-up-2">
            Whether you're a die-hard fan or just starting out —
            get instant answers to every cricket question youve ever had.
            Rules, tactics, dismissals, formats and more.
          </p>

          <div className="hero-btns anim-fade-up-3">
            <button
              id="hero-get-started"
              className="btn-hero-primary text-#f97316"
              onClick={() => navigateTo("/chat")}
            >
              🏏 Ask Your First Question
            </button>
            <a href="#how-it-works" className="btn-hero-secondary">
              How it Works
            </a>
          </div>

          <div className="hero-stats anim-fade-up-4">
            <div className="hero-stat">
              <div className="hero-stat-value">40+</div>
              <div className="hero-stat-label">Cricket Topics</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">10</div>
              <div className="hero-stat-label">Types of Dismissals</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">3</div>
              <div className="hero-stat-label">Formats Covered</div>
            </div>
          </div>
        </div>

        {/* Right: Animated cricket ball */}
        <div className="ball-arena anim-fade-up-2">
          <div className="orbit-ring orbit-ring-1">
            <div className="orbit-dot orbit-dot-1" />
          </div>
          <div className="orbit-ring orbit-ring-2">
            <div className="orbit-dot orbit-dot-2" />
          </div>
          <div className="orbit-ring orbit-ring-3" />

          <div className="hero-ball">
            <div className="seam-h" />
          </div>

          {/* Floating emoji particles */}
          {["🏏", "🎯", "🏆", "⚡", "🌀"].map((e, i) => (
            <div
              key={i}
              className="particle"
              style={{
                fontSize: `${14 + (i % 3) * 4}px`,
                left: `${15 + i * 15}%`,
                bottom: `${10 + (i % 3) * 10}%`,
                animationDuration: `${4 + i * 1.2}s`,
                animationDelay: `${i * 0.8}s`,
                background: "transparent",
                width: "auto", height: "auto",
                borderRadius: 0,
              }}
            >
              {e}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
