"use client";

import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { useDashboardToday } from "@/features/dashboard/hooks/use-dashboard-today";
import { DollarSign, Calendar as CalendarIcon, XCircle, Award, CheckCircle, Loader2, Clock, User, Scissors } from "lucide-react";
import type { TodayAppointment } from "@/features/dashboard/types/dashboard.types";

// Função simples para formatar a hora (caso venha em formato ISO da base de dados)
function formatTime(dateString: string) {
  // Se já vier "09:00", devolve assim. Se for ISO, formata.
  if (dateString.length <= 5) return dateString; 
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(dateString));
}

// Dicionário de cores para os status
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "bg-amber-100 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "Confirmado", color: "bg-blue-100 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Concluído", color: "bg-green-100 text-green-700 border-green-200" },
  CANCELED: { label: "Cancelado", color: "bg-red-100 text-red-700 border-red-200" },
};

export default function DashboardPage() {
  const { data: metrics, isLoading: loadingMetrics, isError: errorMetrics } = useDashboardMetrics();
  const { data: todayAgenda, isLoading: loadingToday } = useDashboardToday();

  const appointments: TodayAppointment[] = Array.isArray(todayAgenda) 
    ? todayAgenda 
    : (todayAgenda as any)?.items ?? (todayAgenda as any)?.data ?? [];

  if (loadingMetrics) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">A carregar o seu painel...</p>
        </div>
      </div>
    );
  }

  if (errorMetrics || !metrics) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
        <p className="font-medium">Erro ao carregar o dashboard.</p>
        <p className="text-sm opacity-80">Não foi possível conectar com o servidor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* CABEÇALHO */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Visão Geral</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe o desempenho do seu negócio referente a <strong className="text-foreground">{metrics.month}</strong>.
        </p>
      </div>

      {/* CARDS PRINCIPAIS (RECEITA E SUCESSO) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Receita Esperada</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{metrics.expectedRevenueFormatted}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Receita Realizada</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-foreground">{metrics.realizedRevenueFormatted}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Cancelamentos</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="text-2xl font-bold text-foreground">{metrics.cancelRate}%</p>
            <p className="text-xs font-medium text-muted-foreground">da agenda</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Serviço Destaque</p>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-4 truncate text-xl font-bold text-foreground" title={metrics.mostBookedService?.name || "Nenhum"}>
            {metrics.mostBookedService?.name || "N/A"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {metrics.mostBookedService?.count ? `${metrics.mostBookedService.count} agendamentos` : "Sem dados"}
          </p>
        </div>
      </div>

      {/* NOVA SECÇÃO: AGENDA DE HOJE */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Agenda de Hoje</h2>
        
        {loadingToday ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-muted" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-sm">
            <CalendarIcon className="mx-auto h-8 w-8 text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">Não tem agendamentos marcados para hoje.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {appointments.map((apt) => {
              // Verifica se o status existe no nosso mapa, se não, usa um padrão cinza
              const status = statusMap[apt.status] || { label: apt.status, color: "bg-muted text-muted-foreground border-border" };
              
              return (
                <div key={apt.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between transition-all hover:border-primary/30">
                  
                  {/* Bloco de Horário */}
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Clock className="h-4 w-4 mb-0.5" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground leading-tight">{formatTime(apt.startTime)}</p>
                      <p className="text-xs font-medium text-muted-foreground">até {formatTime(apt.endTime)}</p>
                    </div>
                  </div>

                  {/* Bloco de Cliente e Serviço */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground">{apt.clientName}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Scissors className="h-3.5 w-3.5" />
                      <p>{apt.serviceName}</p>
                    </div>
                  </div>

                  {/* Bloco de Status */}
                  <div className="flex justify-start md:justify-end">
                    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}