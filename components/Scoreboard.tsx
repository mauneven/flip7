"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import type { GameActions } from "@/lib/useGame";
import { getStandings, someoneReachedGoal } from "@/lib/scoring";
import { Menu } from "./Menu";

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
  const leaderName =
    standings.find((s) => s.isWinner)?.player.name ?? standings[0]?.player.name;
  const hasScores = state.players.some((p) => p.rounds.length > 0);
  const lead = standings.length >= 2 ? standings[0].total - standings[1].total : 0;

  const confirmNewGame = () => {
    if (window.confirm(t("board.resetConfirm"))) actions.newGame();
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-32 pt-5">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="whitespace-nowrap text-2xl font-black tracking-tight">
            FLIP <span className="text-accent">7</span>
          </h1>
          <Menu onNewGame={confirmNewGame} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="tabular rounded-full bg-line/10 px-3 py-1 text-xs font-bold text-muted">
            {t("board.round", { n: state.roundNumber })}
          </span>
          <span className="tabular rounded-full bg-line/10 px-3 py-1 text-xs font-bold text-muted">
            {t("board.goal", { n: state.scoreGoal })}
          </span>
        </div>
      </header>

      {/* Goal reached banner (after "continue") */}
      <AnimatePresence>
        {reached && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3"
          >
            <p className="text-sm font-bold text-text">
              {t("board.goalBanner", {
                name: leaderName ?? "",
                goal: state.scoreGoal,
              })}
            </p>
            <button
              type="button"
              onClick={actions.endGame}
              className="shrink-0 rounded-lg bg-gold px-3 py-1.5 text-xs font-black text-bg transition hover:opacity-90"
            >
              {t("board.endGame")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standings */}
      <div className="mt-5 space-y-2.5">
        {!hasScores && (
          <p className="rounded-2xl border border-dashed border-line/15 px-4 py-8 text-center text-sm text-faint">
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
                "rounded-2xl border bg-surface p-3.5",
                s.isWinner
                  ? "border-gold/40 bg-gold/5"
                  : isLeader
                    ? "border-accent/30"
                    : "border-line/10",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-line/10 text-lg font-black">
                  {s.rank <= 3 && s.total > 0 ? (
                    <span>{MEDALS[s.rank - 1]}</span>
                  ) : (
                    <span className="tabular text-muted">{s.rank}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-black">
                      {s.player.name}
                    </h3>
                    {s.isWinner && <span className="text-sm">👑</span>}
                    {!s.isWinner && s.reachedGoal && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[0.65rem] font-bold text-gold">
                        {t("board.reached")}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-line/10">
                    <motion.div
                      className={[
                        "h-full rounded-full",
                        s.reachedGoal ? "bg-gold" : "bg-accent",
                      ].join(" ")}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    />
                  </div>

                  {isLeader && standings.length >= 2 && (
                    <p className="mt-1 text-[0.7rem] font-semibold text-muted">
                      {lead > 0 ? t("board.you", { n: lead }) : t("board.tiedTop")}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-right">
                  <div className="tabular text-2xl font-black leading-none">
                    {s.total}
                  </div>
                  <div className="text-[0.65rem] font-semibold uppercase text-faint">
                    {t("board.pts")}
                  </div>
                </div>
              </div>

              {s.player.rounds.length > 0 && (
                <div className="no-scrollbar mt-2.5 flex gap-1 overflow-x-auto">
                  {s.player.rounds.map((r, ri) => (
                    <span
                      key={ri}
                      className="tabular shrink-0 rounded-md bg-line/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-muted"
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
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg/85 to-transparent pb-[max(env(safe-area-inset-bottom),1rem)] pt-8">
        <div className="mx-auto w-full max-w-lg px-4">
          <button
            type="button"
            onClick={onEnterRound}
            className="pointer-events-auto w-full rounded-2xl bg-accent px-5 py-4 text-base font-black text-on-accent shadow-lg shadow-accent/20 transition hover:bg-accent-press active:scale-[0.99]"
          >
            {t("board.enterRound", { n: state.roundNumber })}
          </button>
        </div>
      </div>
    </div>
  );
}
