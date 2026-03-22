"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import CardNav from "@/components/CardNav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Topics from "@/components/Topics";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { TransitionProvider, useTransition } from "@/components/TransitionProvider";
import VideoLoader from "@/components/VideoLoader";

// Module-level variable survives SPA navigation but resets on hard reload
let hasPlayedMainLoader = false;

function LandingPageContent() {
  const [showLoader, setShowLoader] = useState(!hasPlayedMainLoader);
  const ballRef = useRef<HTMLDivElement>(null);
  const { navigateTo } = useTransition();

  useEffect(() => {
    // If it's showing the loader, we mark it as played
    // so returning to the home page via SPA nav doesn't re-trigger it
    if (showLoader) {
      hasPlayedMainLoader = true;
    }
  }, [showLoader]);

  const NAV_ITEMS = [
    {
      label: "Features",
      bgColor: "#1a0a00",
      textColor: "#f97316",
      links: [
        { label: "Rules Simplified", href: "#features", ariaLabel: "Rules" },
        { label: "Tactics Decoded", href: "#features", ariaLabel: "Tactics" },
        { label: "Answers", href: "#features", ariaLabel: "Answers" },
      ],
    },
    {
      label: "How it Works",
      bgColor: "#120a00",
      textColor: "#fb923c",
      links: [
        { label: "Just Ask", href: "#how-it-works", ariaLabel: "Ask" },
        { label: "We Search", href: "#how-it-works", ariaLabel: "Search" },
        { label: "You Know", href: "#how-it-works", ariaLabel: "Know" },
      ],
    },
    {
      label: "Topics",
      bgColor: "#0f0800",
      textColor: "#fdba74",
      links: [
        { label: "LBW Rule", href: "#topics", ariaLabel: "LBW" },
        { label: "DLS Method", href: "#topics", ariaLabel: "DLS" },
        { label: "Formats", href: "#topics", ariaLabel: "Formats" },
      ],
    },
  ];

  return (
    <>
      {/* ── Video Loader ─────────────────────────────────── */}
      {showLoader && (
        <VideoLoader onDone={() => setShowLoader(false)} />
      )}

      {/* ── CardNav ───────────────────────────────────────── */}
      <CardNav
        logoNode={
          <div className="nav-logo">
            <div className="logo-ball" ref={ballRef} />
            <span className="logo-name">Cricket<span>IQ</span></span>
          </div>
        }
        items={NAV_ITEMS}
        baseColor="#0a0a0a"
        menuColor="#f97316"
        buttonBgColor="#f97316"
        buttonTextColor="#0a0a0a"
        onCtaClick={() => navigateTo("/chat")}
      />

      {/* ── Page Sections ─────────────────────────────────── */}
      <Hero />
      <hr className="section-divider" />
      <Features />
      <hr className="section-divider" />
      <HowItWorks />
      <hr className="section-divider" />
      <Topics />
      <hr className="section-divider" />
      <CTA />

      {/* ── Footer ───────────────────────────────────────── */}
      <Footer />
    </>
  );
}

export default function LandingPage() {
  return (
    <TransitionProvider>
      <LandingPageContent />
    </TransitionProvider>
  );
}
