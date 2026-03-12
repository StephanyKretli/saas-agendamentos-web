"use client";

import { useBlockedSlots } from "../hooks/use-blocked-slots";
import { useDeleteBlockedSlot } from "../hooks/use-delete-blocked-slot";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BlockedSlotList() {
  const { data, isLoading, isError, error } = useBlockedSlots();
  const deleteMutation = useDeleteBlockedSlot();

  const items = (data ?? []).slice().sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando bloqueios...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Não foi possível carregar os bloqueios."}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Nenhum bloqueio de horário cadastrado.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {formatDateTime(item.start)} → {formatDateTime(item.end)}
            </p>

            {item.reason ? (
              <p className="text-sm text-muted-foreground">Motivo: {item.reason}</p>
            ) : null}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => deleteMutation.mutate(item.id)}
              disabled={deleteMutation.isPending}
              className="rounded-lg border border-destructive/20 px-3 py-2 text-sm font-medium text-destructive disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>

          {deleteMutation.isError ? (
            <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
              {deleteMutation.error instanceof Error
                ? deleteMutation.error.message
                : "Não foi possível excluir o bloqueio."}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}