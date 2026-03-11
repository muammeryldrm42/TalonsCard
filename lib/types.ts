// /lib/types.ts

export type CharacterClass = "architect" | "shadow" | "nomad" | "oracle";

export type AccessLevel =
  | "Observer"
  | "Operator"
  | "Sentinel"
  | "Cipher"
  | "Phantom"
  | "Architect Prime"
  | "Oracle Prime";

export interface ClassTheme {
  id: CharacterClass;
  label: string;
  accent: string;          // primary hex
  accentDim: string;       // 50% alpha
  accentFaint: string;     // 15% alpha
  accentGlow: string;      // for box-shadow string
  bg: string;              // card bg hex
  pattern: "circuit" | "noise" | "topo" | "matrix";
  description: string;
  aura: string;
}

export interface IdentityConfig {
  nickname: string;
  title: string;
  characterClass: CharacterClass;
  primaryChain: string;
  activeChains: string[];
  yearsInCrypto: number;
  degenScore: number;
  specialty: string;
  achievement: string;
  codename: string;
  motto: string;
}

export interface ComputedIdentity {
  accessLevel: AccessLevel;
  vibeScore: number;
  classRating: string;
  threatLevel: string;
}

export const CHAINS = [
  "Ethereum", "Bitcoin", "Solana", "Arbitrum", "Optimism",
  "Base", "Polygon", "Avalanche", "Sui", "Aptos",
  "BNB Chain", "Cosmos", "Celestia", "Starknet", "zkSync",
] as const;

export type Chain = typeof CHAINS[number];

export const CLASS_THEMES: Record<CharacterClass, ClassTheme> = {
  architect: {
    id: "architect",
    label: "The Architect",
    accent: "#00F2FF",
    accentDim: "rgba(0,242,255,0.45)",
    accentFaint: "rgba(0,242,255,0.12)",
    accentGlow: "0 0 20px rgba(0,242,255,0.7), 0 0 60px rgba(0,242,255,0.3)",
    bg: "#020c12",
    pattern: "circuit",
    description: "Systems thinker. Protocol builder. The one who drew the blueprints.",
    aura: "Technical · Builder · Structured",
  },
  shadow: {
    id: "shadow",
    label: "The Shadow",
    accent: "#9b30ff",
    accentDim: "rgba(155,48,255,0.45)",
    accentFaint: "rgba(155,48,255,0.12)",
    accentGlow: "0 0 20px rgba(155,48,255,0.7), 0 0 60px rgba(155,48,255,0.3)",
    bg: "#06020f",
    pattern: "noise",
    description: "Operates in silence. Leaves no trace. Trust no one.",
    aura: "Mysterious · Secure · Silent",
  },
  nomad: {
    id: "nomad",
    label: "The Nomad",
    accent: "#FFB800",
    accentDim: "rgba(255,184,0,0.45)",
    accentFaint: "rgba(255,184,0,0.12)",
    accentGlow: "0 0 20px rgba(255,184,0,0.7), 0 0 60px rgba(255,184,0,0.3)",
    bg: "#0d0900",
    pattern: "topo",
    description: "Chain-hopper. Bridge-runner. First across every frontier.",
    aura: "Fast · Mobile · Explorer",
  },
  oracle: {
    id: "oracle",
    label: "The Oracle",
    accent: "#00FF41",
    accentDim: "rgba(0,255,65,0.45)",
    accentFaint: "rgba(0,255,65,0.12)",
    accentGlow: "0 0 20px rgba(0,255,65,0.7), 0 0 60px rgba(0,255,65,0.3)",
    bg: "#000d02",
    pattern: "matrix",
    description: "Sees what others cannot. The signal in the noise.",
    aura: "Analytical · Wise · Predictive",
  },
};
