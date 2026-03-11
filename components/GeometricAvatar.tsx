"use client";
// /components/GeometricAvatar.tsx

import React, { useMemo } from "react";
import { deriveAvatarSeed } from "@/lib/utils";
import { CLASS_THEMES } from "@/lib/types";
import type { CharacterClass } from "@/lib/types";

interface GeometricAvatarProps {
  nickname: string;
  characterClass: CharacterClass;
  size?: number;
  className?: string;
}

/** SVG path generators for each primary shape (normalised to 100x100 viewBox) */
function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M${pts.join("L")}Z`;
}
function triPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 3 }, (_, i) => {
    const a = ((Math.PI * 2) / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M${pts.join("L")}Z`;
}
function diamondPath(cx: number, cy: number, r: number): string {
  return `M${cx},${cy - r} L${cx + r * 0.7},${cy} L${cx},${cy + r} L${cx - r * 0.7},${cy}Z`;
}
function octPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M${pts.join("L")}Z`;
}

function shapePath(type: number, cx: number, cy: number, r: number): string {
  switch (type % 5) {
    case 0: return `M${cx - r},${cy - r} L${cx + r},${cy - r} L${cx + r},${cy + r} L${cx - r},${cy + r}Z`; // square
    case 1: return hexPath(cx, cy, r);
    case 2: return triPath(cx, cy, r);
    case 3: return diamondPath(cx, cy, r);
    default: return octPath(cx, cy, r);
  }
}

export default function GeometricAvatar({
  nickname,
  characterClass,
  size = 120,
  className = "",
}: GeometricAvatarProps) {
  const theme = CLASS_THEMES[characterClass];
  const seed = useMemo(() => deriveAvatarSeed(nickname), [nickname]);

  const cx = 50;
  const cy = 50;
  const uid = `av-${nickname.replace(/\W/g, "") || "ghost"}-${characterClass}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-label={`Avatar for ${nickname || "GHOST"}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Radial gradient for fill */}
        <radialGradient id={`${uid}-grad`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.accent} stopOpacity="0.25" />
          <stop offset="100%" stopColor={theme.accent} stopOpacity="0.05" />
        </radialGradient>
        {/* Glow filter */}
        <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Clip to circle */}
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cy} r="46" />
        </clipPath>
      </defs>

      {/* Background circle */}
      <circle cx={cx} cy={cy} r="46" fill={`url(#${uid}-grad)`} />

      {/* Outer ring(s) */}
      {Array.from({ length: seed.ringCount }).map((_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={44 - i * 8}
          fill="none"
          stroke={theme.accent}
          strokeWidth={0.6 - i * 0.15}
          strokeOpacity={0.5 - i * 0.15}
          strokeDasharray={i === 0 ? "none" : "2 4"}
        />
      ))}

      {/* Geometric shapes clipped to circle */}
      <g clipPath={`url(#${uid}-clip)`} filter={`url(#${uid}-glow)`}>
        {seed.scales.map((scale, i) => {
          const r = 12 * scale;
          const ox = seed.offsets[i][0];
          const oy = seed.offsets[i][1];
          const shapeType = (seed.primaryShape + i) % 5;
          const alpha = i === 0 ? 0.55 : 0.2 + 0.1 * (i % 3);
          return (
            <path
              key={i}
              d={shapePath(shapeType, cx + ox, cy + oy, r)}
              fill={theme.accent}
              fillOpacity={alpha}
              stroke={theme.accent}
              strokeWidth={0.8}
              strokeOpacity={0.7}
              transform={`rotate(${seed.rotations[i]}, ${cx + ox}, ${cy + oy})`}
            />
          );
        })}
      </g>

      {/* Crosshair reticle */}
      <g stroke={theme.accent} strokeWidth={0.5} strokeOpacity={0.4}>
        <line x1={cx - 46} y1={cy} x2={cx - 30} y2={cy} />
        <line x1={cx + 30} y1={cy} x2={cx + 46} y2={cy} />
        <line x1={cx} y1={cy - 46} x2={cx} y2={cy - 30} />
        <line x1={cx} y1={cy + 30} x2={cx} y2={cy + 46} />
      </g>

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.5" fill={theme.accent} fillOpacity={0.9} />
    </svg>
  );
}
