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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      {isEditing ? (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-foreground">Editar horário</h3>

          <BusinessHourForm
            defaultValues={{
              weekday: item.weekday,
              start: item.start,
              end: item.end,
            }}
            onSubmit={handleUpdate}
            isSubmitting={updateMutation.isPending}
            submitLabel="Atualizar"
          />

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-foreground"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {weekdaysMap[item.weekday] ?? `Dia ${item.weekday}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.start} — {item.end}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white"
            >
              Editar
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-3 py-1 text-xs text-white"
            >
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}