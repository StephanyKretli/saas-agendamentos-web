import type { Appointment } from "../types/appointments.types";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  if (status === "SCHEDULED") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "COMPLETED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "CANCELED") {
    return "bg-red-100 text-red-700";
  }

  return "bg-muted text-muted-foreground";
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
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
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
            appointment.status
          )}`}
        >
          {appointment.status}
        </span>
      </div>
    </div>
  );
}