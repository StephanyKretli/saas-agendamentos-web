"use client";

import { useMyAppointments } from "@/features/appointments/hooks/use-my-appointments";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";

export default function AgendaPage() {
  const { data, isLoading, isError } = useMyAppointments();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando agenda...</p>;
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">Erro ao carregar agenda.</p>;
  }

  if (!data?.items.length) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold text-foreground">Agenda</h1>

        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum agendamento encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          {data.total} agendamento(s)
        </p>
      </div>

      <div className="grid gap-3">
        {data.items.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
          />
        ))}
      </div>
    </div>
  );
}