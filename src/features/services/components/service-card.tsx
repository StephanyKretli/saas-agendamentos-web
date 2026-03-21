"use client";

import type { Service } from "../types/services.types";
import { useDeleteService } from "../hooks/use-delete-service";
import { ServiceImageUpload } from "./service-image-upload";
import { Button } from "@/components/ui/button";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

interface ServiceCardProps {
  service: Service;
  onDeleteSuccess?: () => void;
  onEdit?: () => void; // Adicionamos aqui para evitar erro no botão de editar
}

export function ServiceCard({ service, onDeleteSuccess, onEdit }: ServiceCardProps) {
  const deleteMutation = useDeleteService();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    await deleteMutation.mutateAsync(service.id, {
      onSuccess: () => {
        onDeleteSuccess?.();
      },
    });
  };

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
            {formatPrice(service.price)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
            >
              Editar
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>

      {/* O erro de delete agora é tratado pelo Toast global que configuramos, 
          então não precisamos mais desse bloco de erro manual aqui embaixo! 
      */}

      <ServiceImageUpload service={service} />
    </div>
  );
}