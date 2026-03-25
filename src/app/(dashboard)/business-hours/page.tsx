"use client";

import { useState, useEffect } from "react";
import { useBusinessHours } from "@/features/business-hours/hooks/use-business-hours";
import { useCreateBusinessHour } from "@/features/business-hours/hooks/use-create-business-hour";
import { useUpdateBusinessHour } from "@/features/business-hours/hooks/use-update-business-hour";
import { useDeleteBusinessHour } from "@/features/business-hours/hooks/use-delete-business-hour";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { BusinessHour } from "@/features/business-hours/types/business-hours.types";

const WEEKDAYS = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

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
      // Passamos o slot.weekday aqui!
      onUpdate(slot.id, slot.weekday, start, end);
    }
  };

  return (
    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
      <input 
        type="time" 
        value={start} 
        onChange={(e) => setStart(e.target.value)}
        onBlur={handleBlur}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <span className="text-muted-foreground text-sm">até</span>
      <input 
        type="time" 
        value={end} 
        onChange={(e) => setEnd(e.target.value)}
        onBlur={handleBlur}
        className="rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <button 
        onClick={() => onDelete(slot.id)}
        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
        title="Remover turno"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---
export default function BusinessHoursPage() {
  const { data: hours = [] } = useBusinessHours();
  const createMutation = useCreateBusinessHour();
  const updateMutation = useUpdateBusinessHour();
  const deleteMutation = useDeleteBusinessHour();

  const hoursByDay = WEEKDAYS.map(day => ({
    ...day,
    slots: hours.filter(h => h.weekday === day.value).sort((a, b) => a.start.localeCompare(b.start))
  }));

  const handleUpdateSlot = (id: string, weekday: number, start: string, end: string) => {
    updateMutation.mutate({ id, payload: { weekday, start, end } });
  };

  const handleAddInterval = (dayValue: number, slots: BusinessHour[]) => {
    if (slots.length === 0) {
      createMutation.mutate({ weekday: dayValue, start: "09:00", end: "18:00" });
      return;
    }

    // Lógica Inteligente: Cria o próximo turno 1 hora após o término do último
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
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Horários de Atendimento</h1>
        <p className="text-muted-foreground mt-1">
          Configure os seus turnos de trabalho. O intervalo entre os turnos será considerado como horário de almoço/descanso.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border shadow-sm">
        {hoursByDay.map((day) => (
          <div key={day.value} className="p-5 flex flex-col md:flex-row md:items-start gap-6">
            
            {/* Dia da Semana & Switch */}
            <div className="w-48 flex items-center gap-3 pt-1">
              <Switch 
                checked={day.slots.length > 0} 
                onCheckedChange={(checked) => {
                  if (!checked) {
                    day.slots.forEach(s => deleteMutation.mutate(s.id));
                  } else {
                    createMutation.mutate({ weekday: day.value, start: "09:00", end: "18:00" });
                  }
                }}
              />
              <span className={`font-medium ${day.slots.length === 0 ? 'text-muted-foreground' : 'text-foreground'}`}>
                {day.label}
              </span>
            </div>

            {/* Gestão de Horários */}
            <div className="flex-1 space-y-3">
              {day.slots.length === 0 ? (
                <div className="pt-1">
                  <span className="text-sm font-medium text-muted-foreground/60 italic bg-muted/50 px-3 py-1 rounded-full">
                    Fechado
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Linhas de Turno Editáveis */}
                  {day.slots.map((slot) => (
                    <TimeSlotRow 
                      key={slot.id} 
                      slot={slot} 
                      onUpdate={handleUpdateSlot}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
                  
                  {/* Botão de Adicionar */}
                  <button 
                    onClick={() => handleAddInterval(day.value, day.slots)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Adicionar intervalo / turno
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}