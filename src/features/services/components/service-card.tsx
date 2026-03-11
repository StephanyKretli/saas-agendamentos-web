"use client";

import type { Service } from "../types/services.types";
import { useDeleteService } from "../hooks/use-delete-service";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

type Props = {
  service: Service;
  onEdit: () => void;
};

export function ServiceCard({ service, onEdit }: Props) {
  const deleteMutation = useDeleteService();

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {service.duration} min
        </p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(service.priceCents)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => deleteMutation.mutate(service.id)}
          disabled={deleteMutation.isPending}
          className="rounded-lg border border-destructive/20 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-60"
        >
          {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>

      {deleteMutation.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Não foi possível excluir o serviço."}
        </div>
      ) : null}
    </div>
  );
}