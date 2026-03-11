"use client";
// /components/TerminalInput.tsx

import React from "react";

interface TerminalInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: "text" | "number";
  prefix?: string;
  hint?: string;
  className?: string;
}

export default function TerminalInput({
  label,
  value,
  onChange,
  placeholder = "",
  maxLength = 40,
  type = "text",
  prefix,
  hint,
  className = "",
}: TerminalInputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-2">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[--accent] opacity-80">
          {label}
        </span>
        {hint && (
          <span className="text-[9px] font-mono text-[--accent] opacity-30">// {hint}</span>
        )}
      </label>
      <div
        className="flex items-center gap-0 border rounded"
        style={{
          borderColor: "var(--accent)",
          borderOpacity: 0.3,
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        {prefix && (
          <span
            className="px-2 py-1.5 text-xs font-mono border-r select-none"
            style={{ color: "var(--accent)", borderColor: "var(--accent)", opacity: 0.5 }}
          >
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full bg-transparent px-3 py-1.5 text-sm font-mono text-[--text-primary] placeholder:opacity-20 outline-none"
          style={
            {
              "--text-primary": "#e8f4f8",
              color: "var(--accent)",
              caretColor: "var(--accent)",
            } as React.CSSProperties
          }
          min={type === "number" ? 0 : undefined}
          max={type === "number" ? 50 : undefined}
        />
      </div>
    </div>
  );
}

/** A labelled select styled the same way */
interface TerminalSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  className?: string;
}

export function TerminalSelect({
  label,
  value,
  onChange,
  options,
  hint,
  className = "",
}: TerminalSelectProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="flex items-center gap-2">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[--accent] opacity-80">
          {label}
        </span>
        {hint && (
          <span className="text-[9px] font-mono text-[--accent] opacity-30">// {hint}</span>
        )}
      </label>
      <div
        className="border rounded"
        style={{ borderColor: "var(--accent)", backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-1.5 text-sm font-mono outline-none appearance-none cursor-pointer"
          style={{ color: "var(--accent)" }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#070d14", color: "var(--accent)" }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
