"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import type { GameState, Player } from "./types";
import { someoneReachedGoal } from "./scoring";

const STORAGE_KEY = "flip7-game";
const DEFAULT_GOAL = 200;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 12;

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* ignore */
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function initialState(): GameState {
  return {
    phase: "setup",
    players: [],
    scoreGoal: DEFAULT_GOAL,
    roundNumber: 1,
    winnerAcknowledged: false,
  };
}

function newPlayer(name: string): Player {
  return { id: makeId(), name, rounds: [] };
}

type Action =
  | { type: "HYDRATE"; state: GameState }
  | { type: "ADD_PLAYER"; name: string }
  | { type: "REMOVE_PLAYER"; id: string }
  | { type: "RENAME_PLAYER"; id: string; name: string }
  | { type: "SET_GOAL"; goal: number }
  | { type: "START" }
  | { type: "COMMIT_ROUND"; scores: Record<string, number> }
  | { type: "CONTINUE" }
  | { type: "END_GAME" }
  | { type: "NEW_GAME" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD_PLAYER": {
      if (state.players.length >= MAX_PLAYERS) return state;
      return { ...state, players: [...state.players, newPlayer(action.name)] };
    }

    case "REMOVE_PLAYER":
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };

    case "RENAME_PLAYER":
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p,
        ),
      };

    case "SET_GOAL":
      return { ...state, scoreGoal: Math.max(1, Math.round(action.goal)) };

    case "START": {
      if (state.players.length < MIN_PLAYERS) return state;
      return {
        ...state,
        phase: "playing",
        roundNumber: 1,
        winnerAcknowledged: false,
        players: state.players.map((p) => ({ ...p, rounds: [] })),
      };
    }

    case "COMMIT_ROUND": {
      const players = state.players.map((p) => ({
        ...p,
        rounds: [...p.rounds, action.scores[p.id] ?? 0],
      }));
      const next: GameState = {
        ...state,
        players,
        roundNumber: state.roundNumber + 1,
      };
      if (!state.winnerAcknowledged && someoneReachedGoal(next)) {
        return { ...next, phase: "finished" };
      }
      return next;
    }

    case "CONTINUE":
      return { ...state, phase: "playing", winnerAcknowledged: true };

    case "END_GAME":
      return { ...state, phase: "finished" };

    case "NEW_GAME":
      return {
        ...state,
        phase: "setup",
        roundNumber: 1,
        winnerAcknowledged: false,
        players: state.players.map((p) => ({ ...p, rounds: [] })),
      };

    default:
      return state;
  }
}

function isValid(state: unknown): state is GameState {
  if (!state || typeof state !== "object") return false;
  const s = state as Partial<GameState>;
  return (
    (s.phase === "setup" || s.phase === "playing" || s.phase === "finished") &&
    Array.isArray(s.players) &&
    typeof s.scoreGoal === "number" &&
    typeof s.roundNumber === "number"
  );
}

export interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  renamePlayer: (id: string, name: string) => void;
  setGoal: (goal: number) => void;
  start: () => void;
  commitRound: (scores: Record<string, number>) => void;
  continueGame: () => void;
  endGame: () => void;
  newGame: () => void;
}

export function useGame(): {
  state: GameState;
  hydrated: boolean;
  actions: GameActions;
} {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted game once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValid(parsed)) dispatch({ type: "HYDRATE", state: parsed });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  // Persist after hydration whenever state changes.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const actions: GameActions = {
    addPlayer: useCallback((name: string) => dispatch({ type: "ADD_PLAYER", name }), []),
    removePlayer: useCallback((id: string) => dispatch({ type: "REMOVE_PLAYER", id }), []),
    renamePlayer: useCallback(
      (id: string, name: string) => dispatch({ type: "RENAME_PLAYER", id, name }),
      [],
    ),
    setGoal: useCallback((goal: number) => dispatch({ type: "SET_GOAL", goal }), []),
    start: useCallback(() => dispatch({ type: "START" }), []),
    commitRound: useCallback(
      (scores: Record<string, number>) => dispatch({ type: "COMMIT_ROUND", scores }),
      [],
    ),
    continueGame: useCallback(() => dispatch({ type: "CONTINUE" }), []),
    endGame: useCallback(() => dispatch({ type: "END_GAME" }), []),
    newGame: useCallback(() => dispatch({ type: "NEW_GAME" }), []),
  };

  return { state, hydrated, actions };
}
