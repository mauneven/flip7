"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./types";
import { detectLang, translate } from "./i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);
const LANG_KEY = "flip7-lang";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    let initial: Lang | null = null;
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === "en" || stored === "es" || stored === "fr") initial = stored;
    } catch {
      /* ignore */
    }
    setLangState(initial ?? detectLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) =>
      translate(lang, key, params),
    [lang],
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useT must be used within a LangProvider");
  return ctx;
}
