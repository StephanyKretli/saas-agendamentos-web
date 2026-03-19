"use client";

import { useBusinessHours } from "@/features/business-hours/hooks/use-business-hours";
import { useCreateBusinessHour } from "@/features/business-hours/hooks/use-create-business-hour";
import { BusinessHourForm } from "@/features/business-hours/components/business-hour-form";
import { BusinessHourCard } from "@/features/business-hours/components/business-hour-card";
import { ApplyTemplateCard } from "@/features/business-hours/components/apply-template-card";

const weekdaysMap: Record<number, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function BusinessHoursPage() {
  const { data, isLoading, isError, error } = useBusinessHours();
  const createMutation = useCreateBusinessHour();

  const items = (data ?? [])
    .slice()
    .sort((a, b) => {
      if (a.weekday !== b.weekday) return a.weekday - b.weekday;
      return a.start.localeCompare(b.start);
    });

  const configuredDays = new Set(items.map((item) => item.weekday)).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Horários de funcionamento
        </h1>
        <p className="text-sm text-muted-foreground">
          Defina os horários em que você atende durante a semana.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Horários cadastrados" value={items.length} />
        <StatCard label="Dias configurados" value={configuredDays} />
        <StatCard
          label="Próximo passo"
          value={items.length ? 1 : 0}
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Novo horário
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cadastre novos horários de atendimento para os dias da semana.
              </p>
            </div>

            <BusinessHourForm
              onSubmit={(values) => createMutation.mutate(values)}
              isSubmitting={createMutation.isPending}
            />

            {createMutation.isError ? (
              <p className="mt-4 text-sm text-red-600">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : "Não foi possível salvar o horário."}
              </p>
            ) : null}
          </div>

          <ApplyTemplateCard businessHours={items} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">
              Horários cadastrados
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Revise, edite ou remova seus horários atuais.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-border bg-muted"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
              {error instanceof Error
                ? error.message
                : "Não foi possível carregar os horários."}
            </div>
          ) : !items.length ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
              Nenhum horário cadastrado.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <BusinessHourCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {!!items.length ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Dias configurados
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from(new Set(items.map((item) => item.weekday)))
              .sort((a, b) => a - b)
              .map((weekday) => (
                <span
                  key={weekday}
                  className="rounded-full bg-muted px-3 py-1.5 text-sm text-foreground"
                >
                  {weekdaysMap[weekday]}
                </span>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}