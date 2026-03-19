"use client";

import * as React from "react";
import { BusinessHourForm } from "./business-hour-form";
import { useUpdateBusinessHour } from "../hooks/use-update-business-hour";
import { useDeleteBusinessHour } from "../hooks/use-delete-business-hour";
import type { BusinessHour } from "../types/business-hours.types";

const weekdaysMap: Record<number, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

export function BusinessHourCard({ item }: { item: BusinessHour }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const updateMutation = useUpdateBusinessHour();
  const deleteMutation = useDeleteBusinessHour();

  function handleUpdate(values: {
    weekday: number;
    start: string;
    end: string;
  }) {
    updateMutation.mutate(
      {
        id: item.id,
        payload: values,
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  }

  function handleDelete() {
    deleteMutation.mutate(item.id);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Editando horário
              </p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">
                {weekdaysMap[item.weekday] ?? `Dia ${item.weekday}`}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Cancelar
            </button>
          </div>

          <BusinessHourForm
            defaultValues={{
              weekday: item.weekday,
              start: item.start,
              end: item.end,
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateMutation.isPending}
            submitLabel="Salvar alterações"
          />

          {updateMutation.isError ? (
            <p className="text-sm text-red-600">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Não foi possível atualizar o horário."}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Dia
            </p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              {weekdaysMap[item.weekday] ?? `Dia ${item.weekday}`}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {item.start} — {item.end}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-xl border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-60"
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      )}

      {deleteMutation.isError ? (
        <p className="mt-4 text-sm text-red-600">
          {deleteMutation.error instanceof Error
            ? deleteMutation.error.message
            : "Não foi possível excluir o horário."}
        </p>
      ) : null}
    </div>
  );
}