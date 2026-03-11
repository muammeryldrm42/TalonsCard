// /app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talons Card — Crypto Identity Generator",
  description:
    "Generate your futuristic on-chain identity card. Cyber-intelligence terminal for crypto natives.",
  keywords: ["crypto", "identity", "NFT", "web3", "card", "generator"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="ambient-glow">{children}</body>
    </html>
  );
}
