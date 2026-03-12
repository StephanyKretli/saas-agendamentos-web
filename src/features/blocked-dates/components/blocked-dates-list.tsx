"use client";

import { useMemo } from "react";
import { useBlockedDates } from "../hooks/use-blocked-dates";
import { useDeleteBlockedDate } from "../hooks/use-delete-blocked-date";

function formatBlockedDate(dateString: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

export function BlockedDatesList() {
  const { data = [], isLoading, isError } = useBlockedDates();
  const { mutate, isPending } = useDeleteBlockedDate();

  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-zinc-500">Carregando bloqueios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-red-600">
          Não foi possível carregar os bloqueios.
        </p>
      </div>
    );
  }

  if (!sortedData.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          Bloqueios cadastrados
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Você ainda não criou nenhum bloqueio de agenda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">
          Bloqueios cadastrados
        </h2>
      </div>

      <div className="space-y-3">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {formatBlockedDate(item.date)}
              </p>

              {item.reason && (
                <p className="mt-1 text-sm text-zinc-500">
                  Motivo: {item.reason}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => mutate(item.id)}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}