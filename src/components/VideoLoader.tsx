"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoLoader({ onDone }: { onDone: () => void }) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Play at 2.5× speed so it feels like a dynamic loading screen
    video.playbackRate = 1.5;
    video.play().catch(() => {});

    const handleEnd = () => {
      // Fade out then call onDone
      setOpacity(0);
      setTimeout(onDone, 600);
    };

    video.addEventListener("ended", handleEnd);
    return () => video.removeEventListener("ended", handleEnd);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#010D1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
        transition: "opacity 0.6s ease",
      }}
    >
      <video
        ref={videoRef}
        src="/loaderoriiginal.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }} />

      {/* Speed indicator bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "rgba(255,131,43,0.2)",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #003087, #FF832B)",
            animation: "progress-bar linear 1 forwards",
            animationDuration: `${3682517 / 1000 / 2.5}s`, /* filesize-based rough estimate */
          }}
        />
      </div>

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
