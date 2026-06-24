"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import type { GameActions } from "@/lib/useGame";
import { getStandings, getWinners } from "@/lib/scoring";

const CONFETTI_COLORS = ["#d3774f", "#d1a24a", "#e7e0d4", "#be5a3c", "#a8a296"];
const MEDALS = ["🥇", "🥈", "🥉"];
const PEDESTAL: Record<number, string> = { 1: "h-28", 2: "h-20", 3: "h-14" };

interface WinCelebrationProps {
  state: GameState;
  actions: GameActions;
}

export function WinCelebration({ state, actions }: WinCelebrationProps) {
  const { t } = useT();
  const standings = getStandings(state);
  const winners = getWinners(state);
  const isTie = winners.length > 1;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: reduce)").matches;
    if (reduce) return;

    confetti({
      particleCount: 130,
      spread: 95,
      startVelocity: 42,
      origin: { y: 0.35 },
      colors: CONFETTI_COLORS,
    });

    let active = true;
    const end = Date.now() + 1500;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 65, origin: { x: 0, y: 0.7 }, colors: CONFETTI_COLORS });
      confetti({ particleCount: 3, angle: 120, spread: 65, origin: { x: 1, y: 0.7 }, colors: CONFETTI_COLORS });
      if (active && Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    return () => {
      active = false;
    };
  }, []);

  const top = standings.slice(0, 3);
  const podiumOrder =
    top.length === 3 ? [top[1], top[0], top[2]] : top.length === 2 ? [top[1], top[0]] : top;

  const headline = isTie
    ? t("win.tieNames", { names: winners.map((w) => w.name).join(" & ") })
    : t("win.winner", { name: winners[0]?.name ?? "" });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-bg"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(900px 520px at 50% -8%, rgb(var(--gold) / 0.16), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-lg flex-col items-center px-4 py-8">
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
          className="text-7xl"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-3 text-center font-serif text-4xl font-black sm:text-5xl"
        >
          {isTie ? t("win.tie") : headline}
        </motion.h1>
        {isTie && (
          <p className="mt-1 text-center font-serif text-xl font-bold text-gold">
            {headline}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold text-faint">
          {t("win.subtitle", { goal: state.scoreGoal })}
        </p>

        {/* Podium */}
        <div className="mt-7 flex w-full items-end justify-center gap-2.5">
          {podiumOrder.map((s, i) => (
            <motion.div
              key={s.player.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.1, type: "spring", stiffness: 260, damping: 22 }}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div className="text-2xl">{MEDALS[s.rank - 1] ?? ""}</div>
              <div className="mb-1.5 w-full truncate px-1 text-center text-sm font-black">
                {s.player.name}
              </div>
              <div
                className={[
                  "flex w-full items-start justify-center rounded-t-xl pt-2",
                  PEDESTAL[s.rank] ?? "h-12",
                  s.rank === 1 ? "bg-gold text-bg" : "bg-surface2 text-text",
                ].join(" ")}
              >
                <span className="tabular text-lg font-black">{s.total}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full standings */}
        <div className="mt-7 w-full">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-faint">
            {t("win.standings")}
          </h2>
          <div className="space-y-1.5">
            {standings.map((s) => (
              <div
                key={s.player.id}
                className={[
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5",
                  s.isWinner
                    ? "border-gold/30 bg-gold/8"
                    : "border-line/10 bg-surface",
                ].join(" ")}
              >
                <span className="tabular w-6 text-center text-sm font-black text-muted">
                  {s.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-black">
                  {s.player.name}
                  {s.isWinner && " 👑"}
                </span>
                <span className="text-[0.7rem] text-faint">
                  {t("win.rounds", { n: s.player.rounds.length })}
                </span>
                <span className="tabular text-lg font-black">{s.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 grid w-full gap-2.5">
          <button
            type="button"
            onClick={actions.newGame}
            className="w-full rounded-2xl bg-accent px-5 py-4 text-base font-black text-on-accent shadow-sm transition hover:bg-accent-press active:scale-[0.99]"
          >
            {t("win.newGame")}
          </button>
          <button
            type="button"
            onClick={actions.continueGame}
            className="w-full rounded-2xl bg-line/10 px-5 py-3.5 text-sm font-bold text-muted transition hover:bg-line/20 active:scale-[0.99]"
          >
            {t("win.continue")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
