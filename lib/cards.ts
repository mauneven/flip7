// Tailwind gradient class strings for each card. Declared as literals so the
// Tailwind JIT compiler picks them up (lib/** is in the content globs).

export const BASIC_GRADIENTS: Record<number, string> = {
  0: "from-slate-400 to-slate-600",
  1: "from-rose-400 to-rose-600",
  2: "from-orange-400 to-orange-600",
  3: "from-amber-400 to-amber-600",
  4: "from-yellow-300 to-yellow-500",
  5: "from-lime-400 to-lime-600",
  6: "from-green-400 to-green-600",
  7: "from-emerald-400 to-emerald-600",
  8: "from-teal-400 to-teal-600",
  9: "from-cyan-400 to-cyan-600",
  10: "from-sky-400 to-sky-600",
  11: "from-violet-400 to-violet-600",
  12: "from-fuchsia-400 to-fuchsia-600",
};

export const MODIFIER_GRADIENT = "from-amber-300 to-yellow-500";
export const X2_GRADIENT = "from-fuchsia-500 via-purple-600 to-indigo-700";

export function basicGradient(n: number): string {
  return BASIC_GRADIENTS[n] ?? "from-slate-400 to-slate-600";
}
