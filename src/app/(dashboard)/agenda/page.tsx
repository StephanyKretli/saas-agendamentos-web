"use client";

import * as React from "react";
import { useDayTimeline } from "@/features/appointments/hooks/use-day-timeline";
import { TimelineItem } from "@/features/appointments/hooks/use-day-timeline";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function BusyItemCard({
  item,
}: {
  item: {
    type: "busy";
    start: string;
    end: string;
    appointmentId: string;
    status: string;
    notes: string | null;
    service: {
      id: string;
      name: string;
      duration: number;
      priceCents: number;
    };
    client: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
    } | null;
  };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {item.start} - {item.end}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{item.service.name}</p>
        </div>

        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
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
        {item.notes ? (
          <p className="text-sm text-muted-foreground">{item.notes}</p>
        ) : null}
      </div>
    </div>
  );
}

function FreeItemCard({ start, end }: { start: string; end: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-4">
      <p className="text-sm font-medium text-foreground">
        Livre · {start} - {end}
      </p>
    </div>
  );
}

function BlockedItemCard({ start, end }: { start: string; end: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted p-4">
      <p className="text-sm font-medium text-foreground">
        Bloqueado · {start} - {end}
      </p>
    </div>
  );
}

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(
    formatDateInput(new Date()),
  );

  const { data, isLoading, isError } = useDayTimeline(selectedDate);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando agenda...</p>;
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Erro ao carregar agenda.</p>;
  }

  const items: TimelineItem[] = data?.items ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold text-foreground">Agenda</h1>

        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {!items.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum item para esta data.
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item, index) => {
            if (item.type === "free") {
              return <FreeItemCard key={`free-${index}`} start={item.start} end={item.end} />;
            }

            if (item.type === "blocked") {
              return (
                <BlockedItemCard
                  key={`blocked-${index}`}
                  start={item.start}
                  end={item.end}
                />
              );
            }

            return <BusyItemCard key={item.appointmentId} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}