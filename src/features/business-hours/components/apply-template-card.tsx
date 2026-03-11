"use client"

import { useMemo, useState } from "react"
import { useApplyBusinessHoursTemplate } from "../hooks/use-apply-template"

type BusinessHourItem = {
  id: string
  weekday: number
  start: string
  end: string
}

type ApplyTemplateCardProps = {
  businessHours: BusinessHourItem[]
}

const WEEKDAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
]

export function ApplyTemplateCard({
  businessHours,
}: ApplyTemplateCardProps) {
  const [sourceWeekday, setSourceWeekday] = useState<number | "">("")
  const [targetWeekdays, setTargetWeekdays] = useState<number[]>([])
  const [replace, setReplace] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { mutateAsync, isPending } = useApplyBusinessHoursTemplate()

  const availableSourceDays = useMemo(() => {
    const uniqueWeekdays = Array.from(
      new Set(businessHours.map((item) => item.weekday)),
    ).sort((a, b) => a - b)

    return WEEKDAYS.filter((day) => uniqueWeekdays.includes(day.value))
  }, [businessHours])

  function toggleTargetWeekday(weekday: number) {
    setTargetWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday].sort((a, b) => a - b),
    )
  }

  async function handleApplyTemplate() {
    setError(null)

    if (sourceWeekday === "") {
      setError("Selecione o dia de origem.")
      return
    }

    if (!targetWeekdays.length) {
      setError("Selecione pelo menos um dia de destino.")
      return
    }

    if (targetWeekdays.includes(sourceWeekday)) {
      setError("O dia de origem não pode estar entre os dias de destino.")
      return
    }

    try {
      await mutateAsync({
        sourceWeekday,
        targetWeekdays,
        replace,
      })

      setTargetWeekdays([])
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível copiar os horários."

      setError(message)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">
          Copiar horários para outros dias
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Escolha um dia já configurado e copie os mesmos horários para outros
          dias da semana.
        </p>
      </div>

      {!availableSourceDays.length ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre pelo menos um horário antes de usar esta funcionalidade.
        </div>
      ) : (
        <>
          <div className="mt-5">
            <label
              htmlFor="source-weekday"
              className="mb-1.5 block text-sm font-medium text-zinc-800"
            >
              Dia de origem
            </label>

            <select
              id="source-weekday"
              value={sourceWeekday}
              onChange={(e) => setSourceWeekday(Number(e.target.value))}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-900"
            >
              <option value="">Selecione um dia</option>
              {availableSourceDays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>

            <p className="mt-1 text-xs text-zinc-500">
              Somente dias que já possuem horários cadastrados aparecem aqui.
            </p>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-medium text-zinc-800">
              Dias de destino
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {WEEKDAYS.map((day) => {
                const isDisabled = sourceWeekday === day.value
                const isChecked = targetWeekdays.includes(day.value)

                return (
                  <label
                    key={day.value}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                      isDisabled
                        ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                        : "border-zinc-300 text-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => toggleTargetWeekday(day.value)}
                    />
                    <span>{day.label}</span>
                  </label>
                )
              })}
            </div>

            <p className="mt-1 text-xs text-zinc-500">
              Marque os dias que devem receber os horários do dia de origem.
            </p>
          </div>

          <div className="mt-5">
            <label className="flex items-start gap-3 rounded-xl border border-zinc-300 px-3 py-3 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={replace}
                onChange={(e) => setReplace(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-zinc-800">
                  Substituir horários existentes
                </span>
                <span className="mt-1 block text-zinc-500">
                  Quando ativado, os horários atuais dos dias de destino serão
                  removidos antes da cópia.
                </span>
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleApplyTemplate}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Aplicando..." : "Copiar horários"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}