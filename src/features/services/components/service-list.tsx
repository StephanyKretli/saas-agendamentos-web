import { Service } from "../types/services.types";
import { ServiceCard } from "./service-card";

interface ServiceListProps {
  services: Service[];
  onDeleteSuccess: () => void;
}

export function ServiceList({ services, onDeleteSuccess }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard 
          key={service.id} 
          service={service} 
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}