import { Card, CardContent } from "@/components/ui/card";
import { cn, formatDuration, formatPrice } from "@/lib/utils";
import type { PublicService } from "@/types/booking";

// 🌟 Importamos explicitamente para o Next.js NUNCA os apagar!
// 🌟 Importamos 'Wind' em vez de 'Spray'
import { 
  Scissors, 
  Eye, 
  Wand2, 
  Sparkles, 
  Pencil, 
  Crown, 
  Wind, // Trocado aqui!
  LayoutGrid 
} from "lucide-react";

// 🌟 Dicionário de Ícones
const iconMap: Record<string, React.ElementType> = {
  scissors: Scissors,
  eye: Eye,
  wand2: Wand2,
  sparkles: Sparkles,
  pencil: Pencil,
  crown: Crown,
  spray: Wind, // Quando o banco pedir "spray", desenhamos o "Wind"
};

type Props = {
  service: PublicService;
  selected: boolean;
  onSelect: () => void;
};

function DynamicIcon({ iconName }: { iconName?: string | null }) {
  // Se vier nulo ou vazio do backend
  if (!iconName) return <LayoutGrid className="h-5 w-5" />;

  // Procura no nosso dicionário (tudo em minúsculo para garantir)
  const IconComponent = iconMap[iconName.toLowerCase()];

  // Se o ícone não estiver no dicionário, cai para o padrão
  if (!IconComponent) return <LayoutGrid className="h-5 w-5" />;

  return <IconComponent className="h-5 w-5" />;
}

export function ServiceCard({ service, selected, onSelect }: Props) {
  console.log("Dados do Serviço dentro do Card:", service.name, "Ícone recebido:", service.icon);
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
            
            {/* Caixinha do Ícone */}
            <div className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
              selected ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            )}>
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