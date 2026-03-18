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
  imageUrl?: string | null;
};

export default function ServicesPage() {
  const { data, isLoading, isError, error } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();

  const [editingService, setEditingService] = React.useState<ServiceItem | null>(
    null,
  );

  const items = React.useMemo(() => {
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
        imageUrl: service.imageUrl ?? null,
      }))
      .sort((a: ServiceItem, b: ServiceItem) => a.name.localeCompare(b.name));
  }, [data]);

  const isEditing = editingService !== null;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre, edite e remova os serviços que você oferece.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            {isEditing ? "Editar serviço" : "Novo serviço"}
          </h2>
        </div>

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
          isSubmitting={isSubmitting}
          submitLabel={isEditing ? "Salvar alterações" : "Cadastrar serviço"}
          onCancel={
            isEditing ? () => setEditingService(null) : undefined
          }
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
          <p className="mt-4 text-sm text-red-600">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Não foi possível criar o serviço."}
          </p>
        ) : null}

        {updateMutation.isError ? (
          <p className="mt-4 text-sm text-red-600">
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Não foi possível atualizar o serviço."}
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
            Carregando serviços...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "Não foi possível carregar os serviços."}
          </div>
        ) : !items.length ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
            Nenhum serviço cadastrado.
          </div>
        ) : (
          items.map((item: ServiceItem) => (
            <ServiceCard
              key={item.id}
              service={item}
              onEdit={() => setEditingService(item)}
            />
          ))
        )}
      </section>
    </div>
  );
}