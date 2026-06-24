"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import { MenuIcon, RefreshIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface MenuProps {
  /** When provided, a "New game" action is shown at the top of the menu. */
  onNewGame?: () => void;
}

export function Menu({ onNewGame }: MenuProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("board.menu")}
        className="grid h-9 w-9 place-items-center rounded-full bg-line/10 text-text transition hover:bg-line/20"
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-2xl border border-line/10 bg-surface p-2 shadow-2xl shadow-black/20"
          >
            {onNewGame && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onNewGame();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-extrabold text-text transition hover:bg-line/10"
                >
                  <RefreshIcon className="h-4 w-4 text-muted" />
                  {t("board.newGame")}
                </button>
                <div className="my-2 h-px bg-line/10" />
              </>
            )}

            <div className="px-1 pb-2">
              <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-faint">
                {t("menu.theme")}
              </p>
              <ThemeToggle />
            </div>

            <div className="px-1 pb-1 pt-1">
              <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-faint">
                {t("menu.language")}
              </p>
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
