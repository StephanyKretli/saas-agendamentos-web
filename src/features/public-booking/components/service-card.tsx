"use client"; // Garante que roda no navegador

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PublicService } from "@/features/public-booking/types/public-booking.types";
import { 
  Scissors, 
  Eye, 
  Wand2, 
  Sparkles, 
  Pencil, 
  Crown, 
  Wind, 
  LayoutGrid 
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  scissors: Scissors,
  eye: Eye,
  wand2: Wand2,
  sparkles: Sparkles,
  pencil: Pencil,
  crown: Crown,
  spray: Wind,
};

function DynamicIcon({ iconName }: { iconName?: string | null }) {
  if (!iconName) return <LayoutGrid className="h-5 w-5" />;
  const IconComponent = iconMap[iconName.toLowerCase()];
  if (!IconComponent) return <LayoutGrid className="h-5 w-5" />;
  return <IconComponent className="h-5 w-5" />;
}

export function ServiceCard({ service, selected, onSelect }: { 
  service: PublicService, 
  selected: boolean, 
  onSelect: () => void 
}) {
  // 🕵️‍♀️ AGORA SIM ESTE LOG VAI APARECER NO F12!
  console.log("RENDERIZANDO CARD:", service.name, "ICONE:", service.icon);

  return (
    <button className="w-full text-left" onClick={onSelect} type="button">
      <Card className={cn(
          "rounded-2xl border transition-all duration-200",
          selected ? "border-primary bg-primary/5 ring-2 ring-primary/10" : "border-border bg-card hover:border-accent"
      )}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <DynamicIcon iconName={service.icon} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{service.name}</h3>
                <span className="text-sm font-medium">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(service.priceCents / 100)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{service.duration} min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}