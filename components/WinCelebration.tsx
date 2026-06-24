"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import type { GameActions } from "@/lib/useGame";
import { getStandings, getWinners } from "@/lib/scoring";

const CONFETTI_COLORS = ["#a78bfa", "#f472b6", "#f59e0b", "#34d399", "#38bdf8"];
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
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    confetti({
      particleCount: 140,
      spread: 100,
      startVelocity: 45,
      origin: { y: 0.35 },
      colors: CONFETTI_COLORS,
    });

    let active = true;
    const end = Date.now() + 1800;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: CONFETTI_COLORS,
      });
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
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div
        className="absolute inset-0 bg-[#0a0712]"
        style={{
          backgroundImage:
            "radial-gradient(900px 520px at 50% -8%, rgba(245,158,11,0.20), transparent 60%), radial-gradient(820px 520px at 50% 118%, rgba(168,85,247,0.16), transparent 60%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-lg flex-col items-center px-4 py-8">
        <motion.div
          initial={{ scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.05 }}
          className="text-7xl drop-shadow-[0_8px_24px_rgba(245,158,11,0.45)]"
        >
          🏆
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="brand-shimmer animate-shimmer mt-3 text-center text-3xl font-black sm:text-4xl"
        >
          {isTie ? t("win.tie") : headline}
        </motion.h1>
        {isTie && (
          <p className="mt-1 text-center text-lg font-black text-white">
            {headline}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold text-white/50">
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
                  s.rank === 1
                    ? "bg-gradient-to-b from-amber-400 to-amber-600"
                    : s.rank === 2
                      ? "bg-gradient-to-b from-slate-300 to-slate-500"
                      : "bg-gradient-to-b from-orange-400 to-orange-700",
                ].join(" ")}
              >
                <span className="tabular text-lg font-black text-black/80">
                  {s.total}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full standings */}
        <div className="mt-7 w-full">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            {t("win.standings")}
          </h2>
          <div className="space-y-1.5">
            {standings.map((s) => (
              <div
                key={s.player.id}
                className={[
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5",
                  s.isWinner ? "bg-amber-400/15 ring-1 ring-amber-300/40" : "glass",
                ].join(" ")}
              >
                <span className="tabular w-6 text-center text-sm font-black text-white/50">
                  {s.rank}
                </span>
                <span className="min-w-0 flex-1 truncate font-black">
                  {s.player.name}
                  {s.isWinner && " 👑"}
                </span>
                <span className="text-[0.7rem] text-white/35">
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
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-4 text-base font-black text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110 active:scale-[0.99]"
          >
            {t("win.newGame")}
          </button>
          <button
            type="button"
            onClick={actions.continueGame}
            className="w-full rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-bold text-white/80 transition hover:bg-white/20 active:scale-[0.99]"
          >
            {t("win.continue")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
