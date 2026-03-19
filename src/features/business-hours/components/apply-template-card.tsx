"use client";

import { useMemo, useState } from "react";
import { useApplyBusinessHoursTemplate } from "../hooks/use-apply-template";

type BusinessHourItem = {
  id: string;
  weekday: number;
  start: string;
  end: string;
};

type ApplyTemplateCardProps = {
  businessHours: BusinessHourItem[];
};

const WEEKDAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export function ApplyTemplateCard({
  businessHours,
}: ApplyTemplateCardProps) {
  const [sourceWeekday, setSourceWeekday] = useState("");
  const [targetWeekdays, setTargetWeekdays] = useState<number[]>([]);
  const [replace, setReplace] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useApplyBusinessHoursTemplate();

  const availableSourceDays = useMemo(() => {
    const uniqueWeekdays = Array.from(
      new Set(businessHours.map((item) => item.weekday)),
    ).sort((a, b) => a - b);

    return WEEKDAYS.filter((day) => uniqueWeekdays.includes(day.value));
  }, [businessHours]);

  function toggleTargetWeekday(weekday: number) {
    setTargetWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday].sort((a, b) => a - b),
    );
  }

  async function handleApplyTemplate() {
    setError(null);

    if (sourceWeekday === "") {
      setError("Selecione o dia de origem.");
      return;
    }

    if (!targetWeekdays.length) {
      setError("Selecione pelo menos um dia de destino.");
      return;
    }

    if (targetWeekdays.includes(Number(sourceWeekday))) {
      setError("O dia de origem não pode estar entre os dias de destino.");
      return;
    }

    try {
      await mutateAsync({
        sourceWeekday: Number(sourceWeekday),
        targetWeekdays,
        replace,
      });

      setTargetWeekdays([]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível copiar os horários.";
      setError(message);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Copiar horários para outros dias
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um dia já configurado e replique os mesmos horários para
          outros dias da semana.
        </p>
      </div>

      {!availableSourceDays.length ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
          Cadastre pelo menos um horário antes de usar esta funcionalidade.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Dia de origem
            </label>
            <select
              value={sourceWeekday}
              onChange={(e) => setSourceWeekday(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              <option value="">Selecione um dia</option>
              {availableSourceDays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Somente dias que já possuem horários cadastrados aparecem aqui.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              Dias de destino
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Marque os dias que devem receber os horários do dia de origem.
            </p>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {WEEKDAYS.map((day) => {
                const isDisabled = sourceWeekday === String(day.value);
                const isChecked = targetWeekdays.includes(day.value);

                return (
                  <label
                    key={day.value}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background"
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => toggleTargetWeekday(day.value)}
                    />
                    <span>{day.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/20 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="block font-medium text-foreground">
                Substituir horários existentes
              </span>
              <span className="mt-1 block text-muted-foreground">
                Quando ativado, os horários atuais dos dias de destino serão
                removidos antes da cópia.
              </span>
            </span>
          </label>

          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={() => void handleApplyTemplate()}
            disabled={isPending}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {isPending ? "Aplicando..." : "Copiar horários"}
          </button>
        </div>
      )}
    </div>
  );
}