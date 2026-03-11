"use client";
// /components/Controls.tsx

import React from "react";
import { Shield, Cpu, Map, Eye, Zap, Hash, Star, Globe } from "lucide-react";
import TerminalInput, { TerminalSelect } from "./TerminalInput";
import type { IdentityConfig, CharacterClass } from "@/lib/types";
import { CLASS_THEMES, CHAINS } from "@/lib/types";

interface ControlsProps {
  config: IdentityConfig;
  onChange: <K extends keyof IdentityConfig>(key: K, value: IdentityConfig[K]) => void;
}

const CHAIN_OPTIONS = CHAINS.map((c) => ({ value: c, label: c }));
const SPECIALTY_OPTIONS = [
  "DeFi",
  "NFTs",
  "Infrastructure",
  "MEV / Searcher",
  "Trading / Quant",
  "DAO Governance",
  "Security / Audits",
  "ZK Cryptography",
  "Gaming / Metaverse",
  "Layer-1 Research",
  "Bridges & Interop",
  "Developer Tooling",
  "Content & Media",
  "Venture / Investing",
  "Other",
].map((s) => ({ value: s, label: s }));

/** Section header in terminal style */
function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="opacity-60" style={{ color: "var(--accent)" }}>{icon}</span>
      <span className="text-[9px] font-mono tracking-[0.3em] uppercase opacity-50" style={{ color: "var(--accent)" }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--accent)", opacity: 0.12 }} />
    </div>
  );
}

/** Class selection pill */
function ClassPill({
  id,
  label,
  accent,
  selected,
  onClick,
}: {
  id: CharacterClass;
  label: string;
  accent: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2 text-[10px] font-mono tracking-wide text-center transition-all duration-200 rounded cursor-pointer focus:outline-none"
      style={{
        color: selected ? "#020408" : accent,
        background: selected ? accent : "transparent",
        border: `1px solid ${selected ? accent : `${accent}40`}`,
        fontWeight: selected ? 700 : 400,
      }}
      aria-pressed={selected}
    >
      {label.replace("The ", "")}
    </button>
  );
}

/** Chain toggle multi-select */
function ChainToggle({
  chain,
  selected,
  onClick,
}: {
  chain: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 text-[9px] font-mono rounded transition-all duration-150 cursor-pointer focus:outline-none"
      style={{
        color: selected ? "#020408" : "var(--accent)",
        background: selected ? "var(--accent)" : "transparent",
        border: `1px solid ${selected ? "var(--accent)" : "var(--accent)"}`,
        opacity: selected ? 1 : 0.35,
      }}
      aria-pressed={selected}
    >
      {chain}
    </button>
  );
}

export default function Controls({ config, onChange }: ControlsProps) {
  const toggleChain = (chain: string) => {
    const current = config.activeChains;
    if (current.includes(chain)) {
      onChange("activeChains", current.filter((c) => c !== chain));
    } else {
      onChange("activeChains", [...current, chain]);
    }
  };

  return (
    <div className="space-y-5 font-mono">
      {/* ── Identity Section ──────────────────────────────────────── */}
      <div>
        <SectionHeader icon={<Shield size={12} />} label="Identity Config" />
        <div className="space-y-3">
          <TerminalInput
            label="Alias / Nickname"
            value={config.nickname}
            onChange={(v) => onChange("nickname", v)}
            placeholder="GHOST"
            maxLength={20}
            prefix=">"
            hint="generates avatar"
          />
          <TerminalInput
            label="Role / Title"
            value={config.title}
            onChange={(v) => onChange("title", v)}
            placeholder="Protocol Architect"
            maxLength={32}
          />
          <TerminalInput
            label="Codename (optional)"
            value={config.codename}
            onChange={(v) => onChange("codename", v)}
            placeholder="WRAITH-7"
            maxLength={16}
            prefix="∷"
          />
          <TerminalInput
            label="Motto (optional)"
            value={config.motto}
            onChange={(v) => onChange("motto", v)}
            placeholder="Trust the code."
            maxLength={40}
          />
        </div>
      </div>

      {/* ── Class Selection ───────────────────────────────────────── */}
      <div>
        <SectionHeader icon={<Eye size={12} />} label="Character Class" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          {(Object.keys(CLASS_THEMES) as CharacterClass[]).map((id) => {
            const t = CLASS_THEMES[id];
            return (
              <ClassPill
                key={id}
                id={id}
                label={t.label}
                accent={t.accent}
                selected={config.characterClass === id}
                onClick={() => onChange("characterClass", id)}
              />
            );
          })}
        </div>
        <div className="text-[9px] font-mono opacity-30 text-center" style={{ color: "var(--accent)" }}>
          {CLASS_THEMES[config.characterClass].description}
        </div>
      </div>

      {/* ── Chain Config ──────────────────────────────────────────── */}
      <div>
        <SectionHeader icon={<Globe size={12} />} label="Chain Intelligence" />
        <div className="space-y-3">
          <TerminalSelect
            label="Primary Chain"
            value={config.primaryChain}
            onChange={(v) => onChange("primaryChain", v)}
            options={CHAIN_OPTIONS}
          />
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-60" style={{ color: "var(--accent)" }}>
              Active Chains
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CHAINS.map((chain) => (
                <ChainToggle
                  key={chain}
                  chain={chain}
                  selected={config.activeChains.includes(chain)}
                  onClick={() => toggleChain(chain)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <div>
        <SectionHeader icon={<Cpu size={12} />} label="Metrics" />
        <div className="space-y-4">
          {/* Years in crypto */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-60" style={{ color: "var(--accent)" }}>
                Years On-Chain
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>
                {config.yearsInCrypto}y
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={config.yearsInCrypto}
              onChange={(e) => onChange("yearsInCrypto", Number(e.target.value))}
              className="w-full h-0.5 appearance-none rounded cursor-pointer"
              style={{
                background: `linear-gradient(90deg, var(--accent) ${(config.yearsInCrypto / 12) * 100}%, rgba(255,255,255,0.08) 0%)`,
                accentColor: "var(--accent)",
              }}
              aria-label="Years in crypto"
            />
          </div>

          {/* Degen score */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-60" style={{ color: "var(--accent)" }}>
                Degen Score
              </span>
              <span className="text-xs font-mono" style={{ color: "var(--accent)" }}>
                {config.degenScore}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={config.degenScore}
              onChange={(e) => onChange("degenScore", Number(e.target.value))}
              className="w-full h-0.5 appearance-none rounded cursor-pointer"
              style={{
                background: `linear-gradient(90deg, var(--accent) ${config.degenScore}%, rgba(255,255,255,0.08) 0%)`,
                accentColor: "var(--accent)",
              }}
              aria-label="Degen score"
            />
          </div>
        </div>
      </div>

      {/* ── Background / Flavor ───────────────────────────────────── */}
      <div>
        <SectionHeader icon={<Star size={12} />} label="Dossier" />
        <div className="space-y-3">
          <TerminalSelect
            label="Specialty / Sector"
            value={config.specialty}
            onChange={(v) => onChange("specialty", v)}
            options={SPECIALTY_OPTIONS}
          />
          <TerminalInput
            label="Signature Achievement"
            value={config.achievement}
            onChange={(v) => onChange("achievement", v)}
            placeholder="e.g. Survived the merge"
            maxLength={48}
          />
        </div>
      </div>
    </div>
  );
}
