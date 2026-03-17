"use client";

import type { Appointment } from "../types/appointments.types";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useCancelAppointment } from "../hooks/use-cancel-appointment";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  if (status === "SCHEDULED") return "bg-blue-100 text-blue-700";
  if (status === "COMPLETED") return "bg-green-100 text-green-700";
  if (status === "CANCELED") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

type AppointmentCardProps = {
  appointment: Appointment;
  selectedDate: string;
};

export function AppointmentCard({
  appointment,
  selectedDate,
}: AppointmentCardProps) {
  const completeMutation = useCompleteAppointment(selectedDate);
  const cancelMutation = useCancelAppointment(selectedDate);

  function handleComplete() {
    completeMutation.mutate(appointment.id);
  }

  function handleCancel() {
    cancelMutation.mutate(appointment.id);
  }

  const isPending =
    completeMutation.isPending || cancelMutation.isPending;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {formatTime(appointment.date)}
          </p>
          <h3 className="text-base font-semibold text-foreground">
            {appointment.service.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {appointment.client.name}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
            appointment.status,
          )}`}
        >
          {appointment.status}
        </span>
      </div>

      {appointment.status === "SCHEDULED" ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleComplete}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium"
          >
            {completeMutation.isPending ? "Concluindo..." : "Concluir"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handleCancel}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium"
          >
            {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}