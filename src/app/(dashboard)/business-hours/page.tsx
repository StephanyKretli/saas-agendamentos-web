"use client";

import { useBusinessHours } from "@/features/business-hours/hooks/use-business-hours";
import { useCreateBusinessHour } from "@/features/business-hours/hooks/use-create-business-hour";
import { BusinessHourForm } from "@/features/business-hours/components/business-hour-form";
import { BusinessHourCard } from "@/features/business-hours/components/business-hour-card";
import { ApplyTemplateCard } from "@/features/business-hours/components/apply-template-card";

export default function BusinessHoursPage() {
  const { data, isLoading, isError, error } = useBusinessHours();
  const createMutation = useCreateBusinessHour();

  const items = (data ?? []).slice().sort((a, b) => {
    if (a.weekday !== b.weekday) return a.weekday - b.weekday;
    return a.start.localeCompare(b.start);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Horários de funcionamento
        </h1>
        <p className="text-sm text-muted-foreground">
          Defina os horários em que você atende durante a semana.
        </p>
      </div>

      <div className="rounded-2xl border border-border p-5 shadow-sm">
        <h2 className="mb-3 font-medium text-foreground">Novo horário</h2>

        <BusinessHourForm
          onSubmit={(values) => createMutation.mutate(values)}
          isSubmitting={createMutation.isPending}
        />

        {createMutation.isError ? (
          <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : "Não foi possível salvar o horário."}
          </div>
        ) : null}
      </div>

      <ApplyTemplateCard businessHours={items} />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando horários...</p>
      ) : isError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar os horários."}
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum horário cadastrado.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <BusinessHourCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}