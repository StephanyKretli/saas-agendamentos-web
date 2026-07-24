"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth-storage";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando painel...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">

      {/* 🚀 Wizard de onboarding: progresso derivado do backend, modal bloqueante até o mínimo viável */}
      <OnboardingWizard />

      <div className="flex flex-col flex-1 gap-4 p-0 md:flex-row md:p-4 lg:p-6 lg:gap-6">

        {/* Sidebar: só no desktop. No mobile quem navega é a barra inferior. */}
        <div className="hidden md:block md:w-64 lg:w-72 md:shrink-0 md:sticky md:top-4 lg:top-6 md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
          <DashboardSidebar />
        </div>

        {/* Conteúdo: no mobile ocupa a tela inteira (sem card-dentro-de-card) e
            reserva espaço embaixo para a barra de navegação. No desktop mantém
            o cartão arredondado original. */}
        <main className="flex-1 overflow-hidden bg-transparent p-4 pb-28 md:rounded-3xl md:border md:border-border md:bg-card md:p-8 md:pb-8 md:shadow-sm">
          {children}
        </main>

      </div>

      {/* Barra de navegação inferior (mobile). */}
      <MobileBottomNav />

    </div>
  );
}
