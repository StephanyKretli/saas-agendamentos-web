"use client";

import { Button } from "@/components/ui/button";
import { Clock, Trash2, Edit3, Scissors } from "lucide-react";
import { useDeleteService } from "../hooks/use-delete-service";
import { toast } from "react-hot-toast";
import { Service } from "@/features/services/types/services.types";

interface ServiceListProps {
  services: Service[];
  onDeleteSuccess: () => void;
  // Adicionei essa prop para comunicar com a página principal
  onEdit: (service: Service) => void; 
}

export function ServiceList({ services, onDeleteSuccess, onEdit }: ServiceListProps) {
  const { mutate: deleteService, isPending } = useDeleteService();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Deseja realmente excluir o serviço "${name}"?`)) {
      deleteService(id, {
        onSuccess: () => {
          toast.success("Serviço removido com sucesso!");
          onDeleteSuccess();
        },
      });
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                <Scissors className="h-5 w-5" />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isPending}
                onClick={() => handleDelete(service.id, service.name)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-lg leading-tight">{service.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {/* @ts-ignore - Caso o type ainda esteja dando erro de 'description' */}
                {service.description || "Sem descrição disponível."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {/* AJUSTE DO PREÇO: Dividindo por 100 se vier em centavos */}
                {/* @ts-ignore - Caso o type ainda esteja dando erro de 'price' */}
                <span>R$ {(Number(service.priceCents ?? 0) / 100).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs font-normal hover:bg-muted rounded-lg"
              onClick={() => onEdit(service)} // Ação de editar
            >
              <Edit3 className="mr-1 h-3 w-3" />
              Editar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}