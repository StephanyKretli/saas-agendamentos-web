"use client";

import * as React from "react";
import { useMyAppointments } from "@/features/appointments/hooks/use-my-appointments";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function AgendaPage() {
  const { data, isLoading, isError } = useMyAppointments();

  const [selectedDate, setSelectedDate] = React.useState(
    formatDateInput(new Date())
  );

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando agenda...</p>;
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Erro ao carregar agenda.</p>;
  }

  const appointments = data?.items ?? [];

  const filteredAppointments = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
        .toISOString()
        .split("T")[0];

      return appointmentDate === selectedDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

      {!filteredAppointments.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum agendamento para esta data.
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}