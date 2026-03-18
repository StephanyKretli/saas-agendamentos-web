"use client";

import type { Service } from "../types/services.types";
import { useDeleteService } from "../hooks/use-delete-service";
import { ServiceImageUpload } from "./service-image-upload";

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
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">
            {service.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {service.duration} min
          </p>
          <p className="text-sm font-medium text-foreground">
            {formatPrice(service.priceCents)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
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
      </div>

      {deleteMutation.isError ? (
        <p className="text-sm text-red-600">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Não foi possível excluir o serviço."}
        </p>
      ) : null}

      <ServiceImageUpload service={service} />
    </div>
  );
}