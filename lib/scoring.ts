import type { GameState, Player, RoundSelection } from "./types";

export const BASIC_CARDS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export const MODIFIER_CARDS = [2, 4, 6, 8, 10] as const;

/** Number of distinct basic cards that triggers the "Flip 7" bonus. */
export const FLIP7_COUNT = 7;
/** Extra points awarded for hitting Flip 7. */
export const FLIP7_BONUS = 15;

export interface ScoreBreakdown {
  basicSum: number;
  isFlip7: boolean;
  flip7Bonus: number;
  modifierSum: number;
  /** basicSum + flip7Bonus + modifierSum, before the x2 multiplier. */
  subtotal: number;
  x2Applied: boolean;
  /** Final round score after applying x2 (if present). */
  total: number;
}

export function emptySelection(): RoundSelection {
  return { basics: [], modifiers: [], x2: false };
}

/**
 * Scores a single round following the FLIP7 house rules, in order:
 *   1. sum the basic card face values
 *   2. add +15 if the player collected 7 basic cards
 *   3. add the +2..+10 bonus cards
 *   4. finally, double everything if the x2 card was flipped
 */
export function computeBreakdown(sel: RoundSelection): ScoreBreakdown {
  const basicSum = sel.basics.reduce((a, b) => a + b, 0);
  const isFlip7 = sel.basics.length >= FLIP7_COUNT;
  const flip7Bonus = isFlip7 ? FLIP7_BONUS : 0;
  const modifierSum = sel.modifiers.reduce((a, b) => a + b, 0);
  const subtotal = basicSum + flip7Bonus + modifierSum;
  const total = sel.x2 ? subtotal * 2 : subtotal;
  return {
    basicSum,
    isFlip7,
    flip7Bonus,
    modifierSum,
    subtotal,
    x2Applied: sel.x2,
    total,
  };
}

export function playerTotal(player: Player): number {
  return player.rounds.reduce((a, b) => a + b, 0);
}

export interface Standing {
  player: Player;
  total: number;
  /** 1-based rank, ties share the same rank. */
  rank: number;
  reachedGoal: boolean;
  isWinner: boolean;
}

/**
 * Returns players sorted by total (desc). When at least one player has reached
 * the goal, the highest total is flagged as the winner (ties → multiple
 * winners). Winner status is only meaningful once a round has crossed the goal.
 */
export function getStandings(state: GameState): Standing[] {
  const ranked = [...state.players]
    .map((player) => ({ player, total: playerTotal(player) }))
    .sort((a, b) => b.total - a.total);

  const anyReached = ranked.some((r) => r.total >= state.scoreGoal);
  const topTotal = ranked.length > 0 ? ranked[0].total : 0;

  let lastTotal: number | null = null;
  let lastRank = 0;
  return ranked.map((r, i) => {
    const rank = lastTotal === r.total ? lastRank : i + 1;
    lastTotal = r.total;
    lastRank = rank;
    return {
      player: r.player,
      total: r.total,
      rank,
      reachedGoal: r.total >= state.scoreGoal,
      isWinner: anyReached && r.total === topTotal && topTotal >= state.scoreGoal,
    };
  });
}

export function getWinners(state: GameState): Player[] {
  return getStandings(state)
    .filter((s) => s.isWinner)
    .map((s) => s.player);
}

/** True when at least one player's total has crossed the goal. */
export function someoneReachedGoal(state: GameState): boolean {
  return state.players.some((p) => playerTotal(p) >= state.scoreGoal);
}
