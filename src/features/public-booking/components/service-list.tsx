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
  Eye,      // 🌟 Adicionado
  Pencil,   // 🌟 Adicionado
  Wind,     // 🌟 Adicionado (para o Ozônio/Spray)
  LayoutGrid
} from "lucide-react";
import type { PublicService } from "../types/public-booking.types";

// 🌟 Mapa de ícones atualizado com TUDO o que está no seu banco de dados
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
  eye: Eye,       // 🌟 Agora o "Fox Eyes" vai aparecer!
  pencil: Pencil, // 🌟 Agora o "Design" vai aparecer!
  spray: Wind,    // 🌟 Mapeando "spray" do banco para o ícone "Wind"
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
        
        // 🕵️‍♀️ Log para você ver no console se o nome vindo do banco bate com o mapa
        console.log(`Serviço: ${service.name} | Ícone no Banco: ${service.icon}`);

        // Busca no mapa usando o nome em minúsculo (conforme está no seu DBeaver)
        const iconKey = service.icon?.toLowerCase();
        const IconComponent = (iconKey && ICON_MAP[iconKey]) 
          ? ICON_MAP[iconKey] 
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