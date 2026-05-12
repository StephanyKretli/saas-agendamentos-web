"use client";

import { useMemo } from "react";
import { useBlockedSlots } from "../hooks/use-blocked-slots";
import { useDeleteBlockedSlot } from "../hooks/use-delete-blocked-slot";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

type Props = {
  professionalId: string;
};

export function BlockedSlotList({ professionalId }: Props) {
  const { data = [] } = useBlockedSlots(professionalId);
  const deleteMutation = useDeleteBlockedSlot();

  const items = useMemo(() => {
    // 🌟 Apenas ordena, o filtro já foi feito no Hook!
    return [...data].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
  }, [data]);

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all hover:border-primary/20"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formatDateTime(item.start)} → {formatDateTime(item.end)}
            </p>
            {item.reason && (
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">Motivo: {item.reason}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60 shrink-0"
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      ))}
    </div>
  );
}