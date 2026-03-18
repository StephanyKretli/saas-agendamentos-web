"use client";

type TimelineFreeItemCardProps = {
  start: string;
  end: string;
};

export function TimelineFreeItemCard({
  start,
  end,
}: TimelineFreeItemCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Horário livre</p>
          <p className="text-xs text-muted-foreground">
            {start} - {end}
          </p>
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          Disponível
        </span>
      </div>
    </div>
  );
}