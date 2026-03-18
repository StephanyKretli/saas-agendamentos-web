import type { ClientHistoryItem } from "../types/clients.types";

function formatDateTime(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
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

function getStatusLabel(status: string) {
  if (status === "SCHEDULED") return "Agendado";
  if (status === "COMPLETED") return "Concluído";
  if (status === "CANCELED") return "Cancelado";
  return status;
}

export function ClientHistoryCard({ item }: { item: ClientHistoryItem }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Atendimento
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateTime(item.date)}
          </p>
        </div>

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
            item.status,
          )}`}
        >
          {getStatusLabel(item.status)}
        </span>
      </div>

      <div className="mt-4">
        <h4 className="text-base font-semibold text-foreground">
          {item.service.name}
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {item.service.duration} min • {formatPrice(item.service.priceCents)}
        </p>
      </div>

      {item.notes ? (
        <div className="mt-4 rounded-2xl border border-border bg-muted/20 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Observações
          </p>
          <p className="mt-1 text-sm text-foreground">{item.notes}</p>
        </div>
      ) : null}
    </div>
  );
}