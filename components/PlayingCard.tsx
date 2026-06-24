"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type CardVariant = "number" | "bonus" | "x2";

export interface PlayingCardProps {
  label: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: CardVariant;
  corner?: boolean;
  size?: "sm" | "md";
  ariaLabel?: string;
}

const TEXT_SIZE: Record<NonNullable<PlayingCardProps["size"]>, string> = {
  sm: "text-base rounded-lg",
  md: "text-2xl sm:text-[1.7rem] rounded-xl",
};

export function PlayingCard({
  label,
  selected = false,
  onClick,
  variant = "number",
  corner = false,
  size = "md",
  ariaLabel,
}: PlayingCardProps) {
  const interactive = typeof onClick === "function";

  const selectedClasses =
    variant === "x2"
      ? "bg-text text-bg border-text shadow-lg"
      : "bg-accent text-on-accent border-accent shadow-lg shadow-accent/20";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!interactive}
      aria-pressed={interactive ? selected : undefined}
      aria-label={ariaLabel}
      whileTap={interactive ? { scale: 0.9 } : undefined}
      animate={{ y: selected ? -3 : 0 }}
      transition={{ type: "spring", stiffness: 520, damping: 26 }}
      className={[
        "relative grid aspect-[5/7] w-full select-none place-items-center border font-black",
        TEXT_SIZE[size],
        selected
          ? selectedClasses
          : "border-line/10 bg-surface2 text-faint",
        interactive ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
    >
      {corner && (
        <>
          <span className="absolute left-1 top-0.5 text-[0.6rem] font-extrabold leading-none opacity-60">
            {label}
          </span>
          <span className="absolute bottom-0.5 right-1 rotate-180 text-[0.6rem] font-extrabold leading-none opacity-60">
            {label}
          </span>
        </>
      )}
      <span>{label}</span>
    </motion.button>
  );
}
