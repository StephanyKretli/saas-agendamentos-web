"use client";

import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { useCompleteAppointment } from "@/features/appointments/hooks/use-complete-appointment";

type BusyTimelineItem = {
  appointmentId: string;
  start: string;
  end: string;
  status: string;
  notes?: string | null;
  service: {
    id: string;
    name: string;
    duration: number;
  };
  client?: {
    name?: string | null;
    phone?: string | null;
    email?: string | null;
  } | null;
};

type TimelineBusyItemCardProps = {
  item: BusyTimelineItem;
  selectedDate: string;
  onReschedule: (item: BusyTimelineItem) => void;
};

function getStatusStyles(status: string) {
  switch (status) {
    case "SCHEDULED":
      return {
        container: "border-blue-200 bg-blue-50",
        badge: "bg-blue-100 text-blue-700",
      };
    case "COMPLETED":
      return {
        container: "border-green-200 bg-green-50",
        badge: "bg-green-100 text-green-700",
      };
    case "CANCELED":
      return {
        container: "border-gray-200 bg-gray-50",
        badge: "bg-gray-100 text-gray-600",
      };
    default:
      return {
        container: "border-border bg-card",
        badge: "bg-primary/10 text-primary",
      };
  }
}

export function TimelineBusyItemCard({
  item,
  selectedDate,
  onReschedule,
}: TimelineBusyItemCardProps) {
  const styles = getStatusStyles(item.status);
  const completeMutation = useCompleteAppointment(selectedDate);
  const cancelMutation = useCancelAppointment(selectedDate);

  const isScheduled = item.status === "SCHEDULED";
  const isPending = completeMutation.isPending || cancelMutation.isPending;

  return (
    <div className={`rounded-2xl border px-4 py-4 shadow-sm ${styles.container}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {item.start} - {item.end}
          </p>
          <h3 className="text-base font-semibold text-foreground">
            {item.service.name}
          </h3>
        </div>

        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}>
          {item.status}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {item.client?.name ?? "Cliente não informado"}
        </p>

        <div className="space-y-0.5 text-xs text-muted-foreground">
          <p>{item.client?.phone ?? "Sem telefone"}</p>
          {item.client?.email ? <p>{item.client.email}</p> : null}
          {item.notes ? <p>{item.notes}</p> : null}
        </div>
      </div>

      {isScheduled ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => completeMutation.mutate(item.appointmentId)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium disabled:opacity-60"
          >
            {completeMutation.isPending ? "Concluindo..." : "Concluir"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => cancelMutation.mutate(item.appointmentId)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium disabled:opacity-60"
          >
            {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => onReschedule(item)}
            className="rounded-xl border border-border px-3 py-2 text-sm font-medium disabled:opacity-60"
          >
            Reagendar
          </button>
        </div>
      ) : null}
    </div>
  );
}