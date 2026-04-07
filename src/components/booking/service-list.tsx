import type { PublicService } from "@/types/temp";
import { ServiceCard } from "./service-card";

type Props = {
  services: PublicService[];
  selectedServiceId?: string;
  onSelect: (service: PublicService) => void;
};

export function ServiceList({
  services,
  selectedServiceId,
  onSelect,
}: Props) {
  return (
    <div className="space-y-3">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={selectedServiceId === service.id}
          onSelect={() => onSelect(service)}
        />
      ))}
    </div>
  );
}