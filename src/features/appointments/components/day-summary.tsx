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
    <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <p 
        className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground truncate" 
        title={label}
      >
        {label}
      </p>
      <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

export function DaySummary({
  scheduled,
  completed,
  canceled,
  free,
  blocked,
}: DaySummaryProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 sm:gap-3">
      <SummaryCard label="Agendados" value={scheduled} />
      <SummaryCard label="Concluídos" value={completed} />
      <SummaryCard label="Cancelados" value={canceled} />
      <SummaryCard label="Livres" value={free} />
      <SummaryCard label="Bloqueados" value={blocked} />
    </div>
  );
}