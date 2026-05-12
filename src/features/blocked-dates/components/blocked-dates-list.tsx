"use client";

import { useMemo } from "react";
import { useBlockedDates } from "../hooks/use-blocked-dates";
import { useDeleteBlockedDate } from "../hooks/use-delete-blocked-date";

function formatBlockedDate(dateString: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

type Props = {
  professionalId: string;
};

export function BlockedDatesList({ professionalId }: Props) {
  const { data = [] } = useBlockedDates(professionalId);
  const { mutate, isPending } = useDeleteBlockedDate();

  const sortedData = useMemo(() => {
    // 🌟 Apenas ordena, o filtro já foi feito no Hook!
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  return (
    <div className="grid gap-3">
      {sortedData.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all hover:border-primary/20"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formatBlockedDate(item.date)}
            </p>
            {item.reason && (
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">Motivo: {item.reason}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => mutate(item.id)}
            disabled={isPending}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60 shrink-0"
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      ))}
    </div>
  );
}