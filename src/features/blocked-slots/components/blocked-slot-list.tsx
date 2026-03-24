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

export function BlockedSlotList() {
  const { data = [] } = useBlockedSlots();
  const deleteMutation = useDeleteBlockedSlot();

  const items = useMemo(() => {
    const now = new Date().getTime();
    
    return [...data]
      .filter((item) => new Date(item.end).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }, [data]);

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              {formatDateTime(item.start)} → {formatDateTime(item.end)}
            </p>
            {item.reason && (
              <p className="mt-1 text-sm text-muted-foreground">Motivo: {item.reason}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => deleteMutation.mutate(item.id)}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center justify-center rounded-xl border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      ))}
    </div>
  );
}