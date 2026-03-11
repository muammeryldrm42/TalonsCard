import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Rajdhani'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        void: "#020408",
        panel: "#070d14",
        "panel-bright": "#0c1620",
        "border-dim": "#0f1f2e",
        "border-mid": "#163047",
        "border-bright": "#1e4060",
        "text-primary": "#e8f4f8",
        "text-secondary": "#6b9bb8",
        "text-muted": "#2d5570",
        // Class colors
        architect: "#00F2FF",
        shadow: "#7000FF",
        nomad: "#FFB800",
        oracle: "#00FF41",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "scan": "scan 6s linear infinite",
        "flicker": "flicker 10s linear infinite",
        "shimmer": "shimmer 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "rain": "rain 1s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        flicker: {
          "0%,97%,100%": { opacity: "1" },
          "98%": { opacity: "0.85" },
          "99%": { opacity: "1" },
          "99.5%": { opacity: "0.9" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        rain: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      boxShadow: {
        "neon-sm": "0 0 8px var(--accent), 0 0 16px var(--accent-dim)",
        "neon-md": "0 0 16px var(--accent), 0 0 32px var(--accent-dim), 0 0 64px var(--accent-faint)",
        "neon-lg": "0 0 24px var(--accent), 0 0 48px var(--accent-dim), 0 0 96px var(--accent-faint)",
        "inner-neon": "inset 0 0 20px var(--accent-faint)",
      },
    },
  },
  plugins: [],
};

export default config;
