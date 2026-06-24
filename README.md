# FLIP 7 — Scoreboard

A clean, fast, multilingual scoreboard for the **FLIP 7** card game. Built with
Next.js + Tailwind + Framer Motion. No backend — games are saved in your browser
(`localStorage`), so it works offline and survives refreshes.

## Features

- **Guided setup** — add players first, then pick a score goal (default **200**).
- **Tap the cards, never do math.** Each round you select the cards a player
  kept and the total is computed for you:
  1. sum the basic number cards (0–12)
  2. **+15** Flip 7 bonus when a player collected 7 number cards
  3. add the bonus cards (+2, +4, +6, +8, +10)
  4. finally apply **×2** to the whole result
- **Fair finish.** Reaching the goal doesn't end the game instantly — every
  player in the round is recorded first, so a trailing player can still overtake
  and win. Only then is the winner crowned with a celebration.
- **Win, your way.** When the goal is reached you can start a **new game** or
  **continue the current one**.
- **3 languages** — English, Español, Français (auto-detected, switchable any time).
- **Mobile-first** design with smooth animations and confetti.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Tech

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animations) + canvas-confetti (celebration)
- State persisted to `localStorage`; deployed on Vercel.
