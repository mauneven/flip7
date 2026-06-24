import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        // Semantic tokens, driven by CSS variables (see globals.css).
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-2) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        text: "rgb(var(--text) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-press": "rgb(var(--accent-press) / <alpha-value>)",
        "on-accent": "rgb(var(--on-accent) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
      },
      keyframes: {
        "float-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-up": "float-up 0.4s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
