"use client";

import * as React from "react";
import { DaySummary } from "@/features/appointments/components/day-summary";
import { RescheduleModal } from "@/features/appointments/components/reschedule-modal";
import { TimelineBlockedItemCard } from "@/features/appointments/components/timeline-blocked-item-card";
import { TimelineBusyItemCard } from "@/features/appointments/components/timeline-busy-item-card";
import { TimelineFreeItemCard } from "@/features/appointments/components/timeline-free-item-card";
import { TimelineRow } from "@/features/appointments/components/timeline-row";
import {
  TimelineItem,
  useDayTimeline,
} from "@/features/appointments/hooks/use-day-timeline";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ptBR } from "date-fns/locale";
import { AppointmentForm } from "@/features/appointments/components/appointment-form";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isToday(date: string) {
  return date === formatDateInput(new Date());
}

function getCurrentHourLabel() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:00`;
}

type SelectedAppointment = {
  appointmentId: string;
  start: string;
  end: string;
  status: string;
  service: {
    id: string;
    name: string;
    duration: number;
  };
  client: {
    name: string;
  } | null;
};

type AgendaFilter = "all" | "scheduled" | "completed" | "canceled" | "free" | "blocked";

const FILTER_LABELS: Record<AgendaFilter, string> = {
  all: "Todos",
  scheduled: "Agendados",
  completed: "Concluídos",
  canceled: "Cancelados",
  free: "Livres",
  blocked: "Bloqueados",
};

function matchesFilter(item: TimelineItem, filter: AgendaFilter) {
  if (filter === "all") return true;
  if (filter === "free") return item.type === "free";
  if (filter === "blocked") return item.type === "blocked";
  if (item.type !== "busy") return false;
  if (filter === "scheduled") return item.status === "SCHEDULED";
  if (filter === "completed") return item.status === "COMPLETED";
  if (filter === "canceled") return item.status === "CANCELED";
  return true;
}

export default function AgendaPage() {

  const [selectedDate, setSelectedDate] = React.useState(formatDateInput(new Date()));
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<AgendaFilter>("all");
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<SelectedAppointment | null>(null);

  const { data, isLoading, isError } = useDayTimeline(selectedDate);
  const items: TimelineItem[] = data?.items ?? [];

  
  const calendarDate = new Date(`${selectedDate}T12:00:00`);

  const summary = React.useMemo(() => {
    const totalBusy = items.filter((item) => item.type === "busy").length;
    const scheduled = items.filter((item) => item.type === "busy" && item.status === "SCHEDULED").length;
    const completed = items.filter((item) => item.type === "busy" && item.status === "COMPLETED").length;
    const canceled = items.filter((item) => item.type === "busy" && item.status === "CANCELED").length;
    const free = items.filter((item) => item.type === "free").length;
    const blocked = items.filter((item) => item.type === "blocked").length;

    return { totalBusy, scheduled, completed, canceled, free, blocked };
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => matchesFilter(item, filter));
  }, [items, filter]);

  const showCurrentHourHighlight = isToday(selectedDate);
  const currentHourLabel = getCurrentHourLabel();
  const filterOptions: AgendaFilter[] = ["all", "scheduled", "completed", "canceled", "free", "blocked"];

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Visualize horários livres, ocupados e bloqueados do dia.
          </p>
        </div>
        <Button onClick={() => setIsNewAppointmentOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo agendamento
        </Button>
      </div>

      {/* MODAL DE NOVO AGENDAMENTO */}
      {isNewAppointmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl border border-border">
            <h2 className="mb-6 text-xl font-semibold">Novo Agendamento</h2>
            
            <AppointmentForm 
              initialDate={selectedDate} // Já preenche com a data que o usuário estava olhando!
              onCancel={() => setIsNewAppointmentOpen(false)}
              onSuccess={() => {
                setIsNewAppointmentOpen(false);
                // Aqui depois vamos colocar a função para recarregar a timeline do dia!
              }}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[auto_1fr] items-start">
        
        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm lg:sticky lg:top-6 w-fit mx-auto lg:mx-0">
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={(newDate: Date | undefined) => { 
              if (newDate) {
                setSelectedDate(formatDateInput(newDate));
              }
            }}
            locale={ptBR}
            className="rounded-md"
          />
        </div>

        <div className="space-y-6 min-w-0">
          
          <DaySummary {...summary} />

          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {FILTER_LABELS[option]}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground animate-pulse">
              Carregando agenda...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
              Erro ao carregar agenda.
            </div>
          ) : !filteredItems.length ? (
            <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
              {filter === "all"
                ? "Nenhum item para esta data."
                : `Nenhum item encontrado para o filtro "${FILTER_LABELS[filter]}".`}
            </div>
          ) : (
            <div className="space-y-3 pb-10">
              {filteredItems.map((item: TimelineItem, index: number) => {
                const isCurrentHour = showCurrentHourHighlight && item.start === currentHourLabel;

                if (item.type === "free") {
                  return (
                    <TimelineRow key={`free-${item.start}-${index}`} time={item.start} isCurrentHour={isCurrentHour}>
                      <TimelineFreeItemCard start={item.start} end={item.end} />
                    </TimelineRow>
                  );
                }

                if (item.type === "blocked") {
                  return (
                    <TimelineRow key={`blocked-${item.start}-${index}`} time={item.start} isCurrentHour={isCurrentHour}>
                      <TimelineBlockedItemCard start={item.start} end={item.end} />
                    </TimelineRow>
                  );
                }

                return (
                  <TimelineRow key={item.appointmentId} time={item.start} isCurrentHour={isCurrentHour}>
                    <TimelineBusyItemCard
                      item={item}
                      selectedDate={selectedDate}
                      onReschedule={(selected) => {
                        setSelectedAppointment({
                          appointmentId: selected.appointmentId,
                          start: selected.start,
                          end: selected.end,
                          status: selected.status,
                          service: {
                            id: selected.service.id,
                            name: selected.service.name,
                            duration: selected.service.duration,
                          },
                          client: selected.client ? { name: selected.client.name ?? "Cliente" } : null,
                        });
                        setRescheduleOpen(true);
                      }}
                    />
                  </TimelineRow>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <RescheduleModal
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setSelectedAppointment(null);
        }}
        selectedDate={selectedDate}
        appointment={selectedAppointment}
      />
    </div>
  );
}