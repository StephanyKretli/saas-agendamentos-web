"use client";

import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      {helper ? (
        <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  );
}

function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-");
  const date = new Date(Number(year), Number(monthNumber) - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatPercent(value: string | number) {
  const numericValue =
    typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(numericValue)) return "0%";

  return `${numericValue.toFixed(2)}%`;
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardMetrics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Carregando visão geral do mês...
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-border bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a visão geral.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar as métricas do dashboard."}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const monthLabel = formatMonthLabel(data.month);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral de {monthLabel}.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Serviço mais agendado
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {data.mostBookedService
              ? `${data.mostBookedService.name} (${data.mostBookedService.count})`
              : "Nenhum agendamento ainda"}
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Agendamentos no mês"
          value={data.totalAppointments}
          helper="Total registrado no período atual"
        />
        <MetricCard
          label="Agendados"
          value={data.scheduled}
          helper="Ainda previstos para acontecer"
        />
        <MetricCard
          label="Concluídos"
          value={data.completed}
          helper="Atendimentos finalizados"
        />
        <MetricCard
          label="Cancelados"
          value={data.canceled}
          helper="Atendimentos que não aconteceram"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          label="Receita esperada"
          value={`R$ ${data.expectedRevenueFormatted}`}
          helper="Com base nos agendamentos marcados"
        />
        <MetricCard
          label="Receita realizada"
          value={`R$ ${data.realizedRevenueFormatted}`}
          helper="Com base nos atendimentos concluídos"
        />
        <MetricCard
          label="Taxa de cancelamento"
          value={formatPercent(data.cancelRate)}
          helper="Percentual de agendamentos cancelados no mês"
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          Leitura rápida do mês
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Você tem {data.totalAppointments} agendamento(s) registrado(s) em{" "}
              {monthLabel}.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Desses, {data.completed} foram concluídos, {data.scheduled} ainda
              estão agendados e {data.canceled} foram cancelados.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
            <p className="text-sm font-medium text-foreground">
              Receita esperada: R$ {data.expectedRevenueFormatted}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Receita realizada: R$ {data.realizedRevenueFormatted}. A taxa de
              cancelamento do período está em {formatPercent(data.cancelRate)}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}