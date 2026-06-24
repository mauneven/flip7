"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export interface PlayingCardProps {
  label: ReactNode;
  gradient: string;
  selected?: boolean;
  onClick?: () => void;
  corner?: boolean;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
  className?: string;
}

const SIZE: Record<NonNullable<PlayingCardProps["size"]>, string> = {
  sm: "rounded-lg text-lg",
  md: "rounded-xl text-2xl sm:text-3xl",
  lg: "rounded-2xl text-4xl",
};

export function PlayingCard({
  label,
  gradient,
  selected = false,
  onClick,
  corner = false,
  size = "md",
  ariaLabel,
  className = "",
}: PlayingCardProps) {
  const interactive = typeof onClick === "function";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      aria-label={ariaLabel}
      whileTap={interactive ? { scale: 0.88 } : undefined}
      animate={{
        scale: selected ? 1 : interactive ? 0.97 : 1,
        y: selected ? -3 : 0,
      }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      className={[
        "relative aspect-[5/7] w-full select-none overflow-hidden",
        "bg-gradient-to-br font-black text-white",
        gradient,
        SIZE[size],
        "shadow-lg",
        selected
          ? "ring-2 ring-white/90 shadow-black/40 brightness-110"
          : interactive
            ? "opacity-45 saturate-50 ring-1 ring-white/10"
            : "ring-1 ring-white/15",
        interactive ? "cursor-pointer" : "cursor-default",
        className,
      ].join(" ")}
    >
      {/* glossy highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] bg-gradient-to-b from-white/30 to-transparent" />

      {corner && (
        <>
          <span className="absolute left-1 top-0.5 text-[0.6rem] font-extrabold leading-none opacity-90 drop-shadow">
            {label}
          </span>
          <span className="absolute bottom-0.5 right-1 rotate-180 text-[0.6rem] font-extrabold leading-none opacity-90 drop-shadow">
            {label}
          </span>
        </>
      )}

      <span className="absolute inset-0 grid place-items-center drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">
        {label}
      </span>

      {selected && (
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 18 }}
          className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[0.7rem] font-black text-emerald-600 shadow"
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}
