"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import { MAX_PLAYERS, MIN_PLAYERS, type GameActions } from "@/lib/useGame";
import { LanguageSwitcher } from "./LanguageSwitcher";

const GOAL_PRESETS = [100, 150, 200, 250];

interface SetupScreenProps {
  state: GameState;
  actions: GameActions;
}

export function SetupScreen({ state, actions }: SetupScreenProps) {
  const { t } = useT();
  const [draft, setDraft] = useState("");

  const names = state.players.map((p) => p.name.trim().toLowerCase());
  const hasDuplicate = names.some((n, i) => n && names.indexOf(n) !== i);
  const canStart =
    state.players.length >= MIN_PLAYERS &&
    state.players.every((p) => p.name.trim().length > 0) &&
    !hasDuplicate;

  const addDraft = () => {
    const name = draft.trim();
    if (!name || state.players.length >= MAX_PLAYERS) return;
    actions.addPlayer(name);
    setDraft("");
  };

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-lg flex-col px-4 pb-10 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="brand-shimmer animate-shimmer text-4xl font-black tracking-tight sm:text-5xl">
            FLIP 7
          </h1>
          <p className="text-sm font-semibold text-white/45">
            {t("app.subtitle")}
          </p>
        </div>
        <LanguageSwitcher />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass mt-7 rounded-3xl p-5 shadow-xl"
      >
        <h2 className="text-lg font-black">{t("setup.title")}</h2>

        {/* Players */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-white/55">
              {t("setup.players")}
            </label>
            <span className="tabular text-xs font-bold text-white/40">
              {state.players.length}/{MAX_PLAYERS}
            </span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {state.players.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, height: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-sm font-black text-white/70">
                    {i + 1}
                  </span>
                  <input
                    value={p.name}
                    onChange={(e) => actions.renamePlayer(p.id, e.target.value)}
                    placeholder={t("setup.playerName")}
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-base font-semibold text-white outline-none transition focus:border-violet-400/60 focus:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => actions.removePlayer(p.id)}
                    aria-label="remove"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-white/40 hover:bg-rose-500/20 hover:text-rose-300"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {state.players.length < MAX_PLAYERS && (
              <div className="flex items-center gap-2 pt-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-white/30">
                  +
                </span>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addDraft();
                  }}
                  placeholder={t("setup.playerName")}
                  className="min-w-0 flex-1 rounded-xl border border-dashed border-white/15 bg-transparent px-3 py-2.5 text-base font-semibold text-white outline-none transition focus:border-violet-400/60"
                />
                <button
                  type="button"
                  onClick={addDraft}
                  disabled={!draft.trim()}
                  className="shrink-0 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-black text-white disabled:opacity-30"
                >
                  {t("setup.add")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Score goal */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-white/55">
            {t("setup.goal")}
          </label>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={state.scoreGoal}
              onChange={(e) =>
                actions.setGoal(parseInt(e.target.value || "0", 10) || 1)
              }
              className="tabular w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-lg font-black text-white outline-none focus:border-violet-400/60 focus:bg-white/10"
            />
            <div className="flex flex-1 flex-wrap gap-1.5">
              {GOAL_PRESETS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => actions.setGoal(g)}
                  className={[
                    "tabular rounded-lg px-3 py-2 text-sm font-bold transition",
                    state.scoreGoal === g
                      ? "bg-violet-500 text-white"
                      : "bg-white/10 text-white/60 hover:bg-white/20",
                  ].join(" ")}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-white/40">{t("setup.goalHint")}</p>
        </div>

        {/* Start */}
        <div className="mt-6">
          <button
            type="button"
            onClick={actions.start}
            disabled={!canStart}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 px-5 py-4 text-base font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
          >
            {t("setup.start")}
          </button>
          <p className="mt-2 h-4 text-center text-xs font-semibold text-amber-300/80">
            {hasDuplicate
              ? t("setup.duplicate")
              : !canStart
                ? t("setup.minPlayers")
                : ""}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
