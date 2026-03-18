"use client";

import * as React from "react";
import { RescheduleModal } from "@/features/appointments/components/reschedule-modal";
import { TimelineBlockedItemCard } from "@/features/appointments/components/timeline-blocked-item-card";
import { TimelineBusyItemCard } from "@/features/appointments/components/timeline-busy-item-card";
import { TimelineFreeItemCard } from "@/features/appointments/components/timeline-free-item-card";
import { TimelineRow } from "@/features/appointments/components/timeline-row";
import {
  TimelineItem,
  useDayTimeline,
} from "@/features/appointments/hooks/use-day-timeline";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(formatDateInput(new Date()));
  const { data, isLoading, isError } = useDayTimeline(selectedDate);
  const items: TimelineItem[] = data?.items ?? [];

  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Visualize horários livres, ocupados e bloqueados do dia.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm md:w-[220px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          Carregando agenda...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          Erro ao carregar agenda.
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          Nenhum item para esta data.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: TimelineItem, index: number) => {
            if (item.type === "free") {
              return (
                <TimelineRow key={`free-${item.start}-${index}`} time={item.start}>
                  <TimelineFreeItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            if (item.type === "blocked") {
              return (
                <TimelineRow key={`blocked-${item.start}-${index}`} time={item.start}>
                  <TimelineBlockedItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            return (
              <TimelineRow key={item.appointmentId} time={item.start}>
                <TimelineBusyItemCard
                  item={item}
                  selectedDate={selectedDate}
                  onReschedule={(selected) => {
                    setSelectedAppointment(selected);
                    setRescheduleOpen(true);
                  }}
                />
              </TimelineRow>
            );
          })}

          <RescheduleModal
            open={rescheduleOpen}
            onClose={() => {
              setRescheduleOpen(false);
              setSelectedAppointment(null);
            }}
            selectedDate={selectedDate}
            appointment={
              selectedAppointment
                ? {
                    appointmentId: selectedAppointment.appointmentId,
                    start: selectedAppointment.start,
                    end: selectedAppointment.end,
                    status: selectedAppointment.status,
                    service: {
                      id: selectedAppointment.service.id,
                      name: selectedAppointment.service.name,
                      duration: selectedAppointment.service.duration,
                    },
                    client: selectedAppointment.client
                      ? { name: selectedAppointment.client.name }
                      : null,
                  }
                : null
            }
          />
        </div>
      )}
    </div>
  );
}