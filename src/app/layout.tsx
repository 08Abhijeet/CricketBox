import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CricketIQ — AI-Powered Cricket Knowledge Engine",
  description:
    "Ask any cricket question and get expert answers powered by a curated cricket knowledge base and AI. Covers techniques, rules, players, match history, and tactics.",
  keywords: [
    "cricket AI",
    "cricket chatbot",
    "RAG cricket",
    "cricket knowledge",
    "cricket analysis",
  ],
  openGraph: {
    title: "CricketIQ — AI Cricket Knowledge Engine",
    description: "Expert cricket answers powered by RAG + Claude AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
