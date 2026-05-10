"use client"

import { FormEvent, useState } from "react"
import { useCreateBlockedDate } from "../hooks/use-create-blocked-date"

// 🌟 Tipagem adicionada
type Props = {
  professionalId: string;
};

export function BlockedDatesForm({ professionalId }: Props) {
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  // 🌟 Repassando o ID para o hook
  const { mutateAsync, isPending } = useCreateBlockedDate(professionalId)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!date) {
      setError("Selecione uma data.")
      return
    }

    try {
      await mutateAsync({ date, reason: reason.trim() || undefined })
      setDate("")
      setReason("")
    } catch {
      setError("Não foi possível criar o bloqueio.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Novo bloqueio de dia inteiro</h2>
      <p className="mt-1 text-sm text-muted-foreground">Bloqueie um dia inteiro para evitar novos agendamentos.</p>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium text-foreground">Data</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium text-foreground">Motivo (opcional)</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex.: férias, feriado, fecho para obras"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && <div className="mt-4 text-sm text-destructive">{error}</div>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Salvando..." : "Criar bloqueio"}
      </button>
    </form>
  )
}