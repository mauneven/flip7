import type { Lang } from "./types";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

type Dict = Record<string, string>;

const en: Dict = {
  "app.subtitle": "Score tracker",
  "menu.theme": "Theme",
  "menu.language": "Language",
  "setup.title": "New game",
  "setup.players": "Players",
  "setup.playerName": "Player name",
  "setup.add": "Add player",
  "setup.goal": "Score goal",
  "setup.goalHint": "First to reach this (once the round is complete) wins",
  "setup.start": "Start game",
  "setup.minPlayers": "Add at least 2 players to start",
  "setup.duplicate": "Player names must be different",
  "setup.maxRec": "Unlimited players — 12 recommended",

  "board.round": "Round {n}",
  "board.goal": "Goal {n}",
  "board.enterRound": "Enter round {n}",
  "board.leader": "Leader",
  "board.reached": "Reached goal",
  "board.goalBanner": "{name} crossed {goal}! Finish the round to crown a winner.",
  "board.endGame": "End game now",
  "board.noScores": "No scores yet — tap below to play the first round",
  "board.pts": "pts",
  "board.menu": "Menu",
  "board.newGame": "New game",
  "board.resetConfirm": "Start a new game? Current scores will be lost.",
  "board.rounds": "Rounds",
  "board.you": "leads by {n}",
  "board.tiedTop": "Tied for the lead",

  "round.title": "Round {n}",
  "round.player": "Player {i} of {total}",
  "round.basics": "Number cards",
  "round.basicsHint": "Tap every number card this player kept",
  "round.modifiers": "Bonus cards",
  "round.multiplier": "Multiplier",
  "round.x2Hint": "Doubles the whole round total",
  "round.flip7": "FLIP 7!",
  "round.flip7Bonus": "Flip 7 bonus",
  "round.subtotal": "Subtotal",
  "round.total": "Round total",
  "round.clear": "Clear",
  "round.bust": "Bust (0)",
  "round.back": "Back",
  "round.cancel": "Cancel",
  "round.next": "Next player",
  "round.finish": "Finish round",
  "round.busted": "Busted",

  "win.winner": "{name} wins!",
  "win.tie": "It's a tie!",
  "win.tieNames": "{names} win!",
  "win.subtitle": "Goal of {goal} reached",
  "win.standings": "Final standings",
  "win.newGame": "New game",
  "win.continue": "Continue current game",
  "win.pts": "pts",
  "win.rounds": "{n} rounds",

  "round.lost": "Lost the round",
  "round.lostShort": "Lost",

  "edit.title": "Edit rounds",
  "edit.hint": "Tap any score to fix it",
  "edit.total": "Total",
  "edit.done": "Done",
  "edit.lost": "Lost",
  "edit.empty": "No rounds played yet",

  "confirm.newGameTitle": "Start a new game?",
  "confirm.newGameMsg": "The current scores will be lost.",
  "confirm.newGameYes": "New game",
  "common.cancel": "Cancel",

  "stats.title": "Memorable moments",
  "stats.bestRound": "Best round",
  "stats.inRound": "in round {n}",
  "stats.mostBusts": "Most eliminations",
  "stats.times": "{n}×",
  "stats.consistent": "Most consistent",
  "stats.avg": "{n} avg / round",
  "stats.roundsPlayed": "Rounds played",
};

const es: Dict = {
  "app.subtitle": "Marcador",
  "menu.theme": "Tema",
  "menu.language": "Idioma",
  "setup.title": "Nueva partida",
  "setup.players": "Jugadores",
  "setup.playerName": "Nombre del jugador",
  "setup.add": "Añadir jugador",
  "setup.goal": "Puntuación objetivo",
  "setup.goalHint": "El primero en alcanzarla (al terminar la ronda) gana",
  "setup.start": "Empezar partida",
  "setup.minPlayers": "Añade al menos 2 jugadores para empezar",
  "setup.duplicate": "Los nombres deben ser diferentes",
  "setup.maxRec": "Jugadores ilimitados — 12 recomendado",

  "board.round": "Ronda {n}",
  "board.goal": "Meta {n}",
  "board.enterRound": "Registrar ronda {n}",
  "board.leader": "Líder",
  "board.reached": "Meta alcanzada",
  "board.goalBanner": "¡{name} superó {goal}! Termina la ronda para coronar al ganador.",
  "board.endGame": "Terminar ahora",
  "board.noScores": "Aún no hay puntos — toca abajo para jugar la primera ronda",
  "board.pts": "pts",
  "board.menu": "Menú",
  "board.newGame": "Nueva partida",
  "board.resetConfirm": "¿Empezar una nueva partida? Se perderán los puntos actuales.",
  "board.rounds": "Rondas",
  "board.you": "lidera por {n}",
  "board.tiedTop": "Empate en cabeza",

  "round.title": "Ronda {n}",
  "round.player": "Jugador {i} de {total}",
  "round.basics": "Cartas de número",
  "round.basicsHint": "Toca cada carta de número que conservó este jugador",
  "round.modifiers": "Cartas de bonus",
  "round.multiplier": "Multiplicador",
  "round.x2Hint": "Duplica todo el total de la ronda",
  "round.flip7": "¡FLIP 7!",
  "round.flip7Bonus": "Bonus Flip 7",
  "round.subtotal": "Subtotal",
  "round.total": "Total de ronda",
  "round.clear": "Limpiar",
  "round.bust": "Eliminado (0)",
  "round.back": "Atrás",
  "round.cancel": "Cancelar",
  "round.next": "Siguiente jugador",
  "round.finish": "Terminar ronda",
  "round.busted": "Eliminado",

  "win.winner": "¡{name} gana!",
  "win.tie": "¡Empate!",
  "win.tieNames": "¡Ganan {names}!",
  "win.subtitle": "Meta de {goal} alcanzada",
  "win.standings": "Clasificación final",
  "win.newGame": "Nueva partida",
  "win.continue": "Continuar partida actual",
  "win.pts": "pts",
  "win.rounds": "{n} rondas",

  "round.lost": "Perdió la ronda",
  "round.lostShort": "Perdió",

  "edit.title": "Editar rondas",
  "edit.hint": "Toca un puntaje para corregirlo",
  "edit.total": "Total",
  "edit.done": "Listo",
  "edit.lost": "Perdió",
  "edit.empty": "Aún no hay rondas jugadas",

  "confirm.newGameTitle": "¿Empezar nueva partida?",
  "confirm.newGameMsg": "Se perderán los puntos actuales.",
  "confirm.newGameYes": "Nueva partida",
  "common.cancel": "Cancelar",

  "stats.title": "Momentos memorables",
  "stats.bestRound": "Mejor ronda",
  "stats.inRound": "en la ronda {n}",
  "stats.mostBusts": "Más eliminaciones",
  "stats.times": "{n}×",
  "stats.consistent": "Más constante",
  "stats.avg": "{n} prom. / ronda",
  "stats.roundsPlayed": "Rondas jugadas",
};

const fr: Dict = {
  "app.subtitle": "Tableau des scores",
  "menu.theme": "Thème",
  "menu.language": "Langue",
  "setup.title": "Nouvelle partie",
  "setup.players": "Joueurs",
  "setup.playerName": "Nom du joueur",
  "setup.add": "Ajouter un joueur",
  "setup.goal": "Score à atteindre",
  "setup.goalHint": "Le premier à l'atteindre (une fois la manche finie) gagne",
  "setup.start": "Commencer la partie",
  "setup.minPlayers": "Ajoutez au moins 2 joueurs pour commencer",
  "setup.duplicate": "Les noms doivent être différents",
  "setup.maxRec": "Joueurs illimités — 12 recommandés",

  "board.round": "Manche {n}",
  "board.goal": "Objectif {n}",
  "board.enterRound": "Saisir la manche {n}",
  "board.leader": "En tête",
  "board.reached": "Objectif atteint",
  "board.goalBanner": "{name} a dépassé {goal} ! Terminez la manche pour désigner le gagnant.",
  "board.endGame": "Terminer maintenant",
  "board.noScores": "Pas encore de score — touchez ci-dessous pour jouer la première manche",
  "board.pts": "pts",
  "board.menu": "Menu",
  "board.newGame": "Nouvelle partie",
  "board.resetConfirm": "Commencer une nouvelle partie ? Les scores actuels seront perdus.",
  "board.rounds": "Manches",
  "board.you": "mène de {n}",
  "board.tiedTop": "Égalité en tête",

  "round.title": "Manche {n}",
  "round.player": "Joueur {i} sur {total}",
  "round.basics": "Cartes numéro",
  "round.basicsHint": "Touchez chaque carte numéro gardée par ce joueur",
  "round.modifiers": "Cartes bonus",
  "round.multiplier": "Multiplicateur",
  "round.x2Hint": "Double tout le total de la manche",
  "round.flip7": "FLIP 7 !",
  "round.flip7Bonus": "Bonus Flip 7",
  "round.subtotal": "Sous-total",
  "round.total": "Total de la manche",
  "round.clear": "Effacer",
  "round.bust": "Éliminé (0)",
  "round.back": "Retour",
  "round.cancel": "Annuler",
  "round.next": "Joueur suivant",
  "round.finish": "Terminer la manche",
  "round.busted": "Éliminé",

  "win.winner": "{name} gagne !",
  "win.tie": "Égalité !",
  "win.tieNames": "{names} gagnent !",
  "win.subtitle": "Objectif de {goal} atteint",
  "win.standings": "Classement final",
  "win.newGame": "Nouvelle partie",
  "win.continue": "Continuer la partie",
  "win.pts": "pts",
  "win.rounds": "{n} manches",

  "round.lost": "Manche perdue",
  "round.lostShort": "Perdu",

  "edit.title": "Modifier les manches",
  "edit.hint": "Touchez un score pour le corriger",
  "edit.total": "Total",
  "edit.done": "Terminé",
  "edit.lost": "Perdu",
  "edit.empty": "Aucune manche jouée pour l'instant",

  "confirm.newGameTitle": "Nouvelle partie ?",
  "confirm.newGameMsg": "Les scores actuels seront perdus.",
  "confirm.newGameYes": "Nouvelle partie",
  "common.cancel": "Annuler",

  "stats.title": "Moments mémorables",
  "stats.bestRound": "Meilleure manche",
  "stats.inRound": "à la manche {n}",
  "stats.mostBusts": "Plus d'éliminations",
  "stats.times": "{n}×",
  "stats.consistent": "Plus régulier",
  "stats.avg": "{n} moy. / manche",
  "stats.roundsPlayed": "Manches jouées",
};

const DICTS: Record<Lang, Dict> = { en, es, fr };

export function translate(
  lang: Lang,
  key: string,
  params?: Record<string, string | number>,
): string {
  const dict = DICTS[lang] ?? en;
  let value = dict[key] ?? en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return value;
}

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
  if (nav === "es" || nav === "fr") return nav;
  return "en";
}
