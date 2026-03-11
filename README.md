# 🦅 Talons Card — Professional Edition

**Futuristic on-chain identity card generator for crypto users.**

A fully frontend-only, zero-config application that generates premium cyber-styled identity cards — exportable as high-resolution PNG.

[![MIT License](https://img.shields.io/badge/license-MIT-blueviolet.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

---

## ✨ Features

- **4 Character Classes** — The Architect (cyan), The Shadow (purple), The Nomad (amber), The Oracle (green)
- **Deterministic Avatar** — geometric SVG avatar generated from your nickname; same name = same avatar, always
- **Dynamic Glow** — border intensity reacts to your Degen Score in real time
- **Class-specific patterns** — Circuit board, noise static, topographic lines, matrix rain
- **Access Level Logic** — Computed from years on-chain, degen score, class, and achievements
- **PNG Export** — 3× retina-quality with `html-to-image`
- **Boot Sequence** — Cyber terminal initialization animation on load
- **No backend, no auth, no wallet, no APIs**

## 🚀 Getting Started

```bash
git clone https://github.com/yourusername/talons-card
cd talons-card
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🌐 Deploy to Vercel

```bash
npx vercel
```

No environment variables required.

## 🏗 Architecture

```
/app
  page.tsx        — Main page: boot sequence, two-column layout
  layout.tsx      — Root layout + metadata
  globals.css     — CSS variables, scanlines, neon classes

/components
  IdentityCard.tsx    — The card itself (forwardRef for export)
  GeometricAvatar.tsx — Deterministic SVG avatar from nickname hash
  Controls.tsx        — Full configuration terminal panel
  TerminalInput.tsx   — Styled input, select components
  ExportAction.tsx    — html-to-image PNG export

/hooks
  useThemeSwitcher.ts — Injects CSS variables on class change

/lib
  types.ts    — All TypeScript interfaces and class theme configs
  utils.ts    — Hash functions, avatar seed, formatting
  scoring.ts  — Access level, vibe score, class rating logic
```

## 🎨 Character Classes

| Class | Accent | Pattern | Aura |
|---|---|---|---|
| The Architect | `#00F2FF` | Circuit board | Technical · Builder · Structured |
| The Shadow | `#9b30ff` | Noise / static | Mysterious · Secure · Silent |
| The Nomad | `#FFB800` | Topographic lines | Fast · Mobile · Explorer |
| The Oracle | `#00FF41` | Matrix rain | Analytical · Wise · Predictive |

## 📄 License

MIT © 2024 Talons Protocol
