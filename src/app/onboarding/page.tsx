"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getAccessToken } from "@/lib/auth-storage";
import { useOnboardingState } from "@/features/onboarding/hooks/use-onboarding-state";
import {
  setOnboardingUsername,
  createOnboardingService,
  setOnboardingBusinessHours,
  completeOnboarding,
  logOnboardingEvent,
  type OnboardingBusinessHour,
} from "@/features/onboarding/api/onboarding.api";
import { slugifyUsername } from "@/features/onboarding/lib/onboarding-utils";
import { StepLink } from "@/features/onboarding/components/guided/step-link";
import { StepService } from "@/features/onboarding/components/guided/step-service";
import { StepHours } from "@/features/onboarding/components/guided/step-hours";
import { StepReady } from "@/features/onboarding/components/guided/step-ready";

const STEP_STORAGE_KEY = "syncro:onboarding:step";
const TOTAL_STEPS = 4;

function readStoredStep(): number {
  if (typeof window === "undefined") return 1;
  const raw = Number(window.localStorage.getItem(STEP_STORAGE_KEY));
  return Number.isFinite(raw) && raw >= 1 && raw <= TOTAL_STEPS ? raw : 1;
}

function storeStep(step: number) {
  try {
    window.localStorage.setItem(STEP_STORAGE_KEY, String(step));
  } catch {
    /* modo privado / storage bloqueado — sem breadcrumb, o servidor ainda retoma */
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [authReady, setAuthReady] = React.useState(false);
  React.useEffect(() => {
    if (!getAccessToken()) {
      router.replace("/login");
      return;
    }
    setAuthReady(true);
  }, [router]);

  const { data: state, isLoading, isError, isFetched } = useOnboardingState(authReady);

  const [step, setStep] = React.useState<number | null>(null);
  const [username, setUsername] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Decide o passo inicial uma única vez, quando o estado do servidor chega.
  // Piso do servidor (tem serviço? tem horário?) OU o breadcrumb local — o que
  // estiver mais adiante. Fechar a aba no passo 3 não joga de volta pro 1.
  const decidedRef = React.useRef(false);
  React.useEffect(() => {
    if (decidedRef.current) return;
    if (!authReady) return;
    if (isLoading) return;
    // Espera a query assentar (dados OU erro) antes de decidir o passo — sem
    // isso um render intermediário fixaria o passo 1 e o guard de "não se
    // aplica" (membro de equipe) nunca rodaria.
    if (!isFetched && !isError) return;

    if (state && (!state.applies || state.onboardingCompletedAt)) {
      decidedRef.current = true;
      router.replace("/dashboard");
      return;
    }

    const serverFloor = state?.resumeStep ?? 1;
    const initial = Math.min(
      TOTAL_STEPS,
      Math.max(1, serverFloor, readStoredStep()),
    );
    setUsername(slugifyUsername(state?.username || state?.nameSlug || ""));
    setStep(initial);
    decidedRef.current = true;
  }, [state, isLoading, isError, isFetched, authReady, router]);

  // Telemetria: registra a entrada em cada passo (uma vez por passo por sessão).
  const enteredRef = React.useRef<Set<number>>(new Set());
  React.useEffect(() => {
    if (step == null) return;
    if (enteredRef.current.has(step)) return;
    enteredRef.current.add(step);
    void logOnboardingEvent(step, "entrou");
  }, [step]);

  function advanceTo(next: number) {
    setError(null);
    storeStep(next);
    setStep(next);
  }

  async function handleLink(nextUsername: string) {
    setSaving(true);
    setError(null);
    try {
      const res = await setOnboardingUsername(nextUsername);
      setUsername(res.username);
      void logOnboardingEvent(1, "concluiu");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-state"] });
      advanceTo(2);
    } catch (e) {
      // Conflito de link cai aqui como Error("O link \"x\" já está em uso.").
      setError(e instanceof Error ? e.message : "Não consegui salvar o link. Tente outro nome.");
    } finally {
      setSaving(false);
    }
  }

  async function handleService(payload: {
    name: string;
    priceCents: number;
    durationMinutes: number;
  }) {
    setSaving(true);
    setError(null);
    try {
      await createOnboardingService(payload);
      void logOnboardingEvent(2, "concluiu");
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-state"] });
      advanceTo(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não consegui salvar o serviço. Tente de novo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleHours(days: OnboardingBusinessHour[]) {
    setSaving(true);
    setError(null);
    try {
      await setOnboardingBusinessHours(days);
      void logOnboardingEvent(3, "concluiu");
      queryClient.invalidateQueries({ queryKey: ["business-hours"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-state"] });
      advanceTo(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não consegui salvar os horários. Tente de novo.");
    } finally {
      setSaving(false);
    }
  }

  // Passo 4 (render): marca o fim do onboarding. Idempotente no backend.
  const completedRef = React.useRef(false);
  React.useEffect(() => {
    if (step !== 4 || completedRef.current) return;
    completedRef.current = true;
    (async () => {
      try {
        const res = await completeOnboarding();
        if (res.username) setUsername(res.username);
      } catch {
        /* se falhar, o gate ainda solta (já tem serviço + horário) e o painel tenta de novo */
      }
      void logOnboardingEvent(4, "concluiu");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-state"] });
    })();
  }, [step, queryClient]);

  function goToDashboard() {
    try {
      window.localStorage.removeItem(STEP_STORAGE_KEY);
    } catch {
      /* noop */
    }
    window.location.href = "/dashboard";
  }

  if (!authReady || step == null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-zinc-500">Carregando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        {/* Progresso */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
            <span>
              Passo {step} de {TOTAL_STEPS}
            </span>
            <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 backdrop-blur-sm sm:p-7">
          {step === 1 && (
            <StepLink
              initialUsername={username}
              saving={saving}
              serverError={error}
              onContinue={handleLink}
            />
          )}
          {step === 2 && (
            <StepService saving={saving} serverError={error} onContinue={handleService} />
          )}
          {step === 3 && (
            <StepHours saving={saving} serverError={error} onContinue={handleHours} />
          )}
          {step === 4 && <StepReady username={username} onGoToDashboard={goToDashboard} />}
        </div>
      </div>
    </main>
  );
}
