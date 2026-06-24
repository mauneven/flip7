"use client";

import { useTheme, type Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

const OPTIONS: { value: Theme; label: string; Icon: typeof MoonIcon }[] = [
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "light", label: "Light", Icon: SunIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl bg-line/10 p-1">
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            className={[
              "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition",
              active
                ? "bg-accent text-on-accent shadow-sm"
                : "text-muted hover:text-text",
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
