import { 
  Scissors, 
  Brush, 
  Sparkles, 
  Droplets, 
  Flower2, 
  Wand2, 
  Crown, 
  Heart, 
  Smile,
  LayoutGrid
} from "lucide-react";
import type { PublicService } from "../types/public-booking.types";

// Mapa de ícones correspondente ao que o profissional escolhe no painel
const ICON_MAP: Record<string, React.ElementType> = {
  scissors: Scissors,
  brush: Brush,
  sparkles: Sparkles,
  droplets: Droplets,
  flower2: Flower2,
  wand2: Wand2,
  crown: Crown,
  heart: Heart,
  smile: Smile,
};

type ServiceListProps = {
  services: PublicService[];
  selectedServiceId: string | null;
  onSelectService: (service: PublicService) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function ServiceList({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceListProps) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-5">
        <p className="text-sm font-medium text-foreground">
          Nenhum serviço disponível
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Este profissional ainda não cadastrou serviços para agendamento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {services.map((service) => {
        const isSelected = selectedServiceId === service.id;
        
        // Pega no ícone correspondente ou usa um genérico (LayoutGrid) se não existir
        const IconComponent = (service.icon && ICON_MAP[service.icon]) 
          ? ICON_MAP[service.icon] 
          : LayoutGrid;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelectService(service)}
            className={`w-full rounded-2xl border p-4 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                : "border-border bg-background hover:bg-muted/40"
            }`}
          >
            <div className="flex items-start gap-4">
              
              {/* LÓGICA DE EXIBIÇÃO: Imagem ou Ícone */}
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="h-20 w-20 shrink-0 rounded-2xl border border-border object-cover"
                />
              ) : (
                <div 
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                    isSelected 
                      ? "border-primary/20 bg-primary/10 text-primary" 
                      : "border-dashed border-border bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <IconComponent className="h-8 w-8 opacity-80" strokeWidth={1.5} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className={`text-base font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.duration} min
                    </p>
                  </div>

                  <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelected ? "Selecionado" : "Selecionar"}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  {formatPrice(service.priceCents)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}