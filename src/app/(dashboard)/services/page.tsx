"use client";

import { useCreateService } from "@/features/services/hooks/use-create-service";
import { useServices } from "@/features/services/hooks/use-services";
import { ServiceCard } from "@/features/services/components/service-card";
import { ServiceForm } from "@/features/services/components/service-form";
import type { Service } from "@/features/services/types/services.types";

function normalizeServices(data: unknown): Service[] {
  if (Array.isArray(data)) {
    return data as Service[];
  }

  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: Service[] }).items;
  }

  return [];
}

export default function ServicesPage() {
  const { data, isLoading, isError, error } = useServices();
  const createServiceMutation = useCreateService();

  const services = normalizeServices(data);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Serviços</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie os serviços oferecidos.
        </p>
      </div>

      <div className="rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="mb-3 font-medium text-foreground">Novo serviço</h2>

        <ServiceForm
          isSubmitting={createServiceMutation.isPending}
          onSubmit={(values) =>
            createServiceMutation.mutate({
              name: values.name,
              duration: values.duration,
              priceCents: Math.round(values.price * 100),
            })
          }
        />

        {createServiceMutation.isError ? (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            {createServiceMutation.error instanceof Error
              ? createServiceMutation.error.message
              : "Não foi possível salvar o serviço."}
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
      ) : !services.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum serviço encontrado.
        </div>
      ) : (
        <div className="grid gap-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}