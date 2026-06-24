"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/lang";
import { playerTotal } from "@/lib/scoring";
import type { Player, RoundResult } from "@/lib/types";

interface PlayerEditorProps {
  player: Player;
  onEdit: (roundIndex: number, result: RoundResult) => void;
  onClose: () => void;
}

export function PlayerEditor({ player, onEdit, onClose }: PlayerEditorProps) {
  const { t } = useT();
  const total = playerTotal(player);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: "100%", opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.5 }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line/10 bg-surface shadow-2xl sm:rounded-3xl"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Header */}
        <div className="shrink-0 px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-faint">
                {t("edit.title")}
              </p>
              <h2 className="text-xl font-black leading-tight">{player.name}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("edit.done")}
              className="grid h-9 w-9 place-items-center rounded-full bg-line/10 text-lg text-muted transition hover:bg-line/20"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-faint">{t("edit.hint")}</p>
        </div>

        {/* Rounds list */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-line/10 px-5 py-4">
          {player.rounds.length === 0 ? (
            <p className="py-8 text-center text-sm text-faint">{t("edit.empty")}</p>
          ) : (
            <div className="space-y-2">
              {player.rounds.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-line/10 bg-line/5 px-3 py-2"
                >
                  <span className="tabular w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-muted">
                    {t("board.round", { n: i + 1 })}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={r.busted ? 0 : r.score}
                    disabled={r.busted}
                    onChange={(e) =>
                      onEdit(i, {
                        score: Math.max(0, parseInt(e.target.value || "0", 10) || 0),
                        busted: false,
                      })
                    }
                    className="tabular w-20 rounded-lg border border-line/10 bg-surface px-2.5 py-2 text-base font-black text-text outline-none focus:border-accent disabled:opacity-40"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onEdit(i, { score: 0, busted: !r.busted })
                    }
                    className={[
                      "ml-auto shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition",
                      r.busted
                        ? "bg-red-500/15 text-red-400 ring-1 ring-red-500/40"
                        : "bg-line/10 text-muted hover:bg-line/20",
                    ].join(" ")}
                  >
                    ❄️ {t("edit.lost")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: total + done */}
        <div className="shrink-0 border-t border-line/10 bg-line/5 px-5 pb-4 pt-3">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-faint">
              {t("edit.total")}
            </span>
            <span className="tabular text-3xl font-black text-text">{total}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-black text-on-accent shadow-sm transition hover:bg-accent-press active:scale-[0.99]"
          >
            {t("edit.done")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
