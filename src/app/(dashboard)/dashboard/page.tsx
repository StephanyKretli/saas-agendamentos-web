"use client";

import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";

type MetricCardProps = {
  label: string;
  value: string | number;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold text-foreground">{value}</h2>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Não foi possível carregar as métricas do dashboard."}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral do mês {data.month}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Agendamentos do mês"
          value={data.totalAppointments}
        />
        <MetricCard label="Agendados" value={data.scheduled} />
        <MetricCard label="Concluídos" value={data.completed} />
        <MetricCard label="Cancelados" value={data.canceled} />
        <MetricCard
          label="Receita esperada"
          value={`R$ ${data.expectedRevenueFormatted}`}
        />
        <MetricCard
          label="Receita realizada"
          value={`R$ ${data.realizedRevenueFormatted}`}
        />
        <MetricCard label="Taxa de cancelamento" value={`${data.cancelRate}%`} />
        <MetricCard
          label="Serviço mais agendado"
          value={
            data.mostBookedService
              ? `${data.mostBookedService.name} (${data.mostBookedService.count})`
              : "Nenhum"
          }
        />
      </div>
    </div>
  );
}