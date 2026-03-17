"use client";

import * as React from "react";
import { TimelineItem, useDayTimeline } from "@/features/appointments/hooks/use-day-timeline";
import { useCompleteAppointment } from "@/features/appointments/hooks/use-complete-appointment";
import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { RescheduleModal } from "@/features/appointments/components/reschedule-modal";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TimelineRow({
  time,
  children,
}: {
  time: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3">
      <div className="pt-3 text-sm font-medium text-muted-foreground">
        {time}
      </div>
      <div>{children}</div>
    </div>
  );
}

function BusyItemCard({
  item,
  selectedDate,
  setSelectedAppointment,
  setRescheduleOpen,
}: {
  item: Extract<TimelineItem, { type: "busy" }>;
  selectedDate: string;
  setSelectedAppointment: (
    item: Extract<TimelineItem, { type: "busy" }>,
  ) => void;
  setRescheduleOpen: (open: boolean) => void;
}) {
  const completeMutation = useCompleteAppointment(selectedDate);
  const cancelMutation = useCancelAppointment(selectedDate);

  const isPending =
    completeMutation.isPending || cancelMutation.isPending;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {item.start} - {item.end}
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {item.service.name}
          </p>
        </div>

        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {item.status}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {item.client?.name ?? "Cliente não informado"}
        </p>

        <p className="text-sm text-muted-foreground">
          {item.client?.phone ?? "Sem telefone"}
        </p>

        {item.client?.email ? (
          <p className="text-sm text-muted-foreground">{item.client.email}</p>
        ) : null}

        {item.notes ? (
          <p className="pt-1 text-sm text-muted-foreground">{item.notes}</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => completeMutation.mutate(item.appointmentId)}
          className="rounded-xl border border-border px-3 py-2 text-sm font-medium"
        >
          {completeMutation.isPending ? "Concluindo..." : "Concluir"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => cancelMutation.mutate(item.appointmentId)}
          className="rounded-xl border border-border px-3 py-2 text-sm font-medium"
        >
          {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setSelectedAppointment(item);
            setRescheduleOpen(true);
          }}
          className="rounded-xl border border-border px-3 py-2 text-sm font-medium"
        >
          Reagendar
        </button>
      </div>
    </div>
  );
}

function FreeItemCard({ start, end }: { start: string; end: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-4">
      <p className="text-sm font-medium text-foreground">
        Horário livre
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {start} - {end}
      </p>
    </div>
  );
}

function BlockedItemCard({ start, end }: { start: string; end: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-4">
      <p className="text-sm font-medium text-foreground">
        Horário bloqueado
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {start} - {end}
      </p>
    </div>
  );
}

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(
    formatDateInput(new Date()),
  );

  const { data, isLoading, isError } = useDayTimeline(selectedDate);

  const items: TimelineItem[] = data?.items ?? [];

  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Extract<TimelineItem, { type: "busy" }> | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Agenda</h1>
          <p className="text-sm text-muted-foreground">
            Visualize horários livres, ocupados e bloqueados do dia.
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Carregando agenda...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Erro ao carregar agenda.
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum item para esta data.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: TimelineItem, index: number) => {
            if (item.type === "free") {
              return (
                <TimelineRow key={`free-${index}`} time={item.start}>
                  <FreeItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            if (item.type === "blocked") {
              return (
                <TimelineRow key={`blocked-${index}`} time={item.start}>
                  <BlockedItemCard start={item.start} end={item.end} />
                </TimelineRow>
              );
            }

            return (
              <TimelineRow key={item.appointmentId} time={item.start}>
                <BusyItemCard
                  item={item}
                  selectedDate={selectedDate}
                  setSelectedAppointment={setSelectedAppointment}
                  setRescheduleOpen={setRescheduleOpen}
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