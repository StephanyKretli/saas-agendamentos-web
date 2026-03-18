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

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(
    formatDateInput(new Date()),
  );

  const { data, isLoading, isError } = useDayTimeline(selectedDate);
  const items: TimelineItem[] = data?.items ?? [];

  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<SelectedAppointment | null>(null);

  const summary = React.useMemo(() => {
    const totalBusy = items.filter((item) => item.type === "busy").length;

    const scheduled = items.filter(
      (item) => item.type === "busy" && item.status === "SCHEDULED",
    ).length;

    const completed = items.filter(
      (item) => item.type === "busy" && item.status === "COMPLETED",
    ).length;

    const canceled = items.filter(
      (item) => item.type === "busy" && item.status === "CANCELED",
    ).length;

    const free = items.filter((item) => item.type === "free").length;
    const blocked = items.filter((item) => item.type === "blocked").length;

    return {
      totalBusy,
      scheduled,
      completed,
      canceled,
      free,
      blocked,
    };
  }, [items]);

  const showCurrentHourHighlight = isToday(selectedDate);
  const currentHourLabel = getCurrentHourLabel();

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

      <DaySummary
        totalBusy={summary.totalBusy}
        scheduled={summary.scheduled}
        completed={summary.completed}
        canceled={summary.canceled}
        free={summary.free}
        blocked={summary.blocked}
      />

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
            const isCurrentHour =
              showCurrentHourHighlight && item.start === currentHourLabel;

            if (item.type === "free") {
              return (
                <TimelineRow
                  key={`free-${item.start}-${index}`}
                  time={item.start}
                  isCurrentHour={isCurrentHour}
                >
                  <TimelineFreeItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            if (item.type === "blocked") {
              return (
                <TimelineRow
                  key={`blocked-${item.start}-${index}`}
                  time={item.start}
                  isCurrentHour={isCurrentHour}
                >
                  <TimelineBlockedItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            return (
              <TimelineRow
                key={item.appointmentId}
                time={item.start}
                isCurrentHour={isCurrentHour}
              >
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
                      client: selected.client
                        ? { name: selected.client.name ?? "Cliente" }
                        : null,
                    });

                    setRescheduleOpen(true);
                  }}
                />
              </TimelineRow>
            );
          })}
        </div>
      )}

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