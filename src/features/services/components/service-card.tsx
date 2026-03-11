import type { Service } from "../types/services.types";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {service.duration} min
        </p>
        <p className="text-sm text-muted-foreground">
          {formatPrice(service.priceCents)}
        </p>
      </div>
    </div>
  );
}