"use client";

import * as React from "react";
import { useCreateBlockedSlot } from "../hooks/use-create-blocked-slot";

function combineDateTime(date: string, time: string) {
  // 1. Separamos as partes exatas da data e hora
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  
  // 2. Criamos o objeto Date forçando o fuso horário local do navegador
  const localDate = new Date(year, month - 1, day, hour, minute);
  
  // 3. Convertamos para o padrão universal (UTC) que o banco de dados entende perfeitamente
  return localDate.toISOString();
}

// 🌟 Tipagem adicionada
type Props = {
  professionalId: string;
};

export function BlockedSlotForm({ professionalId }: Props) {
  // 🌟 Repassando o ID para o hook
  const createMutation = useCreateBlockedSlot(professionalId);

  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Selecione uma data.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Preencha o horário inicial e final.");
      return;
    }

    if (startTime >= endTime) {
      setError("O horário final deve ser maior que o horário inicial.");
      return;
    }

    const start = combineDateTime(date, startTime);
    const end = combineDateTime(date, endTime);

    createMutation.mutate(
      {
        start,
        end,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          setDate("");
          setStartTime("");
          setEndTime("");
          setReason("");
        },
        onError: (err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível criar o bloqueio.",
          );
        },
      },
    );
  }

  return (
    <div className="rounded-2xl border border-border p-5 shadow-sm">
      <h2 className="mb-3 font-medium text-foreground">Novo bloqueio de horário</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Data</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-input px-3 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Horário inicial
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-input px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Horário final
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-input px-3 py-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Motivo (opcional)
          </label>
          <input
            type="text"
            placeholder="Ex.: almoço, reunião, compromisso pessoal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-input px-3 py-2"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {createMutation.isPending ? "Salvando..." : "Salvar bloqueio"}
        </button>
      </form>
    </div>
  );
}