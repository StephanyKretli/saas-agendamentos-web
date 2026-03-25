"use client";

import React, { useState } from "react";
import { 
  Scissors, Brush, Sparkles, Droplets, Flower2, Wand2, Heart, Crown, Smile,
  HandIcon, Zap, GlassWater, User, SprayCan, Gem, Footprints, Eye, PencilLine,
  ChevronLeft, LayoutGrid
} from "lucide-react";

export const ICON_CATEGORIES = [
  {
    id: "barber",
    label: "Barbearia",
    icons: [
      { id: "scissors", icon: Scissors, label: "Corte" },
      { id: "spray", icon: SprayCan, label: "Barba" },
      { id: "user", icon: User, label: "Visagismo" },
    ]
  },
  {
    id: "hair",
    label: "Salão / Cabelo",
    icons: [
      { id: "wand2", icon: Wand2, label: "Química" },
      { id: "droplets", icon: Droplets, label: "Lavagem" },
      { id: "crown", icon: Crown, label: "Penteado" },
    ]
  },
  {
    id: "nails",
    label: "Unhas",
    icons: [
      { id: "hand", icon: HandIcon, label: "Manicure" },
      { id: "foot", icon: Footprints, label: "Pedicure" },
      { id: "sparkles", icon: Sparkles, label: "Alongamento" },
    ]
  },
  {
    id: "estetica",
    label: "Estética & Pele",
    icons: [
      { id: "glass", icon: GlassWater, label: "Limpeza" },
      { id: "pencil", icon: PencilLine, label: "Maquiagem" },
      { id: "zap", icon: Zap, label: "Laser" },
      { id: "eye", icon: Eye, label: "Cílios" },
      { id: "gem", icon: Gem, label: "Piercing" },
    ]
  },
  {
    id: "spa",
    label: "Bem-estar",
    icons: [
      { id: "flower2", icon: Flower2, label: "Massagem" },
      { id: "heart", icon: Heart, label: "Terapias" },
      { id: "smile", icon: Smile, label: "Outros" },
    ]
  }
];

type IconPickerProps = {
  value: string;
  onChange: (id: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  // 1. Iniciamos o estado como null para sempre mostrar os nichos ao abrir, 
  // a menos que o usuário clique em um.
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);

  // 2. Procuramos a categoria do ícone atual APENAS para mostrar o nome dela no canto
  const currentCategory = ICON_CATEGORIES.find(cat => 
    cat.icons.some(icon => icon.id === value)
  );

  // 3. A categoria ativa será a que o usuário clicou (selectedNiche)
  const activeCategory = ICON_CATEGORIES.find(c => c.id === selectedNiche);

  // SE o usuário clicou em um nicho, mostramos os ícones dele
  if (activeCategory) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedNiche(null)} // Volta para a tela de nichos
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar para Nichos
          </button>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            {activeCategory.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {activeCategory.icons.map((item) => {
            const IconComponent = item.icon;
            const isSelected = value === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none text-center">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // SE NÃO houver nicho selecionado, mostramos a lista de nichos (mesmo em edição)
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col gap-1"> 
        <label className="text-sm font-semibold text-foreground">
          Ícone do Serviço
        </label>
        {/* Mostra qual ícone está selecionado atualmente, se houver um */}
        {currentCategory && (
          <p className="text-[10px] text-primary font-medium uppercase tracking-widest">
            Selecionado: {currentCategory.label}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ICON_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedNiche(category.id)}
            className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-primary/50 hover:bg-muted/50 group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-foreground">
                {category.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}