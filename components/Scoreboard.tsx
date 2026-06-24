"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import type { GameActions } from "@/lib/useGame";
import { getStandings, someoneReachedGoal } from "@/lib/scoring";
import { LanguageSwitcher } from "./LanguageSwitcher";

const MEDALS = ["🥇", "🥈", "🥉"];

interface ScoreboardProps {
  state: GameState;
  actions: GameActions;
  onEnterRound: () => void;
}

export function Scoreboard({ state, actions, onEnterRound }: ScoreboardProps) {
  const { t } = useT();
  const standings = getStandings(state);
  const reached = someoneReachedGoal(state);
  const leaderName = standings.find((s) => s.isWinner)?.player.name ?? standings[0]?.player.name;
  const hasScores = state.players.some((p) => p.rounds.length > 0);

  const lead =
    standings.length >= 2 ? standings[0].total - standings[1].total : 0;

  const confirmNewGame = () => {
    if (window.confirm(t("board.resetConfirm"))) actions.newGame();
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-32 pt-5">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="brand-shimmer whitespace-nowrap text-2xl font-black tracking-tight">
            FLIP 7
          </h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={confirmNewGame}
              aria-label={t("board.newGame")}
              title={t("board.newGame")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full glass text-white/70 hover:text-white"
            >
              ⟳
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tabular rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            {t("board.round", { n: state.roundNumber })}
          </span>
          <span className="tabular rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            {t("board.goal", { n: state.scoreGoal })}
          </span>
        </div>
      </header>

      {/* Goal reached banner (only shown after "continue") */}
      <AnimatePresence>
        {reached && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 px-4 py-3 ring-1 ring-amber-300/30"
          >
            <p className="text-sm font-bold text-amber-100">
              {t("board.goalBanner", {
                name: leaderName ?? "",
                goal: state.scoreGoal,
              })}
            </p>
            <button
              type="button"
              onClick={actions.endGame}
              className="shrink-0 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-black text-amber-950 hover:brightness-110"
            >
              {t("board.endGame")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standings */}
      <div className="mt-5 space-y-2.5">
        {!hasScores && (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-white/40">
            {t("board.noScores")}
          </p>
        )}

        {standings.map((s, idx) => {
          const pct = Math.min(100, (s.total / state.scoreGoal) * 100);
          const isLeader = idx === 0 && s.total > 0;
          return (
            <motion.div
              key={s.player.id}
              layout
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className={[
                "relative overflow-hidden rounded-2xl p-3.5 ring-1 transition",
                s.isWinner
                  ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 ring-amber-300/50"
                  : isLeader
                    ? "glass ring-violet-400/30"
                    : "glass ring-white/5",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lg font-black">
                  {s.rank <= 3 && s.total > 0 ? (
                    <span>{MEDALS[s.rank - 1]}</span>
                  ) : (
                    <span className="tabular text-white/60">{s.rank}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-black">
                      {s.player.name}
                    </h3>
                    {s.isWinner && <span className="text-sm">👑</span>}
                    {!s.isWinner && s.reachedGoal && (
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-200">
                        {t("board.reached")}
                      </span>
                    )}
                  </div>

                  {/* progress bar */}
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className={[
                        "h-full rounded-full",
                        s.reachedGoal
                          ? "bg-gradient-to-r from-amber-400 to-pink-500"
                          : "bg-gradient-to-r from-violet-400 to-fuchsia-400",
                      ].join(" ")}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    />
                  </div>

                  {isLeader && standings.length >= 2 && (
                    <p className="mt-1 text-[0.7rem] font-semibold text-violet-200/70">
                      {lead > 0
                        ? t("board.you", { n: lead })
                        : t("board.tiedTop")}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <div className="tabular text-2xl font-black leading-none">
                    {s.total}
                  </div>
                  <div className="text-[0.65rem] font-semibold uppercase text-white/35">
                    {t("board.pts")}
                  </div>
                </div>
              </div>

              {/* rounds history */}
              {s.player.rounds.length > 0 && (
                <div className="no-scrollbar mt-2.5 flex gap-1 overflow-x-auto">
                  {s.player.rounds.map((r, ri) => (
                    <span
                      key={ri}
                      className="tabular shrink-0 rounded-md bg-black/30 px-1.5 py-0.5 text-[0.65rem] font-bold text-white/50"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating action: enter round */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0a0712] via-[#0a0712]/80 to-transparent pb-[max(env(safe-area-inset-bottom),1rem)] pt-8">
        <div className="mx-auto w-full max-w-lg px-4">
          <button
            type="button"
            onClick={onEnterRound}
            className="pointer-events-auto w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-4 text-base font-black text-white shadow-xl shadow-fuchsia-500/25 transition hover:brightness-110 active:scale-[0.99]"
          >
            {t("board.enterRound", { n: state.roundNumber })}
          </button>
        </div>
      </div>
    </div>
  );
}
