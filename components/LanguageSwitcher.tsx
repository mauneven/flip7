"use client";

import { useT } from "@/lib/lang";
import { LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useT();

  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl bg-line/10 p-1">
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            aria-label={l.label}
            className={[
              "flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-bold uppercase transition",
              active ? "bg-accent text-on-accent shadow-sm" : "text-muted hover:text-text",
            ].join(" ")}
          >
            <span aria-hidden className="text-sm leading-none">
              {l.flag}
            </span>
            {l.code}
          </button>
        );
      })}
    </div>
  );
}
