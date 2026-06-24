"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "@/lib/lang";
import { computeBreakdown, emptySelection } from "@/lib/scoring";
import type { Player, RoundSelection } from "@/lib/types";
import { CardSelector } from "./CardSelector";

interface RoundEntryProps {
  players: Player[];
  roundNumber: number;
  onCommit: (scores: Record<string, number>) => void;
  onCancel: () => void;
}

export function RoundEntry({
  players,
  roundNumber,
  onCommit,
  onCancel,
}: RoundEntryProps) {
  const { t } = useT();
  const [index, setIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, RoundSelection>>({});

  const current = players[index];
  const sel = selections[current.id] ?? emptySelection();
  const breakdown = useMemo(() => computeBreakdown(sel), [sel]);
  const isLast = index === players.length - 1;

  const totalFor = (id: string) =>
    computeBreakdown(selections[id] ?? emptySelection()).total;
  const entered = (id: string, i: number) => i < index || id in selections;

  const setSel = (next: RoundSelection) =>
    setSelections((prev) => ({ ...prev, [current.id]: next }));

  const goNext = () => {
    if (isLast) {
      const scores: Record<string, number> = {};
      players.forEach((p) => {
        scores[p.id] = computeBreakdown(selections[p.id] ?? emptySelection()).total;
      });
      onCommit(scores);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const goBack = () => (index === 0 ? onCancel() : setIndex((i) => i - 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-end justify-center sm:items-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      <motion.div
        initial={{ y: "100%", opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.5 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line/10 bg-surface shadow-2xl sm:rounded-3xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-faint">
              {t("round.title", { n: roundNumber })}
            </p>
            <h2 className="text-xl font-black leading-tight">{current.name}</h2>
            <p className="text-xs text-faint">
              {t("round.player", { i: index + 1, total: players.length })}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={t("round.cancel")}
            className="grid h-9 w-9 place-items-center rounded-full bg-line/10 text-lg text-muted transition hover:bg-line/20"
          >
            ✕
          </button>
        </div>

        {/* Player progress chips */}
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto px-5">
          {players.map((p, i) => {
            const isCurrent = i === index;
            const done = entered(p.id, i);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setIndex(i)}
                className={[
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition",
                  isCurrent
                    ? "bg-accent text-on-accent"
                    : done
                      ? "bg-line/15 text-text"
                      : "bg-line/5 text-faint",
                ].join(" ")}
              >
                <span className="max-w-[7rem] truncate">{p.name}</span>
                {done && !isCurrent && (
                  <span className="tabular rounded-full bg-line/20 px-1.5 text-[0.65rem]">
                    {totalFor(p.id)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Card selection (scrolls) */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <CardSelector selection={sel} onChange={setSel} />
        </div>

        {/* Live breakdown + actions */}
        <div className="border-t border-line/10 bg-line/5 px-5 pb-4 pt-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-muted">
              <span className="tabular rounded-md bg-line/10 px-2 py-0.5">
                {breakdown.basicSum}
              </span>
              {breakdown.isFlip7 && (
                <span className="tabular rounded-md bg-gold/15 px-2 py-0.5 text-gold">
                  +{breakdown.flip7Bonus}
                </span>
              )}
              {breakdown.modifierSum > 0 && (
                <span className="tabular rounded-md bg-line/10 px-2 py-0.5">
                  +{breakdown.modifierSum}
                </span>
              )}
              {breakdown.x2Applied && (
                <span className="rounded-md bg-text px-2 py-0.5 text-bg">×2</span>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs uppercase tracking-wide text-faint">
                {t("round.total")}
              </span>
              <motion.span
                key={breakdown.total}
                initial={{ scale: 0.6, opacity: 0, y: 4 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="tabular min-w-[2ch] text-right text-3xl font-black text-text"
              >
                {breakdown.total}
              </motion.span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl bg-line/10 px-4 py-3 text-sm font-bold text-muted transition hover:bg-line/20"
            >
              {index === 0 ? t("round.cancel") : t("round.back")}
            </button>
            <button
              type="button"
              onClick={() => setSel(emptySelection())}
              className="rounded-xl bg-line/10 px-4 py-3 text-sm font-bold text-faint transition hover:bg-line/20"
            >
              {t("round.clear")}
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-black text-on-accent shadow-sm transition hover:bg-accent-press active:scale-[0.98]"
            >
              {isLast ? t("round.finish") : t("round.next")}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
