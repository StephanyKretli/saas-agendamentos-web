"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Link as LinkIcon, Loader2, AlertTriangle } from "lucide-react";
import { checkUsernameAvailable } from "../../api/onboarding.api";
import { slugifyUsername, bookingUrlLabel } from "../../lib/onboarding-utils";

interface Props {
  initialUsername: string;
  saving: boolean;
  serverError: string | null;
  onContinue: (username: string) => void;
}

type AvailabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok" }
  | { status: "taken"; suggestion?: string }
  | { status: "short" };

export function StepLink({ initialUsername, saving, serverError, onContinue }: Props) {
  const [value, setValue] = React.useState(() => slugifyUsername(initialUsername));
  const [availability, setAvailability] = React.useState<AvailabilityState>({ status: "idle" });
  const slug = slugifyUsername(value);

  // Debounce da checagem de disponibilidade. Sempre deixa continuar — no pior
  // caso o POST do passo devolve conflito e a pessoa ajusta.
  React.useEffect(() => {
    if (slug.length < 3) {
      setAvailability({ status: "short" });
      return;
    }
    setAvailability({ status: "checking" });
    const id = setTimeout(async () => {
      try {
        const res = await checkUsernameAvailable(slug);
        if (res.available) {
          setAvailability({ status: "ok" });
        } else if (res.reason === "muito-curto") {
          setAvailability({ status: "short" });
        } else {
          setAvailability({ status: "taken", suggestion: res.suggestion });
        }
      } catch {
        // Falha de rede não pode travar o passo.
        setAvailability({ status: "idle" });
      }
    }, 450);
    return () => clearTimeout(id);
  }, [slug]);

  const canContinue = slug.length >= 3 && !saving;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="space-y-6"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-zinc-100">Seu link de agendamento</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          É o endereço que você vai colar na bio do Instagram. Confira o nome — dá para
          mudar depois nas configurações.
        </p>
      </header>

      <div className="space-y-3">
        <label className="relative block">
          <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            autoFocus
            inputMode="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="studio-beauty"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-3.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
          />
        </label>

        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 px-3.5 py-2.5">
          <span className="text-sm font-bold text-primary break-all">
            {slug ? bookingUrlLabel(slug) : "meusyncro.com.br/book/…"}
          </span>
        </div>

        <div className="min-h-[1.25rem] text-xs">
          {availability.status === "checking" && (
            <span className="inline-flex items-center gap-1.5 text-zinc-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verificando…
            </span>
          )}
          {availability.status === "ok" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Link disponível
            </span>
          )}
          {availability.status === "short" && (
            <span className="text-zinc-500">Use pelo menos 3 letras ou números.</span>
          )}
          {availability.status === "taken" && (
            <span className="inline-flex flex-wrap items-center gap-1.5 text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Já está em uso.
              {availability.suggestion && (
                <button
                  type="button"
                  onClick={() => setValue(availability.suggestion!)}
                  className="font-bold text-primary underline underline-offset-2"
                >
                  Usar {availability.suggestion}
                </button>
              )}
            </span>
          )}
        </div>

        {serverError && (
          <p className="text-xs text-amber-400">{serverError}</p>
        )}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={() => onContinue(slug)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Continuar
      </button>
    </motion.div>
  );
}
