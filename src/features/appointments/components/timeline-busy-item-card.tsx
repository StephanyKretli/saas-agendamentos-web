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

// NOVO MAPA DE STATUS PREMIUM (Suporta Dark Mode e traduz para PT-BR)
const STATUS_MAP: Record<string, { label: string; container: string; badge: string }> = {
  SCHEDULED: {
    label: "Agendado",
    container: "border-blue-500/20 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  COMPLETED: {
    label: "Concluído",
    container: "border-green-500/20 bg-green-500/5",
    badge: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  CANCELED: {
    label: "Cancelado",
    container: "border-destructive/20 bg-destructive/5",
    badge: "bg-destructive/10 text-destructive dark:text-destructive",
  },
};

export function TimelineBusyItemCard({
  item,
  selectedDate,
  onReschedule,
}: TimelineBusyItemCardProps) {
  const cancelMutation = useCancelAppointment(selectedDate);
  const completeMutation = useCompleteAppointment(selectedDate);

  const isPending = cancelMutation.isPending || completeMutation.isPending;
  const isScheduled = item.status === "SCHEDULED";

  // Pega nas cores e no texto traduzido (ou usa um fallback cinzento caso seja um status não mapeado)
  const statusInfo = STATUS_MAP[item.status] || {
    label: item.status,
    container: "border-border bg-muted/20",
    badge: "bg-muted text-muted-foreground",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all ${statusInfo.container}`}>
      
      {/* CABEÇALHO DO CARTÃO (Serviço e Status) */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {item.service.name}
          </p>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {item.start} até {item.end} • {item.service.duration} min
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusInfo.badge}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* DADOS DO CLIENTE */}
      <div className="mt-4 border-t border-border/50 pt-4">
        <p className="text-sm font-medium text-foreground">
          {item.client?.name ?? "Cliente não informado"}
        </p>

        <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
          {item.client?.phone ? <p>📞 {item.client.phone}</p> : <p>Sem telefone</p>}
          {item.client?.email ? <p>✉️ {item.client.email}</p> : null}
          {item.notes ? (
            <div className="mt-2 rounded-lg bg-background/50 p-2 border border-border/50">
              <p className="italic text-foreground/80">"{item.notes}"</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* BOTÕES DE AÇÃO (Apenas se estiver Agendado) */}
      {isScheduled ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() => completeMutation.mutate(item.appointmentId)}
            className="rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-500/20 dark:text-green-400 disabled:opacity-50 transition-colors"
          >
            {completeMutation.isPending ? "Concluindo..." : "Concluir"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => cancelMutation.mutate(item.appointmentId)}
            className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50 transition-colors"
          >
            {cancelMutation.isPending ? "Cancelando..." : "Cancelar"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => onReschedule(item)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Reagendar
          </button>
        </div>
      ) : null}
    </div>
  );
}