"use client";

import type { Appointment } from "../types/appointments.types";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useCancelAppointment } from "../hooks/use-cancel-appointment";
import { Wrench, Zap } from "lucide-react"; // 🌟 Importando o ícone Zap (Raio) para o VIP

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status: string) {
  if (status === "SCHEDULED") return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  if (status === "COMPLETED") return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  if (status === "CANCELED") return "bg-destructive/10 text-destructive border border-destructive/20";
  return "bg-muted text-muted-foreground";
}

type AppointmentCardProps = {
  // 🌟 Suporte para as flags isMaintenance e isVIP no tipo
  appointment: Appointment & { isMaintenance?: boolean; isVIP?: boolean }; 
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

  const isPending = completeMutation.isPending || cancelMutation.isPending;

  return (
    <div 
      // 🌟 LÓGICA DE ESTILO: Fundo e borda âmbar se for VIP, padrão se não for
      className={`relative rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${
        appointment.isVIP 
          ? "bg-zinc-900/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]" 
          : "bg-card border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {formatTime(appointment.date)}
          </p>
          
          {/* Nome do Serviço + Tag de Manutenção alinhados */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground leading-tight">
              {appointment.service.name}
            </h3>
            
            {/* SELO DE MANUTENÇÃO */}
            {appointment.isMaintenance && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Wrench className="h-3 w-3" />
                Manutenção
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {appointment.client.name}
          </p>
        </div>

        {/* 🌟 LADO DIREITO: Status e Selo VIP */}
        <div className="flex flex-col items-end gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
              appointment.status,
            )}`}
          >
            {appointment.status === "SCHEDULED" ? "Agendado" : appointment.status === "COMPLETED" ? "Concluído" : "Cancelado"}
          </span>

          {/* SELO VIP: Aparece logo abaixo do status */}
          {appointment.isVIP && (
            <span 
              title="Encaixe VIP (Regras Ignoradas)" 
              className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-500 border border-amber-500/20"
            >
              <Zap className="h-3 w-3 fill-amber-500/20" />
              VIP
            </span>
          )}
        </div>
      </div>

      {appointment.status === "SCHEDULED" && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-3">
          <button
            type="button"
            disabled={isPending}
            onClick={handleComplete}
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {completeMutation.isPending ? "Concluindo..." : "Concluir"}
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={handleCancel}
            className="rounded-xl border border-input bg-background text-foreground hover:bg-muted px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          >
            {cancelMutation.isPending ? "Cancelando..." : "Cancelar Agendamento"}
          </button>
        </div>
      )}
    </div>
  );
}