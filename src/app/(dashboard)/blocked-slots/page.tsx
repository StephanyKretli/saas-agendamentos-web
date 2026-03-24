"use client";

import { useState } from "react";
import { useBlockedDates } from "@/features/blocked-dates/hooks/use-blocked-dates";
import { useBlockedSlots } from "@/features/blocked-slots/hooks/use-blocked-slots";

import { BlockedDatesForm } from "@/features/blocked-dates/components/blocked-dates-form";
import { BlockedDatesList } from "@/features/blocked-dates/components/blocked-dates-list";

import { BlockedSlotForm } from "@/features/blocked-slots/components/blocked-slot-form";
import { BlockedSlotList } from "@/features/blocked-slots/components/blocked-slot-list";

import { Calendar, Clock } from "lucide-react";

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
  // Estado para controlar qual aba está ativa
  const [activeTab, setActiveTab] = useState<"dates" | "slots">("dates");

  const { data: blockedDates, isLoading: loadingDates } = useBlockedDates();
  const { data: blockedSlots, isLoading: loadingSlots } = useBlockedSlots();

  // Filtramos apenas os futuros para exibir nos cards de estatísticas também
  const activeDates = (blockedDates ?? []).filter((item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(item.date).getTime() >= today.getTime();
  });

  const activeSlots = (blockedSlots ?? []).filter((item) => {
    return new Date(item.end).getTime() >= new Date().getTime();
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Bloqueios de agenda</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as suas ausências. Eventos passados são ocultados automaticamente.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Dias Bloqueados (Futuros)" value={activeDates.length} />
        <StatCard label="Horários Bloqueados (Futuros)" value={activeSlots.length} />
        <StatCard label="Total Ativo" value={activeDates.length + activeSlots.length} />
      </div>

      {/* TABS DE NAVEGAÇÃO */}
      <div className="flex rounded-xl bg-muted/50 p-1 md:w-fit">
        <button
          onClick={() => setActiveTab("dates")}
          className={`flex min-w-[200px] items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "dates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Dias Inteiros
        </button>
        <button
          onClick={() => setActiveTab("slots")}
          className={`flex min-w-[200px] items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
            activeTab === "slots"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          Horários Específicos
        </button>
      </div>

      {/* CONTEÚDO DA ABA: DIAS */}
      {activeTab === "dates" && (
        <div className="grid items-start gap-6 md:grid-cols-[350px_1fr] animate-in fade-in zoom-in-95 duration-300">
          <BlockedDatesForm />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Dias cadastrados</h3>
            {loadingDates ? (
              <div className="h-20 animate-pulse rounded-2xl border border-border bg-muted" />
            ) : !activeDates.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
                Não possui dias futuros bloqueados.
              </div>
            ) : (
              <BlockedDatesList />
            )}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA: HORÁRIOS */}
      {activeTab === "slots" && (
        <div className="grid items-start gap-6 md:grid-cols-[350px_1fr] animate-in fade-in zoom-in-95 duration-300">
          <BlockedSlotForm />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Horários cadastrados</h3>
            {loadingSlots ? (
              <div className="h-20 animate-pulse rounded-2xl border border-border bg-muted" />
            ) : !activeSlots.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
                Não possui horários futuros bloqueados.
              </div>
            ) : (
              <BlockedSlotList />
            )}
          </div>
        </div>
      )}
    </div>
  );
}