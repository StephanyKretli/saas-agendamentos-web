import type { PublicService } from "../types/public-booking.types";
import { ServiceCard } from "./service-card";

type ServiceListProps = {
  services: PublicService[];
  selectedServiceId: string | null;
  onSelectService: (service: PublicService) => void;
};

export function ServiceList({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceListProps) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Nenhum serviço disponível no momento.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isSelected={selectedServiceId === service.id}
          onSelect={onSelectService}
        />
      ))}
    </div>
  );
}