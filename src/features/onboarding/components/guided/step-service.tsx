"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Scissors } from "lucide-react";
import {
  centsToBRL,
  parseBRLInputToCents,
  SERVICE_NAME_SUGGESTIONS,
  DURATION_OPTIONS,
} from "../../lib/onboarding-utils";

interface Props {
  saving: boolean;
  serverError: string | null;
  onContinue: (payload: { name: string; priceCents: number; durationMinutes: number }) => void;
}

export function StepService({ saving, serverError, onContinue }: Props) {
  const [name, setName] = React.useState("");
  const [priceCents, setPriceCents] = React.useState(0);
  const [duration, setDuration] = React.useState(60);

  const canContinue = name.trim().length > 0 && !saving;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="space-y-6"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-zinc-100">Seu principal serviço</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Só um por enquanto — o que você mais faz. Os outros você adiciona depois no painel.
        </p>
      </header>

      {/* Nome + sugestões */}
      <div className="space-y-2.5">
        <label className="relative block">
          <Scissors className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do serviço"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_NAME_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setName(s)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                name === s
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="space-y-1.5">
        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Preço</span>
        <input
          inputMode="numeric"
          value={priceCents === 0 ? "" : centsToBRL(priceCents)}
          onChange={(e) => setPriceCents(parseBRLInputToCents(e.target.value))}
          placeholder="R$ 0,00"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
        />
        <p className="text-[11px] text-zinc-500">Pode deixar zerado e ajustar depois.</p>
      </div>

      {/* Duração */}
      <div className="space-y-1.5">
        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">Duração</span>
        <div className="grid grid-cols-4 gap-2">
          {DURATION_OPTIONS.map((min) => (
            <button
              key={min}
              type="button"
              onClick={() => setDuration(min)}
              className={`rounded-xl border py-3 text-sm font-bold transition-colors ${
                duration === min
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700"
              }`}
            >
              {min}min
            </button>
          ))}
        </div>
      </div>

      {serverError && <p className="text-xs text-amber-400">{serverError}</p>}

      <button
        type="button"
        disabled={!canContinue}
        onClick={() =>
          onContinue({ name: name.trim(), priceCents, durationMinutes: duration })
        }
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continuar
      </button>
    </motion.div>
  );
}
