"use client"

import { useBlockedDates } from "../hooks/use-blocked-dates"
import { useDeleteBlockedDate } from "../hooks/use-delete-blocked-date"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

export function BlockedDatesList() {
  const { data = [], isLoading, isError } = useBlockedDates()
  const { mutate } = useDeleteBlockedDate()

  if (isLoading) {
    return <p>Carregando bloqueios...</p>
  }

  if (isError) {
    return <p>Erro ao carregar bloqueios.</p>
  }

  if (!data.length) {
    return <p>Nenhum bloqueio cadastrado.</p>
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-xl border p-4"
        >
          <div>
            <p className="font-medium">
              {formatDate(item.date)}
            </p>

            {item.reason && (
              <p className="text-sm text-zinc-500">
                Motivo: {item.reason}
              </p>
            )}
          </div>

          <button
            onClick={() => mutate(item.id)}
            className="text-sm text-red-600"
          >
            Excluir
          </button>
        </div>
      ))}
    </div>
  )
}