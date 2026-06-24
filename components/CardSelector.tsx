"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/lang";
import { BASIC_CARDS, MODIFIER_CARDS, FLIP7_COUNT, FLIP7_BONUS } from "@/lib/scoring";
import type { RoundSelection } from "@/lib/types";
import { PlayingCard } from "./PlayingCard";

interface CardSelectorProps {
  selection: RoundSelection;
  onChange: (next: RoundSelection) => void;
}

export function CardSelector({ selection, onChange }: CardSelectorProps) {
  const { t } = useT();
  const isFlip7 = selection.basics.length >= FLIP7_COUNT;

  const toggleBasic = (n: number) => {
    const has = selection.basics.includes(n);
    onChange({
      ...selection,
      basics: has
        ? selection.basics.filter((x) => x !== n)
        : [...selection.basics, n],
    });
  };

  const toggleModifier = (n: number) => {
    const has = selection.modifiers.includes(n);
    onChange({
      ...selection,
      modifiers: has
        ? selection.modifiers.filter((x) => x !== n)
        : [...selection.modifiers, n],
    });
  };

  const toggleX2 = () => onChange({ ...selection, x2: !selection.x2 });

  return (
    <div className="space-y-6">
      {/* Number cards — 5 per row, last row (10·11·12) centered */}
      <section>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-text">
              {t("round.basics")}
            </h3>
            <p className="text-xs text-faint">{t("round.basicsHint")}</p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isFlip7 && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0, y: -4 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="rounded-full bg-gold/15 px-2.5 py-1 text-[0.7rem] font-bold uppercase text-gold"
                >
                  {t("round.flip7")} +{FLIP7_BONUS}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="tabular rounded-full bg-line/10 px-2 py-1 text-[0.7rem] font-bold text-muted">
              {selection.basics.length}/{FLIP7_COUNT}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {BASIC_CARDS.map((n) => (
            <PlayingCard
              key={n}
              label={n}
              corner
              variant="number"
              selected={selection.basics.includes(n)}
              onClick={() => toggleBasic(n)}
              ariaLabel={`${t("round.basics")} ${n}`}
              className={n === 10 ? "col-start-2" : ""}
            />
          ))}
        </div>
      </section>

      {/* Bonus + multiplier — the 6 wildcards in one row */}
      <section>
        <h3 className="mb-2.5 text-sm font-bold uppercase tracking-wider text-text">
          {t("round.modifiers")}{" "}
          <span className="font-medium normal-case tracking-normal text-faint">
            · {t("round.multiplier")}
          </span>
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {MODIFIER_CARDS.map((n) => (
            <PlayingCard
              key={n}
              label={`+${n}`}
              variant="bonus"
              size="sm"
              selected={selection.modifiers.includes(n)}
              onClick={() => toggleModifier(n)}
              ariaLabel={`+${n}`}
            />
          ))}
          <PlayingCard
            label="×2"
            variant="x2"
            size="sm"
            selected={selection.x2}
            onClick={toggleX2}
            ariaLabel={t("round.multiplier")}
          />
        </div>
      </section>
    </div>
  );
}
