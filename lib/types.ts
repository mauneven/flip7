export type Lang = "en" | "es" | "fr";

export type GamePhase = "setup" | "playing" | "finished";

export interface Player {
  id: string;
  name: string;
  /** Score recorded for each completed round, in order. */
  rounds: number[];
}

/** The cards a single player flipped during one round. */
export interface RoundSelection {
  /** Unique basic-card face values, each in 0..12. */
  basics: number[];
  /** Bonus "add" cards, each one of 2,4,6,8,10. */
  modifiers: number[];
  /** Whether the x2 multiplier card was flipped. */
  x2: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  scoreGoal: number;
  /** 1-based number of the round currently being played. */
  roundNumber: number;
  /**
   * Set once the user chooses "continue current game" after a winner was
   * reached, so the celebration screen doesn't pop up again automatically.
   */
  winnerAcknowledged: boolean;
}
