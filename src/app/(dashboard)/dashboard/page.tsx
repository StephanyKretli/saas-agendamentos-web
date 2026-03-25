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
  ArrowRight
} from "lucide-react";
import type { TodayAppointment } from "@/features/dashboard/types/dashboard.types";

// Função para formatar a hora (ex: "09:00")
function formatTime(dateString: string) {
  if (!dateString) return "--:--";
  if (dateString.length <= 5) return dateString; 
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
}

// Função para deixar o mês no formato brasileiro premium
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

// Saudação baseada na hora do dia
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

// Dicionário de cores para os status
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  SCHEDULED: { label: "Agendado", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" }, // <-- Trocámos CONFIRMED por SCHEDULED
  COMPLETED: { label: "Concluído", color: "bg-green-500/10 text-green-600 border-green-500/20" },
  CANCELED: { label: "Cancelado", color: "bg-destructive/10 text-destructive border-destructive/20" },
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
      <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
        <XCircle className="mx-auto mb-3 h-8 w-8 opacity-80" />
        <p className="text-lg font-semibold">Erro ao carregar o dashboard.</p>
        <p className="mt-1 text-sm opacity-80">Não foi possível conectar com o servidor. Tente atualizar a página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CABEÇALHO */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{greeting} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aqui está o resumo do seu desempenho em <strong className="text-foreground">{formatMonthYear(metrics?.month)}</strong>.
        </p>
      </div>

      {/* CARDS PRINCIPAIS (Reduzidos no Mobile com classes sm:) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {loadingMetrics ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[90px] sm:h-[120px] rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="h-3 sm:h-4 w-16 sm:w-24 animate-pulse rounded bg-muted-foreground/20" />
                <div className="h-7 w-7 sm:h-8 sm:w-8 animate-pulse rounded-md sm:rounded-lg bg-muted-foreground/10" />
              </div>
              <div className="mt-3 sm:mt-4 h-6 sm:h-8 w-20 sm:w-32 animate-pulse rounded bg-muted-foreground/20" />
            </div>
          ))
        ) : (
          <>
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Receita Esperada</p>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 text-primary">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="mt-2 sm:mt-4 text-xl sm:text-3xl font-bold text-foreground">{metrics?.expectedRevenueFormatted}</p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-green-500/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Receita Realizada</p>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-green-500/10 text-green-500">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="mt-2 sm:mt-4 text-xl sm:text-3xl font-bold text-foreground">{metrics?.realizedRevenueFormatted}</p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-destructive/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Cancelamentos</p>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-destructive/10 text-destructive">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                <p className="text-xl sm:text-3xl font-bold text-foreground">{metrics?.cancelRate}%</p>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">da agenda</p>
              </div>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-amber-500/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Destaque</p>
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-500">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
              <p className="mt-2 sm:mt-4 truncate text-lg sm:text-xl font-bold text-foreground" title={metrics?.mostBookedService?.name || "Nenhum"}>
                {metrics?.mostBookedService?.name || "Nenhum"}
              </p>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium text-muted-foreground">
                {metrics?.mostBookedService?.count ? `${metrics.mostBookedService.count} marcações` : "Sem dados"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* SECÇÃO: AGENDA DE HOJE */}
      <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/20 px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              A sua agenda de hoje <span className="text-muted-foreground font-normal text-xs sm:text-sm ml-1 sm:ml-2">({new Intl.DateTimeFormat('pt-BR').format(new Date())})</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Confira os próximos clientes do dia.</p>
          </div>
          
          <Link 
            href="/agenda" 
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Ver agenda completa
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="p-4 sm:p-6">
          {loadingToday ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[88px] animate-pulse rounded-2xl border border-border bg-muted/50" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-8 sm:py-12 text-center">
              <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarIcon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">O seu dia está livre!</h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto px-4">
                Não existem agendamentos marcados para a data de hoje. Aproveite para partilhar o seu link nas redes sociais.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {appointments.map((apt) => {
                const status = statusMap[apt.status] || { label: apt.status, color: "bg-muted text-muted-foreground border-border" };
                
                return (
                  <div 
                    key={apt.id} 
                    className="group flex flex-col gap-3 sm:gap-4 rounded-2xl border border-border bg-background p-3 sm:p-4 transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    
                    {/* Bloco de Horário */}
                    <div className="flex items-center gap-3 sm:gap-4 sm:w-48">
                      <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 flex-col items-center justify-center rounded-xl sm:rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5" />
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-bold text-foreground leading-tight tracking-tight">{formatTime(apt.startTime)}</p>
                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">até {formatTime(apt.endTime)}</p>
                      </div>
                    </div>

                    {/* Bloco de Cliente e Serviço */}
                    <div className="flex-1 space-y-1 sm:space-y-1.5 border-l-2 border-transparent sm:border-muted sm:pl-4 ml-1 sm:ml-0">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                        <p className="text-sm sm:text-base font-semibold text-foreground">{apt.clientName}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Scissors className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <p className="font-medium">{apt.serviceName}</p>
                      </div>
                    </div>

                    {/* Bloco de Status */}
                    <div className="flex justify-start sm:justify-end mt-1 sm:mt-0">
                      <span className={`inline-flex items-center rounded-full border px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Link no mobile */}
        {!loadingToday && appointments.length > 0 && (
          <div className="border-t border-border bg-muted/10 p-3 sm:p-4 text-center sm:hidden">
            <Link href="/agenda" className="text-sm font-medium text-primary">
              Ver agenda completa →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}