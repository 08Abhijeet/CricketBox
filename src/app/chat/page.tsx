"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ── Types ───────────────────────────────────────────────── */
interface RelevanceScore { title: string; score: number; }
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  relevanceScores?: RelevanceScore[];
  chunksUsed?: number;
  error?: boolean;
}
interface PipeStep { id: string; label: string; status: "pending" | "active" | "done"; }

/* ── Constants ───────────────────────────────────────────── */
const PREDEFINED = [
  { icon: "📋", title: "LBW Rule",         prompt: "Explain the LBW rule in detail" },
  { icon: "🌧️", title: "DLS Method",       prompt: "How does the DLS method work?" },
  { icon: "🔄", title: "Super Over",        prompt: "What are the Super Over rules in T20?" },
  { icon: "🤢", title: "Mankading",         prompt: "What is Mankading and is it legal?" },

];

const PIPE_STEPS: PipeStep[] = [
  { id: "embed",    label: "Consulting the third umpire...",          status: "pending" },
  { id: "search",   label: "Reviewing the DRS...",                    status: "pending" },
  { id: "retrieve", label: "Replaying the footage...",                status: "pending" },
  { id: "generate", label: "Checking the rulebook...",                status: "pending" },
];

/* ── Inner component (uses useSearchParams) ──────────────── */
function ChatInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [pipeSteps,     setPipeSteps]     = useState<PipeStep[]>(PIPE_STEPS);
  const [showPipe,      setShowPipe]      = useState(false);
  const [totalQueries,  setTotalQueries]  = useState(0);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 140) + "px";
    }
  }, [input]);

  // If ?q= param exists, auto-send that question
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) handleSend(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Animate pipeline steps ── */
  const animatePipeline = useCallback(async () => {
    const steps = PIPE_STEPS.map((s) => ({ ...s }));
    for (let i = 0; i < steps.length; i++) {
      steps[i].status = "active";
      setPipeSteps([...steps]);
      await new Promise((r) => setTimeout(r, 650 + Math.random() * 450));
      steps[i].status = "done";
      setPipeSteps([...steps]);
    }
  }, []);

  /* ── Send message ── */
  const handleSend = useCallback(
    async (questionOverride?: string) => {
      const question = (questionOverride ?? input).trim();
      if (!question || loading) return;

      setInput("");
      setLoading(true);
      setShowPipe(true);
      setPipeSteps(PIPE_STEPS.map((s) => ({ ...s, status: "pending" })));
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: question },
      ]);

      const pipePromise = animatePipeline();

      try {
        const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
        const res  = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, conversationHistory: history }),
        });
        const data = await res.json();
        await pipePromise;

        if (!res.ok) throw new Error(data.error || "Request failed");

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            relevanceScores: data.relevanceScores,
            chunksUsed: data.chunksUsed,
          },
        ]);
        setTotalQueries((n) => n + 1);
      } catch (err) {
        await pipePromise;
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: err instanceof Error
              ? `Error: ${err.message}`
              : "Something went wrong. Check your .env.local API keys.",
            error: true,
          },
        ]);
      } finally {
        setLoading(false);
        setShowPipe(false);
      }
    },
    [input, loading, messages, animatePipeline]
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-page">

      {/* ── Chat Navbar ────────────────────────────────── */}
      <header className="chat-header">
        <button className="chat-back-btn" onClick={() => router.back()}>
          ← <span className="hidden sm:inline">Back to Home</span>
          <span className="inline sm:hidden">Back</span>
        </button>

        <div className="nav-logo">
          <div className="logo-ball" style={{ width: 30, height: 30 }} />
          <span className="logo-name" style={{ fontSize: 17 }}>Cricket<span>IQ</span></span>
        </div>

        <div className="chat-model-badge">
          <span className="pulse-green" />
          AI-Powered · Live
          {totalQueries > 0 && (
            <span style={{ marginLeft: 6, color: "var(--saffron)", fontWeight: 700 }}>
              · {totalQueries} queries
            </span>
          )}
        </div>
      </header>

      {/* ── Chat Body ──────────────────────────────────── */}
      <div className="chat-body" style={{ overflowY: hasMessages || loading ? "auto" : "hidden" }}>

        {!hasMessages ? (
          /* Welcome / predefined questions */
          <div className="chat-welcome">
            <div className="chat-welcome-icon">🏏</div>
            <h1 className="chat-welcome-title">
              No question is a bad question.
            </h1>
            <p className="chat-welcome-sub">
              Even Sachin had to learn the rules once. Ask me anything about
              cricket — rules, tactics, dismissals, formats, and more.
            </p>

            <div className="predefined-label">Try these questions ↓</div>
            <div className="predefined-grid">
              {PREDEFINED.map((p, i) => (
                <button
                  key={i}
                  id={`predefined-${i}`}
                  className="predefined-card"
                  onClick={() => handleSend(p.prompt)}
                >
                  <span className="predefined-card-icon">{p.icon}</span>
                  <div className="predefined-card-text">
                    <strong>{p.title}</strong>
                    {p.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="messages-list">
            {messages.map((msg) => (
              <div key={msg.id} className="msg-wrap">
                {msg.role === "user" ? (
                  <div className="msg-user">
                    <div className="msg-user-bubble">{msg.content}</div>
                  </div>
                ) : (
                  <div className="msg-ai">
                    <div className="ai-avatar">🏏</div>
                    <div className="ai-content">
                      <div className={`ai-text${msg.error ? " ai-error" : ""}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="msg-wrap">
                <div className="msg-ai">
                  <div className="ai-avatar">🏏</div>
                  <div className="ai-content">
                    <div className="typing-wrap">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input Area ─────────────────────────────────── */}
      <div className="chat-footer-wrap">
        <div className="chat-input-wrap">
          <div className="chat-input-row">
            <div className="chat-input-box">
              <textarea
                ref={textareaRef}
                id="chat-input"
                className="chat-textarea"
                placeholder="Bowl me !!"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                rows={1}
              />
            </div>
            <button
              id="send-btn"
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          <div className="chat-input-meta">
            <span className="chat-hint">Enter to send · Shift+Enter for new line</span>
            <div className="groq-badge">
              <span className="pulse-green" />
              AI Assistant
            </div>
          </div>
        </div>
      </div>

      {/* ── Page Footer ────────────────────────────────── */}
      <div className="chat-footer-strip">
        <span>🏏</span>
        <span>CricketIQ · Know the Game. </span>
        <strong>From Yorkers to DLS</strong>
        <span>·</span>
        <strong>We've Got You Covered</strong>
        <span>·</span>
        <span>© 2026</span>
      </div>
    </div>
  );
}

/* ── Page export with Suspense boundary (required for useSearchParams) ── */
export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "var(--navy-900)",
        color: "var(--text-secondary)", fontSize: 14
      }}>
        Loading CricketIQ...
      </div>
    }>
      <ChatInner />
    </Suspense>
  );
}
