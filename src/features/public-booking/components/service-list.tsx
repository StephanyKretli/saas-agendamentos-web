import type { PublicService } from "../types/public-booking.types";
import { ServiceCard } from "./service-card";

type ServiceListProps = {
  services: PublicService[];
};

export function ServiceList({ services }: ServiceListProps) {
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
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}