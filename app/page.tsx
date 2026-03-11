"use client";
// /app/page.tsx

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cpu, Activity, Terminal } from "lucide-react";
import IdentityCard from "@/components/IdentityCard";
import Controls from "@/components/Controls";
import ExportAction from "@/components/ExportAction";
import { useThemeSwitcher } from "@/hooks/useThemeSwitcher";
import { computeIdentity } from "@/lib/scoring";
import { CLASS_THEMES } from "@/lib/types";
import type { IdentityConfig } from "@/lib/types";

// ── Default config ────────────────────────────────────────────────────────
const DEFAULT_CONFIG: IdentityConfig = {
  nickname: "CIPHER_X",
  title: "Protocol Architect",
  characterClass: "architect",
  primaryChain: "Ethereum",
  activeChains: ["Ethereum", "Arbitrum", "Base"],
  yearsInCrypto: 4,
  degenScore: 72,
  specialty: "DeFi",
  achievement: "Survived the merge",
  codename: "",
  motto: "Trust the code.",
};

// ── Boot log lines ─────────────────────────────────────────────────────────
const BOOT_LINES = [
  "TALONS PROTOCOL v2.4.1 — INITIALIZING",
  "Secure channel established",
  "Identity module loaded",
  "Cryptographic seed ready",
  "Avatar engine online",
  ">> SYSTEM READY",
];

// ── Animated boot terminal ─────────────────────────────────────────────────
function BootTerminal({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  // Reveal lines one by one
  useState(() => {
    let i = 0;
    const tick = () => {
      setLines((prev) => [...prev, BOOT_LINES[i]]);
      i++;
      if (i < BOOT_LINES.length) {
        setTimeout(tick, 180 + Math.random() * 120);
      } else {
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 400);
        }, 300);
      }
    };
    setTimeout(tick, 200);
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020408]"
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-md px-8 font-mono text-sm space-y-1">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={
              line.startsWith(">>")
                ? "text-[--accent] font-bold"
                : "text-[#6b9bb8]"
            }
          >
            {line.startsWith(">>") ? line : `[ ${line} ]`}
          </motion.div>
        ))}
        {!done && <span className="text-[--accent] cursor-blink">█</span>}
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Page() {
  const [booted, setBooted] = useState(false);
  const [config, setConfig] = useState<IdentityConfig>(DEFAULT_CONFIG);
  const cardRef = useRef<HTMLDivElement>(null);

  useThemeSwitcher(config.characterClass);

  const updateConfig = useCallback(
    <K extends keyof IdentityConfig>(key: K, value: IdentityConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const computed = computeIdentity(config);
  const theme = CLASS_THEMES[config.characterClass];
  const glowIntensity = config.degenScore / 100;

  if (!booted) {
    return <BootTerminal onComplete={() => setBooted(true)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#020408] relative"
    >
      {/* Ambient background grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(${theme.accentFaint} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.accentFaint} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner glow */}
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.accentFaint} 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${theme.accentFaint} 0%, transparent 70%)`,
          transform: "translate(-40%, 40%)",
        }}
      />

      {/* ── Top bar ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative z-10 border-b px-6 py-3 flex items-center justify-between"
        style={{ borderColor: theme.accentFaint, background: "rgba(2,4,8,0.9)" }}
      >
        <div className="flex items-center gap-3">
          <Shield size={16} style={{ color: theme.accent }} />
          <span className="font-display text-lg font-bold tracking-[0.2em] uppercase" style={{ color: theme.accent }}>
            TALONS
          </span>
          <span className="text-[10px] font-mono opacity-40 tracking-widest" style={{ color: theme.accent }}>
            IDENTITY TERMINAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Status dots */}
          <div className="flex items-center gap-2 text-[9px] font-mono opacity-40" style={{ color: theme.accent }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accent }} />
            <span>LIVE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono opacity-30" style={{ color: theme.accent }}>
            <Cpu size={10} />
            <span>{computed.accessLevel.toUpperCase()}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] font-mono opacity-30" style={{ color: theme.accent }}>
            <Activity size={10} />
            <span>SCORE {computed.vibeScore}</span>
          </div>
        </div>
      </motion.header>

      {/* ── Main layout ── */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 text-center"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.15em] uppercase mb-2" style={{ color: theme.accent }}>
            Identity Card Generator
          </h1>
          <p className="text-[11px] font-mono opacity-40" style={{ color: theme.accent }}>
            Configure your on-chain identity · Export as PNG · Screenshot-ready
          </p>
        </motion.div>

        {/* Two-column dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">

          {/* ── Left: Config terminal ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            {/* Terminal panel */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${theme.accentFaint}`,
                background: "rgba(7, 13, 20, 0.9)",
                boxShadow: `0 0 40px ${theme.accentFaint}`,
              }}
            >
              {/* Panel title bar */}
              <div
                className="flex items-center gap-2 px-4 py-2.5 border-b"
                style={{ borderColor: theme.accentFaint, background: "rgba(0,0,0,0.3)" }}
              >
                <Terminal size={12} style={{ color: theme.accent, opacity: 0.7 }} />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase opacity-50" style={{ color: theme.accent }}>
                  CONFIGURATION TERMINAL
                </span>
                <div className="flex-1" />
                <span className="text-[8px] font-mono opacity-20" style={{ color: theme.accent }}>
                  CLASS: {config.characterClass.toUpperCase()}
                </span>
              </div>

              {/* Controls */}
              <div className="p-5 max-h-[70vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={config.characterClass}
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Controls config={config} onChange={updateConfig} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Card preview + export ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="order-1 lg:order-2 flex flex-col items-center gap-6"
          >
            {/* Card frame label */}
            <div className="flex items-center gap-3 w-full max-w-[420px]">
              <div className="flex-1 h-px" style={{ background: theme.accentFaint }} />
              <span className="text-[9px] font-mono tracking-[0.3em] opacity-40" style={{ color: theme.accent }}>
                IDENTITY PREVIEW
              </span>
              <div className="flex-1 h-px" style={{ background: theme.accentFaint }} />
            </div>

            {/* Card with outer glow container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={config.characterClass}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.35, type: "spring", bounce: 0.1 }}
                className="flex justify-center"
                style={{
                  filter: `drop-shadow(0 0 ${8 + glowIntensity * 24}px ${theme.accentDim}) drop-shadow(0 8px 40px rgba(0,0,0,0.8))`,
                }}
              >
                <div className="scanlines" style={{ display: "inline-block" }}>
                  <IdentityCard
                    ref={cardRef}
                    config={config}
                    computed={computed}
                    glowIntensity={glowIntensity}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats strip below card */}
            <div
              className="w-full max-w-[380px] grid grid-cols-3 gap-2 text-center"
              style={{ color: theme.accent }}
            >
              {[
                { label: "ACCESS", value: computed.accessLevel },
                { label: "VIBE", value: `${computed.vibeScore}/100` },
                { label: "CLASS", value: computed.classRating },
              ].map((s) => (
                <div
                  key={s.label}
                  className="py-2 rounded"
                  style={{
                    background: theme.accentFaint,
                    border: `1px solid ${theme.accentFaint}`,
                  }}
                >
                  <div className="text-[8px] font-mono opacity-40 tracking-widest">{s.label}</div>
                  <div className="text-[11px] font-mono font-bold opacity-80">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Export */}
            <div className="w-full max-w-[380px]">
              <ExportAction cardRef={cardRef} config={config} />
            </div>

            {/* Disclaimer */}
            <p
              className="text-[9px] font-mono text-center opacity-20 max-w-[320px] leading-relaxed"
              style={{ color: theme.accent }}
            >
              Purely cosmetic generator. No wallet required. No data stored.
              <br />
              © TALONS PROTOCOL — MIT LICENSE
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom footer bar */}
      <footer
        className="relative z-10 border-t mt-12 px-6 py-3 flex items-center justify-between text-[9px] font-mono opacity-20"
        style={{ borderColor: theme.accentFaint, color: theme.accent }}
      >
        <span>TALONS CARD PROFESSIONAL EDITION v1.0</span>
        <span>frontend-only · no auth · no data</span>
        <span>MIT LICENSE</span>
      </footer>
    </motion.div>
  );
}
