"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Scissors, Smartphone, Sparkles, Lock, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSettings } from "@/features/settings/hooks/use-settings";

export function QuickStartGuide() {
  const router = useRouter();
  const pathname = usePathname(); // O espião de rotas!
  const { data: profile } = useSettings();
  const [isVisible, setIsVisible] = useState(true);

  const [hasBusinessHours, setHasBusinessHours] = useState(false);
  const [hasServices, setHasServices] = useState(false);
  const [hasWhatsappConnected, setHasWhatsappConnected] = useState(false);
  const [hasTested, setHasTested] = useState(false);

  // Lê a memória sempre que a tela carrega OU a rota (pathname) muda
  useEffect(() => {
    setHasBusinessHours(localStorage.getItem("syncro_step_hours") === "true");
    setHasServices(localStorage.getItem("syncro_step_services") === "true");
    setHasWhatsappConnected(localStorage.getItem("syncro_step_wpp") === "true");
    setHasTested(localStorage.getItem("syncro_step_test") === "true"); 
  }, [pathname]);

  const completeStepAndNavigate = (stepKey: string, setter: any, route: string) => {
    setter(true);
    localStorage.setItem(stepKey, "true");
    router.push(route);
  };

  const isTestUnlocked = hasBusinessHours && hasServices && hasWhatsappConnected;
  
  const steps = [hasBusinessHours, hasServices, hasWhatsappConnected, hasTested];
  const completedSteps = steps.filter(Boolean).length;
  const progress = (completedSteps / 4) * 100;

  if (!isVisible || completedSteps === 4) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 pt-2 pb-2 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-7xl px-4 md:px-4 lg:px-6">
        <div className="relative rounded-xl border border-primary/20 bg-card p-3 shadow-sm flex flex-col gap-3 lg:gap-4">
          
          {/* HEADER E BARRA */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pr-6">
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">
                  Piloto Automático: <span className="text-muted-foreground font-medium">{4 - completedSteps} passos restantes</span>
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium ml-6 mt-0.5">
                Deixe o Syncro agendar e cobrar sozinho enquanto você foca nos atendimentos.
              </p>
            </div>
            
            <div className="flex items-center gap-3 lg:w-64 ml-6 lg:ml-0">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/50">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-primary" />
              </div>
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>

            <button onClick={() => setIsVisible(false)} className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* PASSOS (PÍLULAS HORIZONTAIS) */}
          <div className="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-4 sm:overflow-visible sm:pb-0">
            
            {/* Passo 1 - Horários */}
            <div className={`min-w-[75%] sm:min-w-0 snap-center shrink-0 flex items-center justify-between rounded-lg border p-2 transition-all ${hasBusinessHours ? "border-primary/30 bg-primary/5 opacity-60" : "border-border bg-background hover:border-primary/50"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {hasBusinessHours ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs font-bold text-foreground">Horários</span>
              </div>
              {!hasBusinessHours && (
                <button onClick={() => completeStepAndNavigate("syncro_step_hours", setHasBusinessHours, "/business-hours")} className="rounded bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                  Configurar
                </button>
              )}
            </div>

            {/* Passo 2 - Serviços */}
            <div className={`min-w-[75%] sm:min-w-0 snap-center shrink-0 flex items-center justify-between rounded-lg border p-2 transition-all ${hasServices ? "border-primary/30 bg-primary/5 opacity-60" : "border-border bg-background hover:border-primary/50"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {hasServices ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Scissors className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs font-bold text-foreground">Serviços</span>
              </div>
              {!hasServices && (
                <button onClick={() => completeStepAndNavigate("syncro_step_services", setHasServices, "/services")} className="rounded bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground">
                  Criar
                </button>
              )}
            </div>

            {/* Passo 3 - WhatsApp */}
            <div className={`min-w-[75%] sm:min-w-0 snap-center shrink-0 flex items-center justify-between rounded-lg border p-2 transition-all ${hasWhatsappConnected ? "border-primary/30 bg-primary/5 opacity-60" : "border-border bg-background hover:border-primary/50"}`}>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {hasWhatsappConnected ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs font-bold text-foreground">WhatsApp</span>
              </div>
              {!hasWhatsappConnected && (
                <button 
                    onClick={() => {
                    // 1. Deixa o bilhete
                    localStorage.setItem("syncro_target_tab", "whatsapp"); 
                    // 2. Dá um "grito" para o navegador avisando que a aba deve mudar agora
                    window.dispatchEvent(new Event("force_tab_change"));
                    // 3. Salva e navega
                    completeStepAndNavigate("syncro_step_wpp", setHasWhatsappConnected, "/settings");
                    }} 
                    className="rounded bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary hover:bg-primary hover:text-primary-foreground"
                >
                    Conectar
                </button>
              )}
            </div>

            {/* Passo 4 - O Teste */}
            <div className={`min-w-[75%] sm:min-w-0 snap-center shrink-0 flex items-center justify-between rounded-lg border p-2 transition-all ${!isTestUnlocked ? "border-dashed border-border bg-transparent opacity-50 grayscale" : "border-primary bg-primary/10"}`}>
              <div className="flex items-center gap-2">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${!isTestUnlocked ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                  {!isTestUnlocked ? <Lock className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                </div>
                <span className="text-xs font-bold text-foreground">O Teste</span>
              </div>
              {isTestUnlocked && (
                <button 
                  onClick={() => {
                    // 🌟 1. Grava no navegador que a jornada acabou!
                    localStorage.setItem("syncro_step_test", "true");
                    setHasTested(true);

                    // 2. Abre a aba da vitrine
                    const username = (profile as any)?.username || "";
                    window.open(`https://meusyncro.com.br/book/${username}`, "_blank");
                  }} 
                  className="flex items-center gap-1 rounded bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground hover:opacity-90"
                >
                  Ver Vitrine <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}