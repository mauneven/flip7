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
  /** Basic-card sum after the x2 multiplier (x2 only doubles the number cards). */
  multipliedBasics: number;
  x2Applied: boolean;
  /** multipliedBasics + flip7Bonus + modifierSum. */
  total: number;
}

export function emptySelection(): RoundSelection {
  return { basics: [], modifiers: [], x2: false };
}

/**
 * Scores a single round following the FLIP7 house rules, in order:
 *   1. sum the basic card face values
 *   2. double the basic-card sum if the x2 card was flipped
 *   3. add +15 if the player collected 7 basic cards (Flip 7 bonus)
 *   4. add the +2..+10 bonus cards on top
 * i.e. total = (basics × x2) + flip7Bonus + bonusCards.
 */
export function computeBreakdown(sel: RoundSelection): ScoreBreakdown {
  const basicSum = sel.basics.reduce((a, b) => a + b, 0);
  const isFlip7 = sel.basics.length >= FLIP7_COUNT;
  const flip7Bonus = isFlip7 ? FLIP7_BONUS : 0;
  const modifierSum = sel.modifiers.reduce((a, b) => a + b, 0);
  const multipliedBasics = sel.x2 ? basicSum * 2 : basicSum;
  const total = multipliedBasics + flip7Bonus + modifierSum;
  return {
    basicSum,
    isFlip7,
    flip7Bonus,
    modifierSum,
    multipliedBasics,
    x2Applied: sel.x2,
    total,
  };
}

export function playerTotal(player: Player): number {
  return player.rounds.reduce((a, r) => a + r.score, 0);
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

export interface GameStats {
  bestRound: { name: string; score: number; round: number } | null;
  mostConsistent: { name: string; avg: number } | null;
  mostCards: { name: string; count: number } | null;
  mostZeros: { name: string; count: number } | null;
  roundsPlayed: number;
}

/** Fun "memorable moments" computed from the recorded rounds. */
export function getGameStats(state: GameState): GameStats {
  let bestRound: GameStats["bestRound"] = null;
  let mostConsistent: GameStats["mostConsistent"] = null;
  let mostCards: GameStats["mostCards"] = null;
  let mostZeros: GameStats["mostZeros"] = null;
  let roundsPlayed = 0;

  for (const p of state.players) {
    roundsPlayed = Math.max(roundsPlayed, p.rounds.length);

    p.rounds.forEach((r, i) => {
      if (r.score > 0 && (!bestRound || r.score > bestRound.score)) {
        bestRound = { name: p.name, score: r.score, round: i + 1 };
      }
    });

    if (p.rounds.length > 0) {
      const avg = Math.round(playerTotal(p) / p.rounds.length);
      if (!mostConsistent || avg > mostConsistent.avg) {
        mostConsistent = { name: p.name, avg };
      }
    }

    // most number cards collected across the game (when card counts are known)
    const cards = p.rounds.reduce((a, r) => a + (r.basics ?? 0), 0);
    if (cards > 0 && (!mostCards || cards > mostCards.count)) {
      mostCards = { name: p.name, count: cards };
    }

    // most zero-point rounds (busts and any 0 round)
    const zeros = p.rounds.filter((r) => r.score === 0).length;
    if (zeros > 0 && (!mostZeros || zeros > mostZeros.count)) {
      mostZeros = { name: p.name, count: zeros };
    }
  }

  return { bestRound, mostConsistent, mostCards, mostZeros, roundsPlayed };
}
