import type { Appointment } from "../types/appointments.types";

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatTime(appointment.date)}
          </p>

          <h3 className="text-base font-semibold text-foreground">
            {appointment.service.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {appointment.client.name}
          </p>
        </div>

        <span className="text-xs rounded-full bg-muted px-2 py-1">
          {appointment.status}
        </span>
      </div>
    </div>
  );
}