"use client";
// /components/IdentityCard.tsx

import React, { forwardRef } from "react";
import { Shield, Cpu, Zap, Globe, Star } from "lucide-react";
import GeometricAvatar from "./GeometricAvatar";
import type { IdentityConfig, ComputedIdentity } from "@/lib/types";
import { CLASS_THEMES } from "@/lib/types";
import { generatePseudoAddress, truncate, pad2 } from "@/lib/utils";

// ── Background patterns ──────────────────────────────────────────────────────

function CircuitPattern({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-10"
      xmlns="http://www.w3.org/2000/svg"
      style={{ pointerEvents: "none" }}
    >
      <defs>
        <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20h12 M28 20h12 M20 0v12 M20 28v12" stroke={color} strokeWidth="0.6" fill="none" />
          <circle cx="20" cy="20" r="3" stroke={color} strokeWidth="0.6" fill="none" />
          <circle cx="20" cy="20" r="1" fill={color} />
          <path d="M12 20h4 M24 20h4" stroke={color} strokeWidth="0.4" fill="none" />
          <path d="M20 12v4 M20 24v4" stroke={color} strokeWidth="0.4" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

function NoisePattern({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
      <defs>
        <filter id="noiseF">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#noiseF)" fill={color} />
    </svg>
  );
}

function TopoPattern({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.09]" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
      {[30, 55, 80, 105, 130, 155, 180, 205, 230].map((offset, i) => (
        <ellipse key={i} cx="200" cy="140" rx={60 + offset} ry={30 + offset * 0.4} fill="none" stroke={color} strokeWidth="0.7" />
      ))}
      {[15, 40, 65, 90, 115, 140, 165].map((offset, i) => (
        <ellipse key={`b${i}`} cx="80" cy="60" rx={20 + offset} ry={12 + offset * 0.35} fill="none" stroke={color} strokeWidth="0.5" />
      ))}
    </svg>
  );
}

function MatrixPattern({ color }: { color: string }) {
  const cols = 18;
  const chars = "01アイウエオカキクケコサシスセソタチ∑∆Ω";
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
      {Array.from({ length: cols }, (_, ci) =>
        Array.from({ length: 10 }, (_, ri) => {
          const char = chars[(ci * 7 + ri * 3) % chars.length];
          return (
            <text
              key={`${ci}-${ri}`}
              x={ci * 24 + 8}
              y={ri * 28 + 20}
              fontSize="10"
              fill={color}
              fontFamily="monospace"
              opacity={(0.3 + ((ci + ri) % 5) * 0.15).toFixed(2)}
            >
              {char}
            </text>
          );
        })
      )}
    </svg>
  );
}

function CardPattern({ pattern, color }: { pattern: string; color: string }) {
  switch (pattern) {
    case "circuit": return <CircuitPattern color={color} />;
    case "noise": return <NoisePattern color={color} />;
    case "topo": return <TopoPattern color={color} />;
    case "matrix": return <MatrixPattern color={color} />;
    default: return null;
  }
}

// ── Holographic shimmer stripe ───────────────────────────────────────────────
function HoloStripe({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ borderRadius: "inherit" }}
    >
      <div
        className="absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: "30%",
          height: "150%",
          background: `linear-gradient(105deg, transparent 30%, ${color}18 45%, ${color}30 50%, ${color}18 55%, transparent 70%)`,
          transform: "rotate(0deg)",
        }}
      />
    </div>
  );
}

// ── Chamfered corner clip ────────────────────────────────────────────────────
// We use a polygon clip-path for the classic cyber ID card look.
const CLIP_CARD = "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 20px)";

// ── Stat row ─────────────────────────────────────────────────────────────────
function StatRow({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span style={{ color: accent, opacity: 0.7, marginTop: 1 }} className="flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[8px] font-mono tracking-[0.15em] uppercase opacity-40" style={{ color: accent }}>
          {label}
        </div>
        <div className="text-[11px] font-mono font-medium leading-tight" style={{ color: accent }}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

// ── Main card ────────────────────────────────────────────────────────────────

interface IdentityCardProps {
  config: IdentityConfig;
  computed: ComputedIdentity;
  glowIntensity?: number; // 0-1
}

const IdentityCard = forwardRef<HTMLDivElement, IdentityCardProps>(
  ({ config, computed, glowIntensity = 0.5 }, ref) => {
    const theme = CLASS_THEMES[config.characterClass];
    const addr = generatePseudoAddress(config.nickname);
    const displayName = config.nickname.trim() || "GHOST";
    const chains = config.activeChains.slice(0, 5);

    // Glow shadow based on degenScore
    const glowOpacity = 0.3 + glowIntensity * 0.7;
    const cardShadow = `0 0 ${20 + glowIntensity * 40}px ${theme.accentDim}, 0 0 ${60 + glowIntensity * 80}px rgba(0,0,0,0.8)`;

    return (
      <div
        ref={ref}
        style={{
          width: 380,
          minHeight: 240,
          background: `linear-gradient(145deg, ${theme.bg} 0%, #020408 60%, ${theme.bg} 100%)`,
          boxShadow: cardShadow,
          clipPath: CLIP_CARD,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'JetBrains Mono', monospace",
          // Explicit pixel sizing for export reliability
          flexShrink: 0,
        }}
      >
        {/* Background pattern */}
        <CardPattern pattern={theme.pattern} color={theme.accent} />

        {/* Holographic stripe */}
        <HoloStripe color={theme.accent} />

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 flex flex-col gap-3" style={{ minHeight: 240 }}>

          {/* ── Header row ── */}
          <div className="flex items-start justify-between">
            {/* Branding */}
            <div>
              <div className="flex items-center gap-1.5">
                <Shield size={10} style={{ color: theme.accent }} />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase opacity-60" style={{ color: theme.accent }}>
                  TALONS
                </span>
                <span className="text-[9px] font-mono tracking-[0.2em] opacity-40" style={{ color: theme.accent }}>
                  PROTOCOL
                </span>
              </div>
              <div className="text-[8px] font-mono opacity-25 mt-0.5" style={{ color: theme.accent }}>
                IDENTITY CARD v2.4
              </div>
            </div>

            {/* Access level badge */}
            <div className="text-right">
              <div className="text-[8px] font-mono tracking-[0.15em] opacity-40 uppercase mb-0.5" style={{ color: theme.accent }}>
                Access Level
              </div>
              <div
                className="text-[11px] font-display font-bold tracking-widest uppercase px-2 py-0.5 rounded"
                style={{
                  color: theme.accent,
                  background: theme.accentFaint,
                  border: `1px solid ${theme.accentDim}`,
                  letterSpacing: "0.12em",
                }}
              >
                {computed.accessLevel}
              </div>
              <div className="text-[8px] font-mono mt-0.5 opacity-30" style={{ color: theme.accent }}>
                {computed.classRating}
              </div>
            </div>
          </div>

          {/* ── Central identity row ── */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0" style={{ filter: `drop-shadow(0 0 10px ${theme.accentDim})` }}>
              <GeometricAvatar
                nickname={config.nickname}
                characterClass={config.characterClass}
                size={90}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              {/* Class badge */}
              <div className="text-[8px] font-mono tracking-[0.25em] uppercase mb-1" style={{ color: theme.accent, opacity: 0.6 }}>
                {theme.label}
              </div>

              {/* Nickname */}
              <div
                className="font-display font-bold leading-none uppercase"
                style={{
                  color: theme.accent,
                  fontSize: displayName.length > 12 ? 18 : displayName.length > 8 ? 22 : 26,
                  textShadow: `0 0 12px ${theme.accentDim}`,
                  letterSpacing: "0.06em",
                }}
              >
                {truncate(displayName, 16)}
              </div>

              {/* Title */}
              {config.title && (
                <div className="text-[10px] font-mono mt-1 opacity-50" style={{ color: theme.accent }}>
                  {truncate(config.title, 28)}
                </div>
              )}

              {/* Aura line */}
              <div className="text-[8px] font-mono mt-2 opacity-25 tracking-wide" style={{ color: theme.accent }}>
                {theme.aura}
              </div>

              {/* Threat level */}
              <div className="flex items-center gap-1 mt-1.5">
                <Zap size={8} style={{ color: theme.accent }} />
                <span className="text-[8px] font-mono tracking-widest opacity-50" style={{ color: theme.accent }}>
                  DEGEN THREAT: {computed.threatLevel}
                </span>
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="relative">
            <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accentDim}, transparent)` }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-mono px-2 tracking-widest opacity-40" style={{ color: theme.accent, background: theme.bg }}>
              ◈ CHAIN INTEL ◈
            </div>
          </div>

          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <StatRow
              icon={<Star size={9} />}
              label="Primary Chain"
              value={config.primaryChain || "None"}
              accent={theme.accent}
            />
            <StatRow
              icon={<Cpu size={9} />}
              label="Years On-Chain"
              value={`${config.yearsInCrypto}y ${config.yearsInCrypto === 1 ? "vet" : "veteran"}`}
              accent={theme.accent}
            />
            <StatRow
              icon={<Globe size={9} />}
              label="Active Chains"
              value={chains.length > 0 ? chains.slice(0, 3).join(" · ") : "None"}
              accent={theme.accent}
            />
            <StatRow
              icon={<Zap size={9} />}
              label="Degen Score"
              value={`${config.degenScore}/100`}
              accent={theme.accent}
            />
          </div>

          {/* Specialty + Achievement */}
          {(config.specialty || config.achievement) && (
            <>
              <div className="h-px" style={{ background: `linear-gradient(90deg, ${theme.accentFaint}, transparent)` }} />
              <div className="space-y-1">
                {config.specialty && (
                  <div className="text-[8px] font-mono" style={{ color: theme.accent }}>
                    <span className="opacity-40 tracking-widest">SECTOR // </span>
                    <span className="opacity-70">{truncate(config.specialty, 36)}</span>
                  </div>
                )}
                {config.achievement && (
                  <div className="text-[8px] font-mono" style={{ color: theme.accent }}>
                    <span className="opacity-40 tracking-widest">SIG.ACH // </span>
                    <span className="opacity-70">{truncate(config.achievement, 36)}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Footer strip ── */}
          <div
            className="mt-auto pt-2 flex items-center justify-between border-t"
            style={{ borderColor: `${theme.accentFaint}` }}
          >
            <div className="font-mono text-[8px] opacity-30" style={{ color: theme.accent }}>
              {config.codename ? `∷ ${config.codename.toUpperCase()} ∷` : addr}
            </div>
            {config.motto && (
              <div className="font-mono text-[8px] italic opacity-25 max-w-[140px] text-right" style={{ color: theme.accent }}>
                "{truncate(config.motto, 24)}"
              </div>
            )}
          </div>

          {/* Score bar */}
          <div className="flex items-center gap-2">
            <div className="text-[8px] font-mono opacity-30 flex-shrink-0" style={{ color: theme.accent }}>
              VIBE
            </div>
            <div className="flex-1 h-0.5 rounded-full" style={{ background: theme.accentFaint }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${computed.vibeScore}%`,
                  background: `linear-gradient(90deg, ${theme.accentDim}, ${theme.accent})`,
                }}
              />
            </div>
            <div className="text-[8px] font-mono opacity-40 flex-shrink-0" style={{ color: theme.accent }}>
              {pad2(computed.vibeScore)}
            </div>
          </div>

          {/* Bottom stamp */}
          <div className="absolute bottom-2 right-3 opacity-[0.08]">
            <div className="font-display text-[28px] font-black tracking-[0.2em] uppercase rotate-[-8deg]" style={{ color: theme.accent }}>
              TALONS
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accentDim}, transparent)` }}
        />
      </div>
    );
  }
);

IdentityCard.displayName = "IdentityCard";
export default IdentityCard;
