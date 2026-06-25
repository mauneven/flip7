"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import type { GameState } from "@/lib/types";
import { MIN_PLAYERS, type GameActions } from "@/lib/useGame";
import { Menu } from "./Menu";

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
  const draftName = draft.trim().toLowerCase();
  const draftIsDuplicate = draftName !== "" && names.includes(draftName);
  const canStart =
    state.players.length >= MIN_PLAYERS &&
    state.players.every((p) => p.name.trim().length > 0) &&
    !hasDuplicate;

  const addDraft = () => {
    const name = draft.trim();
    if (!name || draftIsDuplicate) return;
    actions.addPlayer(name);
    setDraft("");
  };

  return (
    <div className="mx-auto flex min-h-[100svh] w-full max-w-lg flex-col px-4 pb-10 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-black tracking-tight sm:text-5xl">
            FLIP <span className="text-accent">7</span>
          </h1>
          <p className="text-sm font-medium text-faint">{t("app.subtitle")}</p>
        </div>
        <Menu />
      </header>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-7 rounded-3xl border border-line/10 bg-surface p-5 shadow-sm"
      >
        <h2 className="font-serif text-2xl font-bold">{t("setup.title")}</h2>

        {/* Players */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              {t("setup.players")}
            </label>
            <span className="tabular text-xs font-bold text-faint">
              {state.players.length}
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
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-line/10 text-sm font-black text-muted">
                    {i + 1}
                  </span>
                  <input
                    value={p.name}
                    onChange={(e) => actions.renamePlayer(p.id, e.target.value)}
                    placeholder={t("setup.playerName")}
                    className="min-w-0 flex-1 rounded-xl border border-line/10 bg-line/5 px-3 py-2.5 text-base font-semibold text-text outline-none transition placeholder:text-faint focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => actions.removePlayer(p.id)}
                    aria-label="remove"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-line/5 text-faint transition hover:bg-line/10 hover:text-text"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex items-center gap-2 pt-1">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-line/5 text-faint">
                +
              </span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addDraft();
                }}
                placeholder={t("setup.playerName")}
                className={[
                  "min-w-0 flex-1 rounded-xl border border-dashed bg-transparent px-3 py-2.5 text-base font-semibold text-text outline-none transition placeholder:text-faint",
                  draftIsDuplicate ? "border-gold/60" : "border-line/20 focus:border-accent",
                ].join(" ")}
              />
              <button
                type="button"
                onClick={addDraft}
                disabled={!draft.trim() || draftIsDuplicate}
                className="shrink-0 rounded-xl bg-line/10 px-3 py-2.5 text-sm font-black text-text transition hover:bg-line/20 disabled:opacity-30"
              >
                {t("setup.add")}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[0.7rem]">
            {draftIsDuplicate ? (
              <span className="font-semibold text-gold">{t("setup.dupAdd")}</span>
            ) : (
              <span className="text-faint">{t("setup.maxRec")}</span>
            )}
          </p>
        </div>

        {/* Score goal */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-muted">
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
              className="tabular w-24 rounded-xl border border-line/10 bg-line/5 px-3 py-2.5 text-lg font-black text-text outline-none focus:border-accent"
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
                      ? "bg-accent text-on-accent"
                      : "bg-line/10 text-muted hover:bg-line/20",
                  ].join(" ")}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 text-xs text-faint">{t("setup.goalHint")}</p>
        </div>

        {/* Start */}
        <div className="mt-6">
          <button
            type="button"
            onClick={actions.start}
            disabled={!canStart}
            className="w-full rounded-2xl bg-accent px-5 py-4 text-base font-black text-on-accent shadow-sm transition hover:bg-accent-press active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
          >
            {t("setup.start")}
          </button>
          <p className="mt-2 h-4 text-center text-xs font-semibold text-gold">
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
