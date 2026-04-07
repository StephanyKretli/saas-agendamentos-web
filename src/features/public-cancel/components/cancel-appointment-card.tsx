"use client";

import { useMemo } from "react";
import { useCancelAppointment } from "../hooks/use-cancel-appointment";
import { useCancelPreview } from "../hooks/use-cancel-preview";

type Props = {
  token: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "SCHEDULED":
      return "Agendado";
    case "CANCELED":
      return "Cancelado";
    case "COMPLETED":
      return "Concluído";
    default:
      return status;
  }
}

export function CancelAppointmentCard({ token }: Props) {
  const previewQuery = useCancelPreview(token);
  const cancelMutation = useCancelAppointment(token);

  const successMessage = useMemo(() => {
    if (!cancelMutation.isSuccess) return null;
    return "Seu agendamento foi cancelado com sucesso.";
  }, [cancelMutation.isSuccess]);

  if (previewQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Carregando agendamento...</p>
      </div>
    );
  }

  if (previewQuery.isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
          Não foi possível abrir este link
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {previewQuery.error instanceof Error
            ? previewQuery.error.message
            : "Link inválido ou expirado."}
        </p>
      </div>
    );
  }

  const appointment = previewQuery.data;

    if (!appointment) {
    return (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
            Não foi possível carregar o agendamento
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
            Os dados do agendamento não estão disponíveis no momento.
        </p>
        </div>
    );
    }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">
          Cancelar agendamento
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confira os dados abaixo antes de confirmar o cancelamento.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Serviço
          </p>
          <p className="text-sm text-foreground">{appointment.serviceName}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Data e horário
          </p>
          <p className="text-sm text-foreground">
            {formatDateTime(appointment.date)}
          </p>
        </div>

        {appointment.clientName ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Cliente
            </p>
            <p className="text-sm text-foreground">{appointment.clientName}</p>
          </div>
        ) : null}

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <p className="text-sm text-foreground">
            {getStatusLabel(appointment.status)}
          </p>
        </div>
      </div>

      {successMessage ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {cancelMutation.isError ? (
        <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-muted-foreground">
          {cancelMutation.error instanceof Error
            ? cancelMutation.error.message
            : "Não foi possível cancelar o agendamento."}
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={() => cancelMutation.mutate(token)}
          className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cancelMutation.isPending ? "Cancelando..." : "Cancelar agendamento"}
        </button>

        {!appointment.canCancel ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Este agendamento não pode mais ser cancelado.
          </p>
        ) : null}
      </div>
    </div>
  );
}