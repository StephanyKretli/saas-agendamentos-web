"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { defaultBusinessHours, type DayRow } from "../../lib/onboarding-utils";
import type { OnboardingBusinessHour } from "../../api/onboarding.api";

interface Props {
  saving: boolean;
  serverError: string | null;
  onContinue: (days: OnboardingBusinessHour[]) => void;
}

export function StepHours({ saving, serverError, onContinue }: Props) {
  const [rows, setRows] = React.useState<DayRow[]>(() => defaultBusinessHours());

  function patch(weekday: number, next: Partial<DayRow>) {
    setRows((prev) => prev.map((r) => (r.weekday === weekday ? { ...r, ...next } : r)));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="space-y-6"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-zinc-100">Seus horários</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Já deixamos um padrão. Só confirme os dias que você atende — ajuste o que
          for diferente.
        </p>
      </header>

      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.weekday}
            className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border px-3 py-2.5 transition-colors ${
              row.enabled ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-800/60 bg-zinc-900/20"
            }`}
          >
            <button
              type="button"
              role="switch"
              aria-checked={row.enabled}
              aria-label={row.label}
              onClick={() => patch(row.weekday, { enabled: !row.enabled })}
              className={`relative h-6 w-10 shrink-0 overflow-hidden rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                row.enabled ? "bg-primary" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  row.enabled ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>

            <span className="min-w-0 flex-1 text-sm font-bold text-zinc-200">
              {row.label}
            </span>

            {row.enabled ? (
              // w-full força o par de horários pra linha de baixo — toggle + dia
              // ficam na primeira linha, os horários ocupam a largura toda na
              // segunda. Robusto em qualquer viewport, sem depender de breakpoint.
              <div className="flex w-full items-center gap-1.5">
                <input
                  type="time"
                  value={row.start}
                  onChange={(e) => patch(row.weekday, { start: e.target.value })}
                  className="min-w-18 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-center text-sm text-zinc-100 outline-none focus:border-primary/50"
                />
                <span className="shrink-0 text-zinc-600">–</span>
                <input
                  type="time"
                  value={row.end}
                  onChange={(e) => patch(row.weekday, { end: e.target.value })}
                  className="min-w-18 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-center text-sm text-zinc-100 outline-none focus:border-primary/50"
                />
              </div>
            ) : (
              <span className="shrink-0 text-xs font-medium text-zinc-600">Fechado</span>
            )}
          </div>
        ))}
      </div>

      {serverError && <p className="text-xs text-amber-400">{serverError}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={() =>
          onContinue(
            rows.map((r) => ({
              weekday: r.weekday,
              enabled: r.enabled,
              start: r.start,
              end: r.end,
            })),
          )
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Ver meu link
      </button>
    </motion.div>
  );
}
