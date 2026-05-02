import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { PublicService } from "@/types/booking";
import * as Icons from "lucide-react"; // Importamos todos os ícones para poder escolher dinamicamente

type Props = {
  service: PublicService;
  selected: boolean;
  onSelect: () => void;
};

// 🌟 Componente que renderiza magicamente o ícone salvo no seu banco de dados
function DynamicIcon({ iconName }: { iconName?: string | null }) {
  // Se o serviço não tiver ícone no banco, exibe o de quadradinhos (LayoutGrid)
  if (!iconName) return <Icons.LayoutGrid className="h-5 w-5" />;

  // Busca o ícone exato pelo nome salvo no banco (ex: "Eye", "Scissors", "Crown")
  const IconComponent = (Icons as any)[iconName];

  // Se por acaso o nome salvo for inválido, cai no padrão de quadradinhos
  if (!IconComponent) return <Icons.LayoutGrid className="h-5 w-5" />;

  return <IconComponent className="h-5 w-5" />;
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
            
            {/* 🌟 Caixinha do Ícone - Puxando direto do seu banco! */}
            <div className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              selected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {/* Nota: Verifique se a propriedade no seu banco se chama 'icon' ou 'iconName' */}
              <DynamicIcon iconName={service.icon as string | undefined} />
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