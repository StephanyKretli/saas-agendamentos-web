"use client";

import * as React from "react";

const weekdays = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

type Props = {
  defaultValues?: {
    weekday: number;
    start: string;
    end: string;
  };
  onSubmit: (values: {
    weekday: number;
    start: string;
    end: string;
  }) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function BusinessHourForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Salvar",
}: Props) {
  const [weekday, setWeekday] = React.useState(defaultValues?.weekday ?? 1);
  const [start, setStart] = React.useState(defaultValues?.start ?? "09:00");
  const [end, setEnd] = React.useState(defaultValues?.end ?? "18:00");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit({
      weekday,
      start,
      end,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Dia da semana
          </label>
          <select
            value={weekday}
            onChange={(event) => setWeekday(Number(event.target.value))}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          >
            {weekdays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Escolha o dia em que esse horário ficará disponível.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Início
          </label>
          <input
            type="time"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Horário inicial de atendimento.
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">
            Fim
          </label>
          <input
            type="time"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Horário final de atendimento.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}