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

export function BlockedDatesList() {
  const { data = [] } = useBlockedDates();
  const { mutate, isPending } = useDeleteBlockedDate();

  const sortedData = useMemo(() => {
    // 1. Pegamos a data de hoje e zeramos as horas (para comparar dias inteiros)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...data]
      // 2. A MÁGICA AQUI: Só passa quem for maior ou igual a hoje
      .filter((item) => new Date(item.date).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  return (
    <div className="grid gap-3">
      {sortedData.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formatBlockedDate(item.date)}
            </p>
            {item.reason && (
              <p className="mt-1 text-sm text-muted-foreground">Motivo: {item.reason}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => mutate(item.id)}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          >
            {isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      ))}
    </div>
  );
}