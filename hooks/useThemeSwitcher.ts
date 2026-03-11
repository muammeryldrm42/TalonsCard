"use client";
// /hooks/useThemeSwitcher.ts

import { useEffect } from "react";
import type { CharacterClass } from "@/lib/types";
import { CLASS_THEMES } from "@/lib/types";

/**
 * Injects class-specific CSS variables onto :root so Tailwind arbitrary values
 * and raw CSS can reference --accent, --accent-dim, --accent-faint.
 */
export function useThemeSwitcher(characterClass: CharacterClass) {
  useEffect(() => {
    const theme = CLASS_THEMES[characterClass];
    const root = document.documentElement;

    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-dim", theme.accentDim);
    root.style.setProperty("--accent-faint", theme.accentFaint);
    root.style.setProperty("--accent-glow", theme.accentGlow);
    root.style.setProperty("--card-bg", theme.bg);

    return () => {
      // reset to defaults on unmount (not strictly necessary)
    };
  }, [characterClass]);
}

export { CLASS_THEMES };
