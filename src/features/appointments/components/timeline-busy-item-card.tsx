"use client";

import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { useCompleteAppointment } from "@/features/appointments/hooks/use-complete-appointment";
import { Clock, AlertCircle, CheckCircle2, Zap } from "lucide-react"; // 🌟 Importei o Zap (Raio)

type BusyTimelineItem = {
  appointmentId: string;
  start: string;
  end: string;
  status: string;
  paymentStatus?: string; 
  depositCents?: number | null; 
  notes?: string | null;
  professionalId?: string; 
  userId?: string;
  isVIP?: boolean; // 🌟 A flag salvadora chegou aqui!
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

const STATUS_MAP: Record<string, { label: string; container: string; badge: string }> = {
  SCHEDULED: {
    label: "Agendado",
    container: "border-blue-500/20 bg-blue-500/5",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  WAITING_PAYMENT: {
    label: "Aguardando PIX",
    container: "border-amber-500/30 bg-amber-500/5 border-dashed", 
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse", 
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
  
  const isWaitingPix = item.status === "SCHEDULED" && item.paymentStatus === "PENDING";

  // 🌟 Se for VIP, a cor de fundo e borda sobrepõe os outros estados para chamar a atenção
  const statusKey = isWaitingPix ? "WAITING_PAYMENT" : item.status;
  const defaultStatusInfo = STATUS_MAP[statusKey] || {
    label: item.status,
    container: "border-border bg-muted/20",
    badge: "bg-muted text-muted-foreground",
  };

  // Se o agendamento for VIP, aplicamos as classes douradas/âmbar
  const finalContainerClass = item.isVIP 
    ? "bg-zinc-900/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
    : defaultStatusInfo.container;

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all ${finalContainerClass}`}>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            {item.service.name}
            {isWaitingPix && <Clock className="h-3.5 w-3.5 text-amber-500" />}
          </p>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {item.start} até {item.end} • {item.service.duration} min
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${defaultStatusInfo.badge}`}
          >
            {isWaitingPix && <AlertCircle className="h-3 w-3" />}
            {defaultStatusInfo.label}
          </span>
          
          {/* 🌟 SELO VIP EM DESTAQUE */}
          {item.isVIP && (
            <span 
              title="Encaixe VIP (Forçado fora das regras)" 
              className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-500 border border-amber-500/20"
            >
              <Zap className="h-3 w-3 fill-amber-500/20" />
              VIP
            </span>
          )}
        </div>
      </div>

      {isWaitingPix && item.depositCents && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/10 p-2.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 border border-amber-500/10">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Sinal de {formatPrice(item.depositCents)} ainda não recebido.
        </div>
      )}

      <div className="mt-4 border-t border-border/50 pt-4">
        <p className="text-sm font-medium text-foreground">
          {item.client?.name ?? "Cliente não informado"}
        </p>

        <div className="mt-1.5 space-y-1 text-xs text-muted-foreground">
          {item.client?.phone ? <p>📞 {item.client.phone}</p> : <p>Sem telefone</p>}
          {item.notes ? (
            <div className="mt-2 rounded-lg bg-background/50 p-2 border border-border/50">
              <p className="italic text-foreground/80">"{item.notes}"</p>
            </div>
          ) : null}
        </div>
      </div>

      {isScheduled ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isPending || isWaitingPix}
            onClick={() => completeMutation.mutate(item.appointmentId)}
            className={`rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-500/20 dark:text-green-400 disabled:opacity-40 transition-colors flex items-center gap-2`}
            title={isWaitingPix ? "Aguarde o pagamento para concluir" : ""}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
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
            onClick={() => onReschedule({
              ...item,
              professionalId: item.professionalId,
              userId: item.userId 
            })}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Reagendar
          </button>
        </div>
      ) : null}
    </div>
  );
}