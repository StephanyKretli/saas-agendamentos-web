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
  if (status === "SCHEDULED") return "bg-blue-100 text-blue-700";
  if (status === "COMPLETED") return "bg-green-100 text-green-700";
  if (status === "CANCELED") return "bg-red-100 text-red-700";
  return "bg-muted text-muted-foreground";
}

export function ClientHistoryCard({
  item,
}: {
  item: ClientHistoryItem;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            {formatDateTime(item.date)}
          </p>

          <h4 className="text-sm font-semibold text-foreground">
            {item.service.name}
          </h4>

          <p className="text-sm text-muted-foreground">
            {item.service.duration} min · {formatPrice(item.service.priceCents)}
          </p>

          {item.notes ? (
            <p className="text-sm text-muted-foreground">{item.notes}</p>
          ) : null}
        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
            item.status,
          )}`}
        >
          {item.status}
        </span>
      </div>
    </div>
  );
}