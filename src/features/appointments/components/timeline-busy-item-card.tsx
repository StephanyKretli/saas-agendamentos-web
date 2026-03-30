"use client";

import { useCancelAppointment } from "@/features/appointments/hooks/use-cancel-appointment";
import { useCompleteAppointment } from "@/features/appointments/hooks/use-complete-appointment";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react"; // Adicionei ícones para feedback visual

type BusyTimelineItem = {
  appointmentId: string;
  start: string;
  end: string;
  status: string;
  paymentStatus?: string; // 👈 NOVO
  depositCents?: number | null; // 👈 NOVO
  notes?: string | null;
  professionalId?: string; 
  userId?: string;
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
  // 🌟 NOVO STATUS VISUAL PARA PAGAMENTO PENDENTE
  WAITING_PAYMENT: {
    label: "Aguardando PIX",
    container: "border-amber-500/30 bg-amber-500/5 border-dashed", // Borda tracejada para dar ideia de "provisório"
    badge: "bg-amber-500/20 text-amber-700 dark:text-amber-400 animate-pulse", // Pulse suave para chamar atenção
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
  
  // 💰 Identifica se está aguardando o sinal
  const isWaitingPix = item.status === "SCHEDULED" && item.paymentStatus === "PENDING";

  // Escolhe o visual: se estiver aguardando PIX, usa o mapa especial, senão usa o padrão
  const statusKey = isWaitingPix ? "WAITING_PAYMENT" : item.status;
  const statusInfo = STATUS_MAP[statusKey] || {
    label: item.status,
    container: "border-border bg-muted/20",
    badge: "bg-muted text-muted-foreground",
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm transition-all ${statusInfo.container}`}>
      
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

        <span
          className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusInfo.badge}`}
        >
          {isWaitingPix && <AlertCircle className="h-3 w-3" />}
          {statusInfo.label}
        </span>
      </div>

      {/* AVISO DE DINHEIRO PENDENTE (Destaque para o profissional) */}
      {isWaitingPix && item.depositCents && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-500/10 p-2.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 border border-amber-500/10">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Sinal de {formatPrice(item.depositCents)} ainda não recebido.
        </div>
      )}

      {/* DADOS DO CLIENTE */}
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

      {/* BOTÕES DE AÇÃO */}
      {isScheduled ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {/* Se estiver aguardando PIX, o botão de Concluir fica desabilitado ou avisado */}
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