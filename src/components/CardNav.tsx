"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import { Radius } from "lucide-react";

type CardNavLink = { label: string; href: string; ariaLabel: string };
export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};
export interface CardNavProps {
  logoNode: React.ReactNode;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  onCtaClick?: () => void;
}

const CardNav: React.FC<CardNavProps> = ({
  logoNode,
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#0a0a0a",
  menuColor = "#f97316",
  buttonBgColor = "#f97316",
  buttonTextColor = "#0a0a0a",
  onCtaClick,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [isScrolled, setIsScrolled]   = useState(false);

  const wrapRef      = useRef<HTMLDivElement | null>(null);
  const navRef       = useRef<HTMLDivElement | null>(null);
  const topBarRef    = useRef<HTMLDivElement | null>(null);
  const cardsRef     = useRef<HTMLDivElement[]>([]);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);
  const shrinkTlRef  = useRef<gsap.core.Timeline | null>(null);
  const forcedOpenRef = useRef(false); // true = user manually expanded while scrolled

  /* ── scroll detection ─────────────────────────────────── */
  const prevScrolledRef = useRef(false);
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 60;
      // Skip if value hasn't changed — prevents killing the GSAP animation on every pixel
      if (scrolled === prevScrolledRef.current) return;
      prevScrolledRef.current = scrolled;
      // When back at top, clear the forced-open flag
      if (!scrolled) forcedOpenRef.current = false;
      // Don't auto-shrink if user manually expanded from ball click
      if (forcedOpenRef.current) return;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── shrink / unshrink on scroll ─────────────────────── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const nav  = navRef.current;
    const top  = topBarRef.current;
    if (!wrap || !nav || !top) return;

    shrinkTlRef.current?.kill();

    if (isScrolled) {
      // Close the expanded menu if open
      if (isExpanded) {
        setIsHamburgerOpen(false);
        setIsExpanded(false);
        tlRef.current?.reverse();
      }

      const tl = gsap.timeline();
      tl.to(wrap, {
        width: 52, borderRadius: 26,
        duration: 0.85, ease: "power2.inOut",
      })
        .to(nav, {
          height: 52, borderRadius: 26,
          duration: 0.85, ease: "power2.inOut",
        }, "<")
        .to(top, { opacity: 0, duration: 0.4, ease: "power2.out" }, "<");

      shrinkTlRef.current = tl;
    } else {
      const tl = gsap.timeline();
      tl.to(top, { opacity: 1, duration: 0.35, ease: "power2.in" })
        .to(wrap, {
          width: "min(92vw, 420px)",
          borderRadius: 20,
          duration: 0.45, ease: "power2.inOut",
        }, "-=0.1")
        .to(nav, {
          height: 60, borderRadius: 20,
          duration: 0.85, ease: "power2.inOut",
        }, "<");

      shrinkTlRef.current = tl;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScrolled]);

  /* ── expand timeline (hamburger) ─────────────────────── */
  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 240;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement;
      if (contentEl) {
        const prev = {
          visibility: contentEl.style.visibility,
          pointerEvents: contentEl.style.pointerEvents,
          position: contentEl.style.position,
          height: contentEl.style.height,
        };
        Object.assign(contentEl.style, { visibility: "visible", pointerEvents: "auto", position: "static", height: "auto" });
        void contentEl.offsetHeight;
        const h = 60 + contentEl.scrollHeight + 16;
        Object.assign(contentEl.style, prev);
        return h;
      }
    }
    return 240;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;
    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 40, opacity: 0 });
    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.45, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.35, ease, stagger: 0.08 }, "-=0.1");
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => { tl?.kill(); tlRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;
      tlRef.current.kill();
      const newTl = createTimeline();
      if (newTl) {
        if (isExpanded) newTl.progress(1);
        tlRef.current = newTl;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    if (isScrolled) return;
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      ref={wrapRef}
      className={`card-nav-outer ${className}`}
      style={{
        position: "fixed",
        top: "1.2rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(92vw, 420px)",
        maxWidth: 420,
        zIndex: 100,
        cursor: isScrolled ? "pointer" : "default",
      }}
    >
      {/* ── Spinning cricket ball — only visible when scrolled ── */}
      {isScrolled && (
        <div
          onClick={() => {
            forcedOpenRef.current = true;
            setIsScrolled(false);
          }}
          title="Expand navbar"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #E53E3E, #7B1A1A)",
              boxShadow: "0 0 16px rgba(229,62,62,0.5), inset 0 -4px 8px rgba(0,0,0,0.3)",
              animation: "ball-spin 1s linear infinite",
            }}
          />
        </div>
      )}

      <nav
        ref={navRef}
        style={{
          backgroundColor: baseColor,
          display: "block",
          height: 100,
          padding:0,
          borderRadius: "45px",
          boxShadow: "0 4px 24px rgba(249,115,22,0.14)",
          border: "1px solid rgba(249,115,22,0.22)",
          position: "relative",
          overflow: "hidden",
          willChange: "height, border-radius",
        }}
      >
        {/* ── Top bar ── */}
        <div
          ref={topBarRef}
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px 0 18px",
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {logoNode}
          </div>

          {/* Right: CTA + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onCtaClick}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                border: "none",
                borderRadius: 8,
                padding: "7px 18px",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
            >
              Chat Now →
            </button>

            {/* Hamburger */}
            <div
              onClick={(e) => { e.stopPropagation(); toggleMenu(); }}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleMenu()}
              style={{ display: "flex", flexDirection: "column", gap: 5, cursor: "pointer", padding: "6px 4px" }}
            >
              <div style={{
                width: 22, height: 2, background: menuColor, borderRadius: 2,
                transformOrigin: "50% 50%",
                transition: "transform 0.3s ease",
                transform: isHamburgerOpen ? "translateY(3.5px) rotate(45deg)" : "none",
              }} />
              <div style={{
                width: 22, height: 2, background: menuColor, borderRadius: 2,
                transformOrigin: "50% 50%",
                transition: "transform 0.3s ease",
                transform: isHamburgerOpen ? "translateY(-3.5px) rotate(-45deg)" : "none",
              }} />
            </div>
          </div>
        </div>

        {/* ── Expanded cards ── */}
        <div
          className="card-nav-content"
          aria-hidden={!isExpanded}
          style={{
            position: "absolute",
            left: 0, right: 0, top: 60, bottom: 0,
            padding: 8,
            display: "flex",
            gap: 8,
            alignItems: "stretch",
            zIndex: 1,
            visibility: isExpanded ? "visible" : "hidden",
            pointerEvents: isExpanded ? "auto" : "none",
          }}
        >
          {items.slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              ref={setCardRef(idx)}
              style={{
                backgroundColor: item.bgColor,
                color: item.textColor,
                borderRadius: 12,
                padding: "12px 14px",
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.03em", color: item.textColor }}>
                {item.label}
              </div>
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      fontSize: 13, color: item.textColor, textDecoration: "none",
                      opacity: 0.8, transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.8")}
                  >
                    <GoArrowUpRight aria-hidden="true" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
