"use client";

import { useT } from "@/lib/lang";
import { LANGS } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang } = useT();

  return (
    <div className="flex items-center gap-0.5 rounded-full glass p-0.5">
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            aria-label={l.label}
            title={l.label}
            className={[
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold uppercase tracking-wide transition",
              active
                ? "bg-white text-slate-900 shadow"
                : "text-white/70 hover:text-white",
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
