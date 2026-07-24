"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, Copy, ExternalLink, Minus, PartyPopper, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { useWhatsappStatus } from "@/features/whatsapp/hooks/use-whatsapp-status";
import { useOnboardingStatus } from "../hooks/use-onboarding-status";
import { ONBOARDING_STEPS, type OnboardingStepId } from "../config/steps";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 30 };

function nextIncompleteStepExcluding(
  flags: Record<OnboardingStepId, boolean>,
  excludeId: OnboardingStepId
): OnboardingStepId | null {
  const found = ONBOARDING_STEPS.find((step) => step.id !== excludeId && !flags[step.id]);
  return found?.id ?? null;
}

function getBookingBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BOOKING_BASE_URL) return process.env.NEXT_PUBLIC_BOOKING_BASE_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function OnboardingWizard() {
  const router = useRouter();
  const pathname = usePathname();
  const status = useOnboardingStatus();
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();
  const whatsappQuery = useWhatsappStatus(status.salonId, { poll: true });

  const [isMinimized, setIsMinimized] = React.useState(true);
  const [activeStepId, setActiveStepId] = React.useState<OnboardingStepId | null>(null);
  const [celebratingStepId, setCelebratingStepId] = React.useState<OnboardingStepId | null>(null);

  // Fonte da verdade: o primeiro passo ainda não concluído, segundo o backend
  const firstIncomplete = ONBOARDING_STEPS.find((step) => !status.stepFlags[step.id]) ?? null;
  const currentStep = activeStepId
    ? ONBOARDING_STEPS.find((step) => step.id === activeStepId) ?? ONBOARDING_STEPS[0]
    : firstIncomplete ?? ONBOARDING_STEPS[0];

  // Snapshot (cópia, não referência) do stepFlags anterior — detecta QUALQUER passo
  // que virou true, não só o "primeiro incompleto" (que é cego a conclusões fora de ordem).
  const prevStepFlagsRef = React.useRef<Record<OnboardingStepId, boolean> | null>(null);

  React.useEffect(() => {
    // Enquanto carrega, os valores são instáveis — não toca no ref
    if (status.isLoading) return;

    const prevFlags = prevStepFlagsRef.current;
    const nextFlags = status.stepFlags;

    if (!prevFlags) {
      // Primeira vez que os dados chegam: só grava o ponto de partida, nunca celebra
      // (senão uma conta que já tem passos prontos "celebraria" todos eles de uma vez)
      prevStepFlagsRef.current = { ...nextFlags };
      setIsMinimized(status.isMinimumReady);
      return;
    }

    const changed = ONBOARDING_STEPS.map((step) => step.id).filter(
      (id) => prevFlags[id] !== nextFlags[id]
    );
    const justCompleted = changed.filter((id) => prevFlags[id] === false && nextFlags[id] === true);

    prevStepFlagsRef.current = { ...nextFlags };

    // Se mais de um passo virou true no mesmo PATCH, celebra só o primeiro na ordem canônica
    const stepToCelebrate = ONBOARDING_STEPS.find((step) => justCompleted.includes(step.id));

    if (!stepToCelebrate) return; // nada concluído agora — regressão sozinha nunca celebra

    setActiveStepId(null); // solta o controle manual, volta a seguir o fluxo automático
    setIsMinimized((current) => (current ? false : current)); // só reabre se estava minimizado
    setCelebratingStepId(stepToCelebrate.id);

    const timeout = setTimeout(() => setCelebratingStepId(null), 2000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    status.isLoading,
    status.isMinimumReady,
    status.profile,
    status.vitrine,
    status.hours,
    status.team,
    status.services,
    status.shield,
    status.whatsapp,
  ]);

  // Na pagina de cobranca (/billing), o passo a passo nao deve aparecer: ele
  // competia com a tela de renovacao de plano e nao dava para minimizar direito.
  if (pathname === "/billing") return null;

  if (status.isLoading || status.isFullyOnboarded) return null;

  const isCelebrating = celebratingStepId !== null;

  function goToStepRoute(route: string) {
    setIsMinimized(true);
    router.push(route);
  }

  function handleCopyVitrineLink() {
    const link = `${getBookingBaseUrl()}/book/${settings?.username ?? ""}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado com sucesso!");
  }

  function handleOpenVitrine() {
    const link = `${getBookingBaseUrl()}/book/${settings?.username ?? ""}`;
    window.open(link, "_blank");
  }

  function handleWorksSolo() {
    updateSettings.mutate({ isSoloProfessional: true });
  }

  function handleSkipShield() {
    const next = nextIncompleteStepExcluding(status.stepFlags, "shield");
    if (next) {
      setActiveStepId(next);
    } else if (status.isMinimumReady) {
      setIsMinimized(true);
    }
  }

  function handleGoToNextStep() {
    const next = nextIncompleteStepExcluding(status.stepFlags, currentStep.id);
    setActiveStepId(next);
  }

  const currentIndex = ONBOARDING_STEPS.findIndex((step) => step.id === currentStep.id);

  function handleTrackBack() {
    const prevIndex = Math.max(0, currentIndex - 1);
    setActiveStepId(ONBOARDING_STEPS[prevIndex].id);
  }

  function handleTrackNext() {
    const nextIndex = Math.min(ONBOARDING_STEPS.length - 1, currentIndex + 1);
    setActiveStepId(ONBOARDING_STEPS[nextIndex].id);
  }

  const hasUsername = Boolean(settings?.username);
  const celebratingStep = celebratingStepId
    ? ONBOARDING_STEPS.find((step) => step.id === celebratingStepId)
    : null;

  return (
    <>
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-zinc-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
          >
            <motion.div
              className="w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl overflow-hidden md:rounded-2xl md:border md:border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col md:flex-row"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={SPRING}
            >
              {/* Trilha lateral — só desktop */}
              <div className="hidden md:block md:w-64 shrink-0 border-r border-zinc-800 p-4 sm:p-5 space-y-1 overflow-y-auto">
                <div className="px-1 pb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Comece por aqui
                  </p>
                  <p className="text-sm font-bold text-zinc-100 mt-0.5">
                    {status.done}/{status.total} etapas concluídas
                  </p>
                </div>

                {ONBOARDING_STEPS.map((step) => {
                  const done = status.stepFlags[step.id];
                  const isActive = step.id === currentStep.id;
                  const Icon = step.icon;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => !isCelebrating && setActiveStepId(step.id)}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left cursor-pointer transition-colors ${
                        isActive
                          ? "bg-zinc-900 border border-zinc-800"
                          : "border border-transparent hover:bg-zinc-900/60 hover:border-zinc-800/60"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          done
                            ? "bg-primary/20 text-primary"
                            : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                        }`}
                      >
                        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-sm font-bold truncate ${
                            isActive ? "text-zinc-100" : "text-zinc-300"
                          }`}
                        >
                          {step.title}
                        </span>
                        {step.badge && (
                          <span className="block text-[11px] font-medium text-zinc-500">{step.badge}</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Conteúdo do passo ativo */}
              <div className="flex-1 flex flex-col min-w-0 h-full md:h-auto">
                {/* Topo mobile: progresso da trilha + posição + Minimizar */}
                <div className="flex md:hidden flex-col gap-2.5 p-4 border-b border-zinc-800/60 shrink-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-zinc-400">
                      {currentIndex + 1} de {ONBOARDING_STEPS.length}
                    </p>
                    <button
                      type="button"
                      disabled={!status.isMinimumReady}
                      onClick={() => setIsMinimized(true)}
                      title={
                        status.isMinimumReady
                          ? "Minimizar"
                          : "Complete perfil, horários e serviços para minimizar"
                      }
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-zinc-400 transition-colors enabled:hover:bg-zinc-900 enabled:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-3.5 w-3.5" />
                      Minimizar
                    </button>
                  </div>
                  <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-300"
                      style={{ width: `${((currentIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Topo desktop: só Minimizar */}
                <div className="hidden md:flex items-center justify-end p-3 sm:p-4 border-b border-zinc-800/60 shrink-0">
                  <button
                    type="button"
                    disabled={!status.isMinimumReady}
                    onClick={() => setIsMinimized(true)}
                    title={
                      status.isMinimumReady
                        ? "Minimizar"
                        : "Complete perfil, horários e serviços para minimizar"
                    }
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-400 transition-colors enabled:hover:bg-zinc-900 enabled:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-3.5 w-3.5" />
                    Minimizar
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8">
                  <AnimatePresence mode="wait">
                    {isCelebrating ? (
                      <motion.div
                        key="celebration"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={SPRING}
                        className="flex flex-col items-center justify-center text-center py-10 gap-4"
                      >
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <PartyPopper className="h-8 w-8" />
                        </span>
                        <div>
                          <p className="text-lg font-black text-zinc-100">Feito!</p>
                          <p className="text-sm font-medium text-zinc-400 mt-1">
                            {celebratingStep?.title ?? "Passo"} concluído com sucesso.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={SPRING}
                      >
                        <div className="flex items-start gap-4 mb-6">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <currentStep.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <h2 className="text-xl font-black text-zinc-100">{currentStep.headline}</h2>
                            <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                              {currentStep.description}
                            </p>
                          </div>
                        </div>

                        <ul className="space-y-2.5 mb-8">
                          {currentStep.checklist.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-300">
                              <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>

                        {currentStep.id === "vitrine" ? (
                          hasUsername ? (
                            <div className="space-y-4">
                              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                                  Seu link
                                </p>
                                <p className="text-sm font-bold text-primary break-all">
                                  {getBookingBaseUrl()}/book/{settings?.username}
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                  type="button"
                                  onClick={handleCopyVitrineLink}
                                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copiar link
                                </button>
                                <button
                                  type="button"
                                  onClick={handleOpenVitrine}
                                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-200 transition-colors hover:bg-zinc-800"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  Ver minha vitrine
                                </button>
                              </div>
                              <p className="text-xs text-zinc-500">
                                Quer mudar o endereço? Configurações &gt; Vitrine
                              </p>
                              <button
                                type="button"
                                onClick={() => setActiveStepId(null)}
                                className="text-sm font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                              >
                                Continuar
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                                <p className="text-sm text-amber-200/90">
                                  Não encontramos o link da sua vitrine. Defina em Configurações &gt; Vitrine.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => goToStepRoute("/settings?tab=vitrine")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                              >
                                Ir para Configurações
                              </button>
                            </div>
                          )
                        ) : (
                          <div className="space-y-4">
                            {currentStep.id === "whatsapp" && whatsappQuery.isError && (
                              <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                                <div className="flex-1 space-y-2">
                                  <p className="text-sm text-amber-200/90">
                                    Não foi possível verificar o status do WhatsApp agora.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => whatsappQuery.refetch()}
                                    disabled={whatsappQuery.isFetching}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-100 transition-colors disabled:opacity-50 cursor-pointer"
                                  >
                                    <RefreshCw className={`h-3.5 w-3.5 ${whatsappQuery.isFetching ? "animate-spin" : ""}`} />
                                    Tentar novamente
                                  </button>
                                </div>
                              </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                type="button"
                                onClick={() => goToStepRoute(currentStep.route)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                              >
                                {currentStep.cta}
                              </button>
                              {currentStep.id === "team" && (
                                <button
                                  type="button"
                                  onClick={handleWorksSolo}
                                  disabled={updateSettings.isPending}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-50"
                                >
                                  Trabalho sozinha
                                </button>
                              )}
                              {currentStep.id === "shield" && (
                                <button
                                  type="button"
                                  onClick={handleSkipShield}
                                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-800"
                                >
                                  Configurar depois
                                </button>
                              )}
                            </div>
                            {!currentStep.required && (
                              <button
                                type="button"
                                onClick={handleGoToNextStep}
                                className="text-sm font-bold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                              >
                                Próximo passo
                              </button>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rodapé mobile: navegação entre passos da trilha */}
                <div className="flex md:hidden items-center justify-between gap-3 p-4 border-t border-zinc-800/60 shrink-0">
                  <button
                    type="button"
                    onClick={handleTrackBack}
                    disabled={currentIndex === 0 || isCelebrating}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleTrackNext}
                    disabled={currentIndex === ONBOARDING_STEPS.length - 1 || isCelebrating}
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMinimized && (
          <motion.button
            type="button"
            onClick={() => setIsMinimized(false)}
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={SPRING}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-800/50 bg-zinc-900/70 shadow-lg backdrop-blur-md"
            title={`Onboarding: ${status.done}/${status.total} etapas concluídas`}
          >
            <ProgressRing progress={status.progress} />
            <span className="absolute text-xs font-black text-zinc-100">
              {status.done}/{status.total}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const size = 56;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-zinc-800"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}
