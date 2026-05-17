"use client";

import { Button } from "@/components/ui/button";
import { useDeleteService } from "../hooks/use-delete-service";
import { toast } from "react-hot-toast";
import { Service } from "@/features/services/types/services.types";
import { 
  Scissors, Brush, Sparkles, Droplets, Flower2, Wand2, Heart, Crown, Smile,
  HandIcon, Zap, GlassWater, User, SprayCan, Gem, Footprints, Eye, 
  PencilLine,
  Trash2,     
  Clock,      
  Edit3,      
  RefreshCw // 🌟 Ícone adicionado para a manutenção
} from "lucide-react";

interface ServiceListProps {
  services: Service[];
  onDeleteSuccess: () => void;
  onEdit: (service: Service) => void; 
}

export function ServiceList({ services, onDeleteSuccess, onEdit }: ServiceListProps) {
  const { mutate: deleteService } = useDeleteService();

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {getServiceIcon(service.icon)}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleDelete(service.id, service.name)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-lg leading-tight">{service.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {/* @ts-ignore */}
                {service.description || "Sem descrição disponível."}
              </p>
              
              {/* 🌟 SELO DE MANUTENÇÃO (Aparece apenas se hasMaintenance for true) */}
              {service.hasMaintenance && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
                  <RefreshCw className="h-3 w-3" />
                  <span>
                    Manutenção: {(service.maintenanceDurationMinutes)}min • R$ {(Number(service.maintenancePriceCents ?? 0) / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <span>R$ {(Number(service.priceCents ?? 0) / 100).toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs font-normal hover:bg-muted rounded-lg"
              onClick={() => onEdit(service)}
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

export function getServiceIcon(iconId: string | null | undefined) {
  const icons: Record<string, any> = {
    scissors: Scissors,
    spray: SprayCan,
    user: User,
    wand2: Wand2,
    droplets: Droplets,
    crown: Crown,
    hand: HandIcon,
    foot: Footprints,
    sparkles: Sparkles,
    glass: GlassWater,
    PencilLine: PencilLine,
    zap: Zap,
    eye: Eye,
    gem: Gem,
    flower2: Flower2,
    heart: Heart,
    smile: Smile,
  };

  const IconComponent = icons[iconId as string] || Scissors;
  return <IconComponent className="h-5 w-5" />;
}