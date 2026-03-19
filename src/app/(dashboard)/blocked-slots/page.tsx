"use client";

import { useBlockedDates } from "@/features/blocked-dates/hooks/use-blocked-dates";
import { useBlockedSlots } from "@/features/blocked-slots/hooks/use-blocked-slots";

import { BlockedDatesForm } from "@/features/blocked-dates/components/blocked-dates-form";
import { BlockedDatesList } from "@/features/blocked-dates/components/blocked-dates-list";

import { BlockedSlotForm } from "@/features/blocked-slots/components/blocked-slot-form";
import { BlockedSlotList } from "@/features/blocked-slots/components/blocked-slot-list";

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function BlockedSlotsPage() {
  const {
    data: blockedDates,
    isLoading: loadingDates,
    isError: errorDates,
    error: datesError,
  } = useBlockedDates();

  const {
    data: blockedSlots,
    isLoading: loadingSlots,
    isError: errorSlots,
    error: slotsError,
  } = useBlockedSlots();

  const dates = blockedDates ?? [];
  const slots = blockedSlots ?? [];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bloqueios de agenda
        </h1>
        <p className="text-sm text-muted-foreground">
          Controle datas e horários em que você não estará disponível.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Dias bloqueados" value={dates.length} />
        <StatCard label="Horários bloqueados" value={slots.length} />
        <StatCard label="Total de bloqueios" value={dates.length + slots.length} />
      </div>

      {/* BLOQUEIO DE DIAS */}
      <section className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Bloquear dias inteiros
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use para férias, feriados ou dias em que você não atenderá.
          </p>

          <div className="mt-5">
            <BlockedDatesForm />
          </div>
        </div>

        {loadingDates ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : errorDates ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {datesError instanceof Error
              ? datesError.message
              : "Erro ao carregar bloqueios de datas."}
          </div>
        ) : !dates.length ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
            Nenhum dia bloqueado.
          </div>
        ) : (
              <BlockedDatesList />
            )}
      </section>

      {/* BLOQUEIO DE HORÁRIOS */}
      <section className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            Bloquear horários específicos
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use para pausas, reuniões ou indisponibilidades pontuais.
          </p>

          <div className="mt-5">
            <BlockedSlotForm />
          </div>
        </div>

        {loadingSlots ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>
        ) : errorSlots ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {slotsError instanceof Error
              ? slotsError.message
              : "Erro ao carregar bloqueios de horários."}
          </div>
        ) : !slots.length ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
            Nenhum horário bloqueado.
          </div>
        ) : (
              <BlockedSlotList />
            )}
      </section>
    </div>
  );
}