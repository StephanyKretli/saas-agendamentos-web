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
  const numericValue = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(numericValue)) return "0%";
  return `${numericValue.toFixed(2)}%`;
}

function parseMoney(formatted: string) {
  const normalized = formatted.includes(",")
    ? formatted.replace(/\./g, "").replace(",", ".")
    : formatted;

  const value = Number(normalized);
  return Number.isNaN(value) ? 0 : value;
}

function ProgressBar({
  label,
  value,
  total,
  tone = "default",
}: {
  label: string;
  value: number;
  total: number;
  tone?: "default" | "success" | "danger";
}) {
  const percent = total > 0 ? (value / total) * 100 : 0;

  const toneClass =
    tone === "success"
      ? "bg-green-500"
      : tone === "danger"
        ? "bg-red-500"
        : "bg-primary";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          {value} ({percent.toFixed(0)}%)
        </p>
      </div>

      <div className="h-3 rounded-full bg-muted">
        <div
          className={`h-3 rounded-full transition-all ${toneClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function ComparisonBar({
  label,
  value,
  max,
  prefix = "",
}: {
  label: string;
  value: number;
  max: number;
  prefix?: string;
}) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          {prefix}
          {value.toFixed(2)}
        </p>
      </div>

      <div className="h-3 rounded-full bg-muted">
        <div
          className="h-3 rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
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
  const expectedRevenue = parseMoney(data.expectedRevenueFormatted);
  const realizedRevenue = parseMoney(data.realizedRevenueFormatted);
  const revenueMax = Math.max(expectedRevenue, realizedRevenue, 1);

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

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Distribuição dos agendamentos
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare rapidamente os status do mês.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <ProgressBar
              label="Agendados"
              value={data.scheduled}
              total={data.totalAppointments}
            />
            <ProgressBar
              label="Concluídos"
              value={data.completed}
              total={data.totalAppointments}
              tone="success"
            />
            <ProgressBar
              label="Cancelados"
              value={data.canceled}
              total={data.totalAppointments}
              tone="danger"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Receita do período
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Veja a diferença entre o esperado e o realizado.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <ComparisonBar
              label="Receita esperada"
              value={expectedRevenue}
              max={revenueMax}
              prefix="R$ "
            />
            <ComparisonBar
              label="Receita realizada"
              value={realizedRevenue}
              max={revenueMax}
              prefix="R$ "
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Esperada
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                R$ {data.expectedRevenueFormatted}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Realizada
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                R$ {data.realizedRevenueFormatted}
              </p>
            </div>
          </div>
        </div>
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