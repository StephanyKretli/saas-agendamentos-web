import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { PublicService } from "@/types/booking";
import { Scissors, Sparkles, Eye, Flower2, Droplet } from "lucide-react"; // Importamos os ícones mágicos!

type Props = {
  service: PublicService;
  selected: boolean;
  onSelect: () => void;
};

// 🌟 Função inteligente que escolhe o ícone com base no nome do serviço
function getServiceIcon(name: string) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes("cílios") || lowerName.includes("cilios") || lowerName.includes("lash")) {
    return <Eye className="h-5 w-5" />;
  }
  if (lowerName.includes("cabelo") || lowerName.includes("corte") || lowerName.includes("escova")) {
    return <Scissors className="h-5 w-5" />;
  }
  if (lowerName.includes("unha") || lowerName.includes("manicure") || lowerName.includes("pedicure")) {
    return <Droplet className="h-5 w-5" />;
  }
  if (lowerName.includes("sobrancelha") || lowerName.includes("design")) {
    return <Flower2 className="h-5 w-5" />;
  }
  
  // Ícone padrão caso não encontre nenhuma palavra-chave
  return <Sparkles className="h-5 w-5" />;
}

export function ServiceCard({ service, selected, onSelect }: Props) {
  return (
    <button className="w-full text-left" onClick={onSelect} type="button">
      <Card
        className={cn(
          "rounded-2xl border transition-all duration-200",
          selected
            ? "border-slate-900 shadow-md ring-2 ring-slate-900/10"
            : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md",
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            
            {/* 🌟 Aqui adicionamos o bloco do ícone! */}
            <div className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              selected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {getServiceIcon(service.name)}
            </div>

            <div className="flex-1 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {formatDuration(service.duration)}
                </p>
              </div>

              <span className="text-sm font-medium text-slate-800">
                {formatPrice(service.priceCents)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}