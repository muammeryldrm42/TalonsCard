// /lib/scoring.ts

import type { IdentityConfig, AccessLevel, ComputedIdentity, CharacterClass } from "./types";

/**
 * Compute a composite vibe score from 0–100.
 */
export function computeVibeScore(config: IdentityConfig): number {
  const {
    yearsInCrypto,
    activeChains,
    degenScore,
    achievement,
    motto,
    characterClass,
  } = config;

  let score = 0;

  // Years in crypto: 0–40 pts
  score += Math.min(40, yearsInCrypto * 5);

  // Active chains count: 0–20 pts
  score += Math.min(20, activeChains.length * 2.5);

  // Degen score contributes 0–25 pts
  score += (degenScore / 100) * 25;

  // Has achievement text: 0–8 pts
  if (achievement.trim().length > 4) score += 8;

  // Has motto: 0–4 pts
  if (motto.trim().length > 2) score += 4;

  // Class bonus
  const classBonus: Record<CharacterClass, number> = {
    architect: 3,
    oracle: 3,
    shadow: 2,
    nomad: 1,
  };
  score += classBonus[characterClass];

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Map vibe score + inputs to an access level label.
 */
export function computeAccessLevel(config: IdentityConfig, vibeScore: number): AccessLevel {
  const { yearsInCrypto, degenScore, characterClass } = config;

  // High-prestige class unlocks top tiers
  if (characterClass === "architect" && vibeScore >= 85) return "Architect Prime";
  if (characterClass === "oracle" && vibeScore >= 85) return "Oracle Prime";

  if (vibeScore >= 80 || (yearsInCrypto >= 7 && degenScore >= 85)) return "Phantom";
  if (vibeScore >= 65 || (yearsInCrypto >= 5 && degenScore >= 70)) return "Cipher";
  if (vibeScore >= 50 || yearsInCrypto >= 4) return "Sentinel";
  if (vibeScore >= 35 || yearsInCrypto >= 2) return "Operator";
  if (vibeScore >= 20) return "Observer";
  return "Observer";
}

/**
 * Produce a class-specific rating label.
 */
export function computeClassRating(characterClass: CharacterClass, vibeScore: number): string {
  const tiers = {
    architect: ["BLUEPRINT", "ENGINEER", "ARCHITECT", "MASTER ARCH"],
    shadow: ["GHOST", "OPERATIVE", "CIPHER", "PHANTOM"],
    nomad: ["DRIFTER", "ROVER", "PIONEER", "APEX NOMAD"],
    oracle: ["APPRENTICE", "ANALYST", "SEER", "ORACLE"],
  };
  const t = tiers[characterClass];
  const idx = vibeScore >= 80 ? 3 : vibeScore >= 60 ? 2 : vibeScore >= 35 ? 1 : 0;
  return t[idx];
}

/**
 * Derive a threat level label from degen score.
 */
export function computeThreatLevel(degenScore: number): string {
  if (degenScore >= 90) return "EXTREME";
  if (degenScore >= 75) return "HIGH";
  if (degenScore >= 50) return "ELEVATED";
  if (degenScore >= 25) return "MODERATE";
  return "LOW";
}

/**
 * Full computed identity from config.
 */
export function computeIdentity(config: IdentityConfig): ComputedIdentity {
  const vibeScore = computeVibeScore(config);
  const accessLevel = computeAccessLevel(config, vibeScore);
  const classRating = computeClassRating(config.characterClass, vibeScore);
  const threatLevel = computeThreatLevel(config.degenScore);

  return { accessLevel, vibeScore, classRating, threatLevel };
}
