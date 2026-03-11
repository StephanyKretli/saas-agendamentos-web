"use client"

import { FormEvent, useState } from "react"
import { useCreateBlockedDate } from "../hooks/use-create-blocked-date"

export function BlockedDatesForm() {
  const [date, setDate] = useState("")
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useCreateBlockedDate()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!date) {
      setError("Selecione uma data.")
      return
    }

    try {
      await mutateAsync({
        date,
        reason: reason.trim() || undefined,
      })

      setDate("")
      setReason("")
    } catch {
      setError("Não foi possível criar o bloqueio.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">
        Novo bloqueio
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Bloqueie um dia inteiro para evitar novos agendamentos.
      </p>

      <div className="mt-4">
        <label className="text-sm font-medium text-zinc-800">
          Data
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
        />
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium text-zinc-800">
          Motivo (opcional)
        </label>

        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex.: férias, consulta, compromisso"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2"
        />
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-white"
      >
        {isPending ? "Salvando..." : "Criar bloqueio"}
      </button>
    </form>
  )
}