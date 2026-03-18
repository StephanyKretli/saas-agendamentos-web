"use client";

type DaySummaryProps = {
  totalBusy: number;
  scheduled: number;
  completed: number;
  canceled: number;
  free: number;
  blocked: number;
};

type SummaryCardProps = {
  label: string;
  value: number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function DaySummary({
  totalBusy,
  scheduled,
  completed,
  canceled,
  free,
  blocked,
}: DaySummaryProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <SummaryCard label="Agendamentos" value={totalBusy} />
      <SummaryCard label="Agendados" value={scheduled} />
      <SummaryCard label="Concluídos" value={completed} />
      <SummaryCard label="Cancelados" value={canceled} />
      <SummaryCard label="Livres" value={free} />
      <SummaryCard label="Bloqueados" value={blocked} />
    </div>
  );
}