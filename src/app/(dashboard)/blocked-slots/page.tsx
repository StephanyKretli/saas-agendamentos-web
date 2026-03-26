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
    <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <p 
        className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground truncate"
        title={label}
      >
        {label}
      </p>
      <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function BlockedSlotsPage() {
  const [activeTab, setActiveTab] = useState<"dates" | "slots">("dates");

  const { data: blockedDates, isLoading: loadingDates } = useBlockedDates();
  const { data: blockedSlots, isLoading: loadingSlots } = useBlockedSlots();

  const activeDates = (blockedDates ?? []).filter((item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(item.date).getTime() >= today.getTime();
  });

  const activeSlots = (blockedSlots ?? []).filter((item) => {
    return new Date(item.end).getTime() >= new Date().getTime();
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Bloqueios de agenda</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as suas ausências. Eventos passados são ocultados automaticamente.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        <StatCard label="Dias Bloqueados" value={activeDates.length} />
        <StatCard label="Horários Bloqueados" value={activeSlots.length} />
        <div className="col-span-2 sm:col-span-1 xl:col-span-1">
          <StatCard label="Total Ativo" value={activeDates.length + activeSlots.length} />
        </div>
      </div>

      {/* TABS DE NAVEGAÇÃO - CORRIGIDO PARA MOBILE */}
      <div className="flex w-full sm:w-fit rounded-xl bg-muted/50 p-1">
        <button
          onClick={() => setActiveTab("dates")}
          className={`flex flex-1 sm:flex-none sm:min-w-[160px] items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 px-2 text-xs sm:text-sm font-medium transition-all ${
            activeTab === "dates"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="truncate">Dias Inteiros</span>
        </button>
        <button
          onClick={() => setActiveTab("slots")}
          className={`flex flex-1 sm:flex-none sm:min-w-[160px] items-center justify-center gap-1.5 sm:gap-2 rounded-lg py-2.5 px-2 text-xs sm:text-sm font-medium transition-all ${
            activeTab === "slots"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4 shrink-0" />
          <span className="truncate">Horários Específicos</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA: DIAS */}
      {activeTab === "dates" && (
        <div className="grid items-start gap-6 lg:grid-cols-[350px_1fr] animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <BlockedDatesForm />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Dias cadastrados</h3>
            {loadingDates ? (
              <div className="h-20 animate-pulse rounded-2xl border border-border bg-muted/50" />
            ) : !activeDates.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
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
        <div className="grid items-start gap-6 lg:grid-cols-[350px_1fr] animate-in fade-in zoom-in-95 duration-300">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <BlockedSlotForm />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Horários cadastrados</h3>
            {loadingSlots ? (
              <div className="h-20 animate-pulse rounded-2xl border border-border bg-muted/50" />
            ) : !activeSlots.length ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground shadow-sm">
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