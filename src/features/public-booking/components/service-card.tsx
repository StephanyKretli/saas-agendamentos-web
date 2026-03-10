import type { PublicService } from "../types/public-booking.types";

type ServiceCardProps = {
  service: PublicService;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {service.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {service.durationMinutes} min
          </p>
        </div>

        <span className="text-sm font-medium text-foreground">
          {formatPrice(service.priceCents)}
        </span>
      </div>
    </div>
  );
}