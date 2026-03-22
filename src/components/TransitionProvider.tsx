"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  navigateTo: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = (href: string) => {
    setIsTransitioning(true);
    // Wait for the bouncing animation to show for a brief moment before fetching the new page
    setTimeout(() => {
      router.push(href);
      // Turn off loader once we navigate (or let the new page load instantly hide it via unmount)
      setTimeout(() => setIsTransitioning(false), 500); 
    }, 1200); // 1.2s of cool bouncing animation
  };

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}
      
      {/* The Global Overlay */}
      <div className={`chat-transition-overlay ${isTransitioning ? "show" : ""}`}>
        <div className="bouncing-loader" />
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within a TransitionProvider");
  return context;
}
