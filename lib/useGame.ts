"use client";

import { useCallback, useEffect, useReducer, useState } from "react";
import type { GameState, Player, RoundResult } from "./types";
import { someoneReachedGoal } from "./scoring";

const STORAGE_KEY = "flip7-game";
const DEFAULT_GOAL = 200;
export const MIN_PLAYERS = 2;
/** Soft recommendation surfaced in the UI; the real number is unlimited. */
export const RECOMMENDED_PLAYERS = 12;

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
  | { type: "COMMIT_ROUND"; results: Record<string, RoundResult> }
  | { type: "EDIT_ROUND"; playerId: string; roundIndex: number; result: RoundResult }
  | { type: "CONTINUE" }
  | { type: "END_GAME" }
  | { type: "NEW_GAME" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ADD_PLAYER":
      return { ...state, players: [...state.players, newPlayer(action.name)] };

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
        rounds: [...p.rounds, action.results[p.id] ?? { score: 0, busted: false }],
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

    case "EDIT_ROUND": {
      return {
        ...state,
        players: state.players.map((p) => {
          if (p.id !== action.playerId) return p;
          if (action.roundIndex < 0 || action.roundIndex >= p.rounds.length) return p;
          const rounds = p.rounds.map((r, i) =>
            i === action.roundIndex ? action.result : r,
          );
          return { ...p, rounds };
        }),
      };
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

/** Accepts older saved games (rounds as number[]) and upgrades them. */
function migrate(raw: unknown): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Partial<GameState> & { players?: unknown };
  const phase = s.phase;
  const goal = s.scoreGoal;
  const roundNumber = s.roundNumber;
  if (
    (phase !== "setup" && phase !== "playing" && phase !== "finished") ||
    !Array.isArray(s.players) ||
    typeof goal !== "number" ||
    typeof roundNumber !== "number"
  ) {
    return null;
  }
  const players: Player[] = (s.players as unknown[]).map((pp) => {
    const p = pp as { id?: string; name?: string; rounds?: unknown[] };
    const rounds: RoundResult[] = Array.isArray(p.rounds)
      ? p.rounds.map((r) =>
          typeof r === "number"
            ? { score: r, busted: false }
            : {
                score: Number((r as RoundResult)?.score) || 0,
                busted: Boolean((r as RoundResult)?.busted),
                basics:
                  typeof (r as RoundResult)?.basics === "number"
                    ? (r as RoundResult).basics
                    : undefined,
              },
        )
      : [];
    return { id: String(p.id ?? makeId()), name: String(p.name ?? ""), rounds };
  });
  return {
    phase,
    players,
    scoreGoal: goal,
    roundNumber,
    winnerAcknowledged: Boolean(s.winnerAcknowledged),
  };
}

export interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  renamePlayer: (id: string, name: string) => void;
  setGoal: (goal: number) => void;
  start: () => void;
  commitRound: (results: Record<string, RoundResult>) => void;
  editRound: (playerId: string, roundIndex: number, result: RoundResult) => void;
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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const migrated = migrate(JSON.parse(raw));
        if (migrated) dispatch({ type: "HYDRATE", state: migrated });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

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
      (results: Record<string, RoundResult>) =>
        dispatch({ type: "COMMIT_ROUND", results }),
      [],
    ),
    editRound: useCallback(
      (playerId: string, roundIndex: number, result: RoundResult) =>
        dispatch({ type: "EDIT_ROUND", playerId, roundIndex, result }),
      [],
    ),
    continueGame: useCallback(() => dispatch({ type: "CONTINUE" }), []),
    endGame: useCallback(() => dispatch({ type: "END_GAME" }), []),
    newGame: useCallback(() => dispatch({ type: "NEW_GAME" }), []),
  };

  return { state, hydrated, actions };
}
