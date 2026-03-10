import type { PublicService } from "../types/public-booking.types";

type ServiceCardProps = {
  service: PublicService;
  isSelected: boolean;
  onSelect: (service: PublicService) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function ServiceCard({
  service,
  isSelected,
  onSelect,
}: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className={[
        "w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {service.name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {service.duration} min
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-foreground">
            {formatPrice(service.priceCents)}
          </span>

          {isSelected ? (
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Selecionado
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}