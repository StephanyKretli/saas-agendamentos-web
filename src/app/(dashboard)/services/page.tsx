"use client";

import * as React from "react";
import { ServiceForm } from "@/features/services/components/service-form";
import { ServiceCard } from "@/features/services/components/service-card";
import { useServices } from "@/features/services/hooks/use-services";
import { useCreateService } from "@/features/services/hooks/use-create-service";
import { useUpdateService } from "@/features/services/hooks/use-update-service";

type ServiceItem = {
  id: string;
  name: string;
  duration: number;
  priceCents: number;
};

export default function ServicesPage() {
  const { data, isLoading, isError, error } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const [editingService, setEditingService] = React.useState<ServiceItem | null>(
    null,
  );

  const items = React.useMemo<ServiceItem[]>(() => {
    const rawItems: ServiceItem[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.items)
        ? data.items
        : [];

    return rawItems
      .map((service: ServiceItem) => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        priceCents: service.priceCents,
      }))
      .sort((a: ServiceItem, b: ServiceItem) => a.name.localeCompare(b.name));
  }, [data]);

  const isEditing = editingService !== null;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Serviços</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre, edite e remova os serviços que você oferece.
        </p>
      </div>

      <div className="rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="mb-3 font-medium text-foreground">
          {isEditing ? "Editar serviço" : "Novo serviço"}
        </h2>

        <ServiceForm
          initialValues={
            editingService
              ? {
                  name: editingService.name,
                  duration: editingService.duration,
                  price: editingService.priceCents / 100,
                }
              : undefined
          }
          submitLabel={isEditing ? "Salvar alterações" : "Salvar"}
          isSubmitting={isSubmitting}
          onCancel={isEditing ? () => setEditingService(null) : undefined}
          onSubmit={(values) => {
            const payload = {
              name: values.name,
              duration: values.duration,
              priceCents: Math.round(values.price * 100),
            };

            if (editingService) {
              updateMutation.mutate(
                {
                  id: editingService.id,
                  ...payload,
                },
                {
                  onSuccess: () => {
                    setEditingService(null);
                  },
                },
              );
              return;
            }

            createMutation.mutate(payload);
          }}
        />

        {createMutation.isError ? (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Não foi possível criar o serviço."}
          </div>
        ) : null}

        {updateMutation.isError ? (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Não foi possível atualizar o serviço."}
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando serviços...</p>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar os serviços."}
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum serviço cadastrado.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item: ServiceItem) => (
            <ServiceCard
              key={item.id}
              service={item}
              onEdit={() => setEditingService(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}