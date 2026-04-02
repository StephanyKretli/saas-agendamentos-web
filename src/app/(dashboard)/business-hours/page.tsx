"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { useBusinessHours } from "@/features/business-hours/hooks/use-business-hours";
import { useCreateBusinessHour } from "@/features/business-hours/hooks/use-create-business-hour";
import { useUpdateBusinessHour } from "@/features/business-hours/hooks/use-update-business-hour";
import { useDeleteBusinessHour } from "@/features/business-hours/hooks/use-delete-business-hour";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Clock, User, ChevronDown } from "lucide-react";
import { BusinessHour } from "@/features/business-hours/types/business-hours.types";
import { motion, Variants } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WEEKDAYS = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

// 🌟 Variáveis de animação para a lista de dias
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// --- COMPONENTE FILHO PARA EDIÇÃO AUTOMÁTICA ---
function TimeSlotRow({ 
  slot, 
  onUpdate, 
  onDelete 
}: { 
  slot: BusinessHour; 
  onUpdate: (id: string, weekday: number, start: string, end: string) => void;
  onDelete: (id: string) => void;
}) {
  const [start, setStart] = useState(slot.start);
  const [end, setEnd] = useState(slot.end);

  useEffect(() => {
    setStart(slot.start);
    setEnd(slot.end);
  }, [slot.start, slot.end]);

  const handleBlur = () => {
    if (start !== slot.start || end !== slot.end) {
      onUpdate(slot.id, slot.weekday, start, end);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center gap-3 bg-background p-2 pr-3 rounded-xl border border-border/50 shadow-sm"
    >
      <input 
        type="time" 
        value={start} 
        onChange={(e) => setStart(e.target.value)}
        onBlur={handleBlur}
        className="w-24 rounded-lg bg-transparent px-2 py-1.5 text-sm font-bold transition-colors focus:bg-muted focus:outline-none"
      />
      <span className="text-muted-foreground text-xs font-medium uppercase">até</span>
      <input 
        type="time" 
        value={end} 
        onChange={(e) => setEnd(e.target.value)}
        onBlur={handleBlur}
        className="w-24 rounded-lg bg-transparent px-2 py-1.5 text-sm font-bold transition-colors focus:bg-muted focus:outline-none"
      />
      <button 
        onClick={() => onDelete(slot.id)}
        className="ml-auto p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        title="Remover turno"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function BusinessHoursPage() {
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");

  const { data: team = [] } = useQuery({
    queryKey: ["team-list"],
    queryFn: async () => {
      const res = await api.get("/team", { headers: getAuthHeaders() });
      return (res as unknown) as { id: string; name: string; avatarUrl?: string | null }[];
    }
  });

  const targetId = selectedProfessionalId || undefined;
  const { data: hours = [] } = useBusinessHours(targetId);
  
  const createMutation = useCreateBusinessHour(targetId);
  const updateMutation = useUpdateBusinessHour(targetId);
  const deleteMutation = useDeleteBusinessHour(targetId);

  const hoursByDay = WEEKDAYS.map(day => ({
    ...day,
    slots: hours.filter(h => h.weekday === day.value).sort((a, b) => a.start.localeCompare(b.start))
  }));

  const activeProfessional = useMemo(() => {
    if (!selectedProfessionalId) return { id: "", name: "A Minha Agenda (Admin)" };
    return team.find(m => String(m.id) === String(selectedProfessionalId)) || { id: "", name: "A carregar..." };
  }, [selectedProfessionalId, team]);

  const handleUpdateSlot = (id: string, weekday: number, start: string, end: string) => {
    updateMutation.mutate({ id, payload: { weekday, start, end } });
  };

  const handleAddInterval = (dayValue: number, slots: BusinessHour[]) => {
    if (slots.length === 0) {
      createMutation.mutate({ weekday: dayValue, start: "09:00", end: "18:00" });
      return;
    }

    const lastSlot = slots[slots.length - 1];
    const lastEndHour = parseInt(lastSlot.end.split(":")[0], 10);
    
    let newStart = "13:00";
    let newEnd = "18:00";

    if (!isNaN(lastEndHour) && lastEndHour < 23) {
      newStart = `${String(lastEndHour + 1).padStart(2, "0")}:00`;
      newEnd = `${String(Math.min(23, lastEndHour + 4)).padStart(2, "0")}:00`;
    }

    createMutation.mutate({ weekday: dayValue, start: newStart, end: newEnd });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-5xl">
      
      {/* 🌟 HEADER PADRONIZADO (Igual à Agenda) */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Horários de Atendimento</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Configure turnos e intervalos de almoço.
            </p>
          </div>
        </div>

        {/* 🌟 DROPDOWN DE SELEÇÃO DA equipe */}
        <div className="flex w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}
                className="h-12 rounded-2xl flex items-center gap-3 px-4 w-full sm:w-auto justify-between sm:justify-start bg-card border border-border shadow-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  {activeProfessional.avatarUrl ? (
                    <img src={activeProfessional.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="font-semibold text-sm">{activeProfessional.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
              </motion.button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width] sm:w-64 rounded-2xl p-2 shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
              <DropdownMenuItem
                onClick={() => setSelectedProfessionalId("")}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 outline-none transition-colors ${
                  selectedProfessionalId === "" ? "bg-primary/15 text-primary font-bold focus:bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${selectedProfessionalId === "" ? 'bg-primary/20' : 'bg-muted-foreground/10'}`}>
                  <User className="h-4 w-4" />
                </div>
                <span className="flex-1 truncate text-sm">A Minha Agenda (Admin)</span>
              </DropdownMenuItem>

              {team.map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  onClick={() => setSelectedProfessionalId(member.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 last:mb-0 outline-none transition-colors ${
                    selectedProfessionalId === String(member.id) ? "bg-primary/15 text-primary font-bold focus:bg-primary/20" : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${selectedProfessionalId === String(member.id) ? 'bg-primary/20' : 'bg-muted-foreground/10'}`}>
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <span className="flex-1 truncate text-sm">{member.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* 🌟 LISTA DE DIAS EM CASCATA */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {hoursByDay.map((day) => {
          const isActive = day.slots.length > 0;

          return (
            <motion.div 
              key={day.value} 
              variants={itemVariants}
              whileHover={{ x: isActive ? 4 : 0 }} // Pequeno movimento no hover se estiver ativo
              className={`flex flex-col md:flex-row md:items-start gap-4 p-5 sm:p-6 rounded-3xl border transition-all duration-300 shadow-sm ${
                isActive 
                  ? "bg-card border-primary/20 hover:border-primary/40" 
                  : "bg-muted/30 border-border opacity-70 grayscale-[0.2]"
              }`}
            >
              
              {/* Lado Esquerdo: Switch e Nome do Dia */}
              <div className="w-full md:w-56 flex items-center gap-4 shrink-0">
                <Switch 
                  checked={isActive} 
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      day.slots.forEach(s => deleteMutation.mutate(s.id));
                    } else {
                      createMutation.mutate({ weekday: day.value, start: "09:00", end: "18:00" });
                    }
                  }}
                  className={isActive ? "data-[state=checked]:bg-primary" : ""}
                />
                <span className={`text-base font-bold tracking-tight ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {day.label}
                </span>
              </div>

              {/* Lado Direito: Horários */}
              <div className="flex-1 min-w-0">
                {!isActive ? (
                  <div className="flex items-center h-full pt-1">
                    <span className="text-sm font-semibold text-muted-foreground/70 bg-muted/50 px-4 py-1.5 rounded-full border border-border/50 shadow-inner">
                      Fechado
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-3">
                      {day.slots.map((slot) => (
                        <TimeSlotRow 
                          key={slot.id} 
                          slot={slot} 
                          onUpdate={handleUpdateSlot}
                          onDelete={(id) => deleteMutation.mutate(id)}
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => handleAddInterval(day.value, day.slots)}
                      className="w-fit flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors py-1.5 px-3 rounded-xl hover:bg-primary/5 active:scale-95"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar turno / intervalo
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}