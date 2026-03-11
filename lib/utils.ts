// /lib/utils.ts

/**
 * Simple deterministic hash from a string → unsigned 32-bit int.
 * Same input always produces same output.
 */
export function hash32(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

/**
 * Seeded pseudo-random number generator from an integer seed.
 * Returns a function that generates numbers in [0, 1).
 */
export function seededRng(seed: number) {
  let s = seed;
  return function (): number {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

/**
 * Map a number [0,1) to a range [min, max].
 */
export function remap(v: number, min: number, max: number): number {
  return min + v * (max - min);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Generate a deterministic avatar seed object from a nickname string.
 * Returns a stable set of values used by GeometricAvatar.
 */
export interface AvatarSeed {
  primaryShape: number;   // 0-4: circle, hexagon, triangle, diamond, octagon
  shapeCount: number;     // 3-7
  rotations: number[];    // random angles
  scales: number[];       // sizes
  offsets: number[][];    // x, y positions
  hueShift: number;       // degree shift on accent
  ringCount: number;      // 1 or 2
}

export function deriveAvatarSeed(nickname: string): AvatarSeed {
  const base = nickname.trim() || "GHOST";
  const h = hash32(base);
  const rng = seededRng(h);

  const count = Math.floor(remap(rng(), 3, 8));
  const rotations: number[] = [];
  const scales: number[] = [];
  const offsets: number[][] = [];
  for (let i = 0; i < count; i++) {
    rotations.push(remap(rng(), 0, 360));
    scales.push(remap(rng(), 0.3, 1.0));
    offsets.push([remap(rng(), -28, 28), remap(rng(), -28, 28)]);
  }

  return {
    primaryShape: Math.floor(remap(rng(), 0, 5)),
    shapeCount: count,
    rotations,
    scales,
    offsets,
    hueShift: remap(rng(), -20, 20),
    ringCount: rng() > 0.5 ? 2 : 1,
  };
}

/**
 * Format a number with leading zero if < 10.
 */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Generate a pseudo-address from nickname for the card footer.
 */
export function generatePseudoAddress(nickname: string): string {
  const h = hash32(nickname || "GHOST");
  const rng = seededRng(h ^ 0xdeadbeef);
  const hex = () => Math.floor(rng() * 0xffff).toString(16).padStart(4, "0");
  return `0x${hex()}...${hex()}`;
}

/**
 * Interpolate two hex colors by t ∈ [0,1].
 */
export function lerpHex(a: string, b: string, t: number): string {
  const ah = parseInt(a.replace("#", ""), 16);
  const bh = parseInt(b.replace("#", ""), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, bv].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Truncate string to max length.
 */
export function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
