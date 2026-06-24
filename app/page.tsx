"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useGame } from "@/lib/useGame";
import { SetupScreen } from "@/components/SetupScreen";
import { Scoreboard } from "@/components/Scoreboard";
import { RoundEntry } from "@/components/RoundEntry";
import { WinCelebration } from "@/components/WinCelebration";

export default function Home() {
  const { state, hydrated, actions } = useGame();
  const [roundOpen, setRoundOpen] = useState(false);

  if (!hydrated) {
    return (
      <main className="grid min-h-[100svh] place-items-center">
        <h1 className="brand-shimmer animate-shimmer animate-pulse text-4xl font-black tracking-tight">
          FLIP 7
        </h1>
      </main>
    );
  }

  const handleCommit = (scores: Record<string, number>) => {
    actions.commitRound(scores);
    setRoundOpen(false);
  };

  return (
    <main className="relative min-h-[100svh]">
      {state.phase === "setup" && <SetupScreen state={state} actions={actions} />}

      {state.phase === "playing" && (
        <Scoreboard
          state={state}
          actions={actions}
          onEnterRound={() => setRoundOpen(true)}
        />
      )}

      <AnimatePresence>
        {roundOpen && state.phase === "playing" && (
          <RoundEntry
            players={state.players}
            roundNumber={state.roundNumber}
            onCommit={handleCommit}
            onCancel={() => setRoundOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state.phase === "finished" && (
          <WinCelebration state={state} actions={actions} />
        )}
      </AnimatePresence>
    </main>
  );
}
