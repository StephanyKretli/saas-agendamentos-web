import { Service } from "../types/services.types";
import { ServiceCard } from "./service-card";
import { Scissors } from "lucide-react"; 
import { EmptyState } from "@/components/ui/empty-state";

interface ServiceListProps {
  services: Service[];
  onDeleteSuccess: () => void;
  // 1. Adicionamos a definição na interface
  onOpenCreateModal: () => void; 
}

// 2. Recebemos a função aqui nas props
export function ServiceList({ 
  services, 
  onDeleteSuccess, 
  onOpenCreateModal 
}: ServiceListProps) {
  
  if (services.length === 0) {
    return (
      <EmptyState
        icon={Scissors}
        title="Nenhum serviço cadastrado"
        description="Cadastre os serviços que você oferece para que seus clientes possam agendar online."
        actionLabel="Cadastrar meu primeiro serviço"
        // 3. Agora o nome onOpenCreateModal existe e pode ser usado
        onAction={onOpenCreateModal} 
      />
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