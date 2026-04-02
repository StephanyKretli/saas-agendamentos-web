"use client";

import Link from "next/link";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { useDashboardToday } from "@/features/dashboard/hooks/use-dashboard-today";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { 
  DollarSign, 
  Calendar as CalendarIcon, 
  XCircle, 
  Award, 
  CheckCircle, 
  Clock, 
  User, 
  Scissors,
  ArrowRight,
  LayoutDashboard,
  PiggyBank,
  Users,
  CreditCard
} from "lucide-react";
import type { TodayAppointment } from "@/features/dashboard/types/dashboard.types";
import { motion, Variants } from "framer-motion";

// Lógica de formatação
function formatTime(dateString: string) {
  if (!dateString) return "--:--";
  if (dateString.length <= 5) return dateString; 
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
}

function formatMonthYear(monthStr?: string) {
  if (!monthStr) return "este mês";
  if (/^\d{4}-\d{2}$/.test(monthStr)) {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    const formatted = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  return monthStr;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  SCHEDULED: { label: "Agendado", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" }, 
  COMPLETED: { label: "Concluído", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  CANCELED: { label: "Cancelado", color: "bg-destructive/10 text-destructive border-destructive/20" },
};

const statsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const agendaContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.3 } }
};

const agendaItemVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { data: metrics, isLoading: loadingMetrics, isError: errorMetrics } = useDashboardMetrics();
  const { data: todayAgenda, isLoading: loadingToday } = useDashboardToday();
  const { data: profile } = useSettings();

  const appointments: TodayAppointment[] = Array.isArray(todayAgenda) 
    ? todayAgenda 
    : (todayAgenda as any)?.items ?? (todayAgenda as any)?.data ?? [];

  const firstName = profile?.name?.split(" ")[0] || "";
  const greeting = `${getGreeting()}${firstName ? `, ${firstName}` : "!"}`;

  if (errorMetrics || (!loadingMetrics && !metrics)) {
    return (
      <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive max-w-6xl mx-auto">
        <XCircle className="mx-auto mb-3 h-8 w-8 opacity-80" />
        <p className="text-lg font-semibold">Erro ao carregar o dashboard.</p>
        <p className="mt-1 text-sm opacity-80">Não foi possível conectar com o servidor. Tente atualizar a página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      {/* CABEÇALHO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{greeting} 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Resumo do seu desempenho em <strong className="text-foreground">{formatMonthYear(metrics?.month)}</strong>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🌟 NOVA SECÇÃO: SAÚDE FINANCEIRA E COMISSÕES */}
      <motion.div 
        variants={statsContainerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Faturamento Bruto (O que entrou de verdade) */}
        <motion.div variants={statItemVariants} className="rounded-3xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Faturamento Bruto</p>
              <p className="text-2xl font-black text-foreground">{metrics?.realizedRevenueFormatted || "R$ 0,00"}</p>
            </div>
          </div>
        </motion.div>

        {/* Comissões a Pagar (O que vai para a equipe) */}
        <motion.div variants={statItemVariants} className="rounded-3xl border border-border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">A Pagar (Equipe)</p>
              <p className="text-2xl font-black text-foreground">{metrics?.teamCommissionsFormatted || "R$ 0,00"}</p>
            </div>
          </div>
        </motion.div>

        {/* Lucro Líquido (O que sobra pro salão já tirando equipe e PIX) */}
        <motion.div variants={statItemVariants} className="rounded-3xl border border-primary/30 bg-primary/5 p-6 shadow-sm relative overflow-hidden">          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary border border-primary/30">
              <PiggyBank className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary/80 uppercase tracking-wider">Lucro Líquido</p>
              <p className="text-2xl font-black text-primary">{metrics?.netRevenueFormatted || "R$ 0,00"}</p>
            </div>
          </div>
          {/* Aviso de taxas PIX */}
          <div className="mt-4 pt-4 border-t border-primary/10 flex items-center justify-between text-xs font-medium text-primary/70">
            <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> Taxas Mercado Pago:</span>
            <span>{metrics?.pixFeesFormatted || "R$ 0,00"}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* CARDS DE MÉTRICAS SECUNDÁRIAS (Cancelamentos e Destaque) */}
      <motion.div 
        variants={statsContainerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-2"
      >
        <motion.div variants={statItemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-colors hover:border-destructive/40">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-destructive/5 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Cancelada</p>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive shadow-inner border border-destructive/20">
              <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2 relative z-10">
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{metrics?.cancelRate || 0}%</p>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">da agenda</p>
          </div>
        </motion.div>

        <motion.div variants={statItemVariants} whileHover={{ y: -4, scale: 1.02 }} className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-colors hover:border-amber-500/40">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <p className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Destaque</p>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-inner border border-amber-500/20">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="mt-3 sm:mt-4 truncate text-lg sm:text-xl font-black text-foreground tracking-tight">
              {metrics?.mostBookedService?.name || "Nenhum"}
            </p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-muted-foreground">
              {metrics?.mostBookedService?.count ? `${metrics.mostBookedService.count} marcações` : "Sem dados"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* SECÇÃO: AGENDA DE HOJE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mt-10 rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="border-b border-border bg-muted/20 px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">A sua agenda de hoje</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
              {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date()).replace(/^\w/, (c) => c.toUpperCase())}
            </p>
          </div>
          <Link href="/agenda" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 py-2 px-3 rounded-xl hover:bg-primary/10 active:scale-95">
            Ver agenda completa <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="p-4 sm:p-6">
          {loadingToday ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-22 animate-pulse rounded-2xl border border-border bg-muted/50" />)}            </div>
          ) : appointments.length === 0 ? (
            <motion.div className="rounded-3xl border border-dashed border-border bg-muted/30 py-10 sm:py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                <CalendarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-black text-foreground">O seu dia está livre!</h3>
              <p className="mt-2 text-sm text-muted-foreground font-medium max-w-sm mx-auto px-4">
                Não existem agendamentos marcados para a data de hoje.
              </p>
            </motion.div>
          ) : (
            <motion.div variants={agendaContainerVariants} initial="hidden" animate="visible" className="grid gap-3 sm:gap-4 relative">
              <div className="absolute left-9 sm:left-11 top-4 bottom-4 w-0.5 bg-border/40 rounded-full hidden sm:block" />              {appointments.map((apt) => {
                const status = statusMap[apt.status] || { label: apt.status, color: "bg-muted text-muted-foreground border-border" };
                return (
                  <motion.div key={apt.id} variants={agendaItemVariants} className="group flex flex-col gap-3 sm:gap-4 rounded-2xl border border-border bg-background p-3 sm:p-4 hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between relative z-10">
                    {/* Bloco de Horário */}
                    <div className="flex items-center gap-3 sm:gap-4 sm:w-48">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5" />
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-black text-foreground">{formatTime(apt.startTime)}</p>
                        <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase">até {formatTime(apt.endTime)}</p>
                      </div>
                    </div>
                    {/* Bloco de Cliente e Serviço */}
                    <div className="flex-1 space-y-1 sm:space-y-1.5 border-l-2 border-transparent sm:border-border sm:pl-5 ml-1 sm:ml-0 group-hover:border-primary/30">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm sm:text-base font-bold text-foreground">{apt.clientName}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Scissors className="h-4 w-4" />
                        <p className="font-semibold">{apt.serviceName}</p>
                      </div>
                    </div>
                    {/* Bloco de Status */}
                    <div className="flex justify-start sm:justify-end mt-1 sm:mt-0">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </motion.div>

    </div>
  );
}