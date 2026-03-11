"use client";
// /components/ExportAction.tsx

import { useState, useRef, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { IdentityConfig } from "@/lib/types";
import { CLASS_THEMES } from "@/lib/types";

type ExportState = "idle" | "loading" | "success" | "error";

interface ExportActionProps {
  cardRef: RefObject<HTMLDivElement | null>;
  config: IdentityConfig;
}

export default function ExportAction({ cardRef, config }: ExportActionProps) {
  const [state, setState] = useState<ExportState>("idle");
  const [errMsg, setErrMsg] = useState("");
  const theme = CLASS_THEMES[config.characterClass];
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleExport = async () => {
    if (state === "loading") return;
    const node = cardRef.current;
    if (!node) {
      setErrMsg("Card element not found.");
      setState("error");
      return;
    }

    setState("loading");
    setErrMsg("");

    try {
      // Dynamically import html-to-image to keep initial bundle lean
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
        // Ensure we capture the full card including shadows
        style: {
          borderRadius: "0",
          overflow: "visible",
        },
        filter: (node) => {
          // Skip elements that cause export issues
          const el = node as HTMLElement;
          if (el.tagName === "BUTTON") return false;
          return true;
        },
      });

      // Trigger download
      const link = document.createElement("a");
      const name = (config.nickname.trim() || "ghost").toLowerCase().replace(/\W+/g, "-");
      link.download = `talons-card-${name}-${config.characterClass}.png`;
      link.href = dataUrl;
      link.click();

      setState("success");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Export failed";
      setErrMsg(msg);
      setState("error");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState("idle"), 3000);
    }
  };

  const stateConfig = {
    idle: {
      icon: <Download size={15} />,
      label: "Export Card  →  PNG",
      extra: "3× retina · transparent stamp",
    },
    loading: {
      icon: <Loader2 size={15} className="animate-spin" />,
      label: "Rendering…",
      extra: "Please wait",
    },
    success: {
      icon: <CheckCircle size={15} />,
      label: "Exported!",
      extra: "Saved to downloads",
    },
    error: {
      icon: <AlertCircle size={15} />,
      label: "Export failed",
      extra: errMsg || "Try again",
    },
  }[state];

  return (
    <div className="space-y-2">
      <motion.button
        onClick={handleExport}
        disabled={state === "loading"}
        className="w-full flex items-center justify-center gap-3 py-3 px-6 font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200 relative overflow-hidden cursor-pointer disabled:cursor-not-allowed focus:outline-none"
        style={{
          background:
            state === "error"
              ? "rgba(255, 60, 60, 0.1)"
              : state === "success"
              ? "rgba(0, 255, 80, 0.1)"
              : theme.accentFaint,
          border: `1px solid ${
            state === "error" ? "#ff3c3c" : state === "success" ? "#00ff50" : theme.accent
          }`,
          color: state === "error" ? "#ff3c3c" : state === "success" ? "#00ff50" : theme.accent,
          boxShadow:
            state === "idle"
              ? `0 0 20px ${theme.accentFaint}, inset 0 0 20px ${theme.accentFaint}`
              : "none",
          clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
        }}
        whileHover={state === "idle" ? { scale: 1.01 } : {}}
        whileTap={state === "idle" ? { scale: 0.99 } : {}}
      >
        {/* Shimmer */}
        {state === "idle" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${theme.accentFaint} 50%, transparent 60%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />
        )}
        <span className="relative flex items-center gap-2">
          {stateConfig.icon}
          {stateConfig.label}
        </span>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-[10px] font-mono opacity-40"
          style={{ color: theme.accent }}
        >
          {stateConfig.extra}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
