"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { format, addDays, subDays } from "date-fns";
import { DaySummary } from "@/features/appointments/components/day-summary";
import { RescheduleModal } from "@/features/appointments/components/reschedule-modal";
import { TimelineBlockedItemCard } from "@/features/appointments/components/timeline-blocked-item-card";
import { TimelineBusyItemCard } from "@/features/appointments/components/timeline-busy-item-card";
import { TimelineFreeItemCard } from "@/features/appointments/components/timeline-free-item-card";
import { TimelineRow } from "@/features/appointments/components/timeline-row";
import {
  TimelineItem,
  useDayTimeline,
} from "@/features/appointments/hooks/use-day-timeline";

import { useTeam } from "@/features/team/hooks/use-team";
import { useSettings } from "@/features/settings/hooks/use-settings";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus, CalendarIcon, ChevronLeft, ChevronRight, X, User, ChevronDown } from "lucide-react"; 
import { AppointmentForm } from "@/features/appointments/components/appointment-form";
import { EmptyState } from "@/components/ui/empty-state";
import { TimelineSkeleton } from "@/features/appointments/components/timeline-skeleton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isToday(date: string) {
  return date === formatDateInput(new Date());
}

function getCurrentHourLabel() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:00`;
}

type SelectedAppointment = {
  appointmentId: string;
  start: string;
  end: string;
  status: string;
  service: { id: string; name: string; duration: number };
  client: { name: string } | null;
};

type AgendaFilter = "all" | "scheduled" | "completed" | "canceled" | "free" | "blocked";

const FILTER_LABELS: Record<AgendaFilter, string> = {
  all: "Todos",
  scheduled: "Agendados",
  completed: "Concluídos",
  canceled: "Cancelados",
  free: "Livres",
  blocked: "Bloqueados",
};

function matchesFilter(item: TimelineItem, filter: AgendaFilter) {
  if (filter === "all") return true;
  if (filter === "free") return item.type === "free";
  if (filter === "blocked") return item.type === "blocked";
  if (item.type !== "busy") return false;
  if (filter === "scheduled") return item.status === "SCHEDULED";
  if (filter === "completed") return item.status === "COMPLETED";
  if (filter === "canceled") return item.status === "CANCELED";
  return true;
}

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(formatDateInput(new Date()));
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = React.useState(false); 
  const [filter, setFilter] = React.useState<AgendaFilter>("all");
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<SelectedAppointment | null>(null);

  // 👇 Usamos APENAS os hooks que já existiam no seu projeto!
  const { data: profile } = useSettings();
  const { data: team } = useTeam();

  const [selectedProfessionalId, setSelectedProfessionalId] = React.useState<string | undefined>(undefined);

  // Define VOCÊ (profile) como a profissional selecionada por padrão ao abrir a tela
  React.useEffect(() => {
    if (profile?.id && !selectedProfessionalId) {
      setSelectedProfessionalId(profile.id);
    }
  }, [profile?.id, selectedProfessionalId]);

  // Cria a lista combinada (Você + Equipe)
  const professionals = React.useMemo(() => {
    const uniqueMap = new Map();
    
    // 1. Adiciona você primeiro usando o 'profile'
    if (profile) {
      uniqueMap.set(String(profile.id), {
        id: profile.id,
        name: profile.name || "Você (Admin)",
        avatarUrl: profile.avatarUrl || null
      });
    }
    
    // 2. Adiciona os membros da equipe
    if (Array.isArray(team)) {
      team.forEach(m => {
        if (m.id && String(m.id) !== String(profile?.id)) {
          uniqueMap.set(String(m.id), { 
            id: m.id, 
            name: m.name, 
            avatarUrl: m.avatarUrl || null 
          });
        }
      });
    }

    return Array.from(uniqueMap.values());
  }, [profile, team]);

  const activeProfessional = React.useMemo(() => {
    return professionals.find(p => String(p.id) === String(selectedProfessionalId)) || professionals[0];
  }, [professionals, selectedProfessionalId]);

  const { data, isLoading, isError } = useDayTimeline(selectedDate, selectedProfessionalId);
  const items: TimelineItem[] = data?.items ?? [];

  const calendarDate = new Date(`${selectedDate}T12:00:00`);

  const goToPreviousDay = () => setSelectedDate(formatDateInput(subDays(calendarDate, 1)));
  const goToNextDay = () => setSelectedDate(formatDateInput(addDays(calendarDate, 1)));
  const goToToday = () => setSelectedDate(formatDateInput(new Date()));

  const displayDate = format(calendarDate, "EEEE, d 'de' MMM", { locale: ptBR });
  const displayDateCapitalized = displayDate.charAt(0).toUpperCase() + displayDate.slice(1);

  const summary = React.useMemo(() => {
    const totalBusy = items.filter((item) => item.type === "busy").length;
    const scheduled = items.filter((item) => item.type === "busy" && item.status === "SCHEDULED").length;
    const completed = items.filter((item) => item.type === "busy" && item.status === "COMPLETED").length;
    const canceled = items.filter((item) => item.type === "busy" && item.status === "CANCELED").length;
    const free = items.filter((item) => item.type === "free").length;
    const blocked = items.filter((item) => item.type === "blocked").length;

    return { totalBusy, scheduled, completed, canceled, free, blocked };
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => matchesFilter(item, filter));
  }, [items, filter]);

  const showCurrentHourHighlight = isToday(selectedDate);
  const currentHourLabel = getCurrentHourLabel();
  const filterOptions: AgendaFilter[] = ["all", "scheduled", "completed", "canceled", "free", "blocked"];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4 w-full sm:w-auto">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">A sua Agenda</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerencie horários, clientes e marcações diárias.
            </p>
          </div>

          {professionals.length > 1 && (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button 
                   variant="outline" 
                   className="h-12 rounded-2xl flex items-center gap-3 px-4 w-full sm:w-auto justify-between sm:justify-start hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                 >
                   <div className="flex items-center gap-2">
                     {activeProfessional?.avatarUrl ? (
                       <img src={activeProfessional.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                     ) : (
                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                         <User className="h-3.5 w-3.5" />
                       </div>
                     )}
                     <span className="font-semibold">{activeProfessional?.name || "A carregar..."}</span>
                   </div>
                   <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                 </Button>
               </DropdownMenuTrigger>
               
               <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width] sm:w-64 rounded-2xl p-2 shadow-xl border-border/50">
                 {professionals.map((prof: any) => {
                   const isSelected = selectedProfessionalId && String(selectedProfessionalId) === String(prof.id);
                   
                   return (
                     <DropdownMenuItem
                       key={`dropdown-${prof.id}`}
                       onClick={() => setSelectedProfessionalId(prof.id)}
                       className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 last:mb-0 ${
                         isSelected 
                           ? "bg-primary/10 text-primary font-bold focus:bg-primary/15 focus:text-primary" 
                           : "hover:bg-muted focus:bg-muted"
                       }`}
                     >
                       {prof.avatarUrl ? (
                         <img src={prof.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shadow-sm" />
                       ) : (
                         <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${isSelected ? 'bg-primary/20' : 'bg-muted-foreground/10'}`}>
                           <User className="h-4 w-4" />
                         </div>
                       )}
                       <span className="flex-1 truncate">{prof.name}</span>
                     </DropdownMenuItem>
                   );
                 })}
               </DropdownMenuContent>
             </DropdownMenu>
          )}
        </div>
        
        <Button onClick={() => setIsNewAppointmentOpen(true)} className="rounded-xl w-full sm:w-auto shrink-0 h-12 shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>

      {isNewAppointmentOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-xl border border-border animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Novo Agendamento</h2>
              <button onClick={() => setIsNewAppointmentOpen(false)} className="rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <AppointmentForm 
              initialDate={selectedDate}
              professionalId={selectedProfessionalId}
              onCancel={() => setIsNewAppointmentOpen(false)}
              onSuccess={() => setIsNewAppointmentOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl sm:rounded-3xl border border-border bg-card p-2 shadow-sm lg:hidden">
        <button onClick={goToPreviousDay} className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button 
          onClick={() => setIsMobileCalendarOpen(true)} 
          className="flex flex-col items-center px-4 py-2 hover:bg-muted/50 rounded-xl transition-colors"
        >
          <span className="text-sm font-bold text-foreground">{displayDateCapitalized}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday(selectedDate) ? 'text-primary' : 'text-muted-foreground'}`}>
            {isToday(selectedDate) ? "Hoje" : "Tocar para calendário"}
          </span>
        </button>

        <button onClick={goToNextDay} className="p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {isMobileCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-card p-5 shadow-xl border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Escolher data</h2>
              <button onClick={() => setIsMobileCalendarOpen(false)} className="rounded-full p-2 hover:bg-muted text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={calendarDate}
                onSelect={(newDate) => { 
                  if (newDate) {
                    setSelectedDate(formatDateInput(newDate));
                    setIsMobileCalendarOpen(false);
                  }
                }}
                locale={ptBR}
                className="rounded-xl border border-border/50 shadow-sm"
              />
            </div>
            <Button onClick={goToToday} variant="outline" className="w-full mt-4 rounded-xl">
              Ir para Hoje
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[auto_1fr] items-start">
        
        <div className="hidden lg:block rounded-3xl border border-border bg-card p-4 shadow-sm sticky top-6">
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="font-semibold text-foreground">Navegação</h2>
            {!isToday(selectedDate) && (
              <button onClick={goToToday} className="text-xs font-bold text-primary hover:underline">
                Ir para Hoje
              </button>
            )}
          </div>
          <Calendar
            mode="single"
            selected={calendarDate}
            onSelect={(newDate) => { 
              if (newDate) setSelectedDate(formatDateInput(newDate));
            }}
            locale={ptBR}
            className="rounded-2xl border border-border/50 bg-background/50"
          />
        </div>

        <div className="space-y-6 min-w-0">
          
          {!isLoading && <DaySummary {...summary} />}

          <div className="flex gap-2 overflow-x-auto pb-2 px-1 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden snap-x">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  filter === option
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {FILTER_LABELS[option]}
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm">
            {isLoading ? (
              <TimelineSkeleton /> 
            ) : isError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
                <p className="font-semibold">Erro ao carregar a agenda.</p>
                <p className="text-sm mt-1 opacity-80">Verifique a sua ligação ou tente novamente.</p>
              </div>
            ) : !filteredItems.length ? (
              <EmptyState
                icon={CalendarIcon}
                title={filter === "all" ? "A sua agenda está livre" : "Nenhum resultado"}
                description={
                  filter === "all"
                    ? "Não existem compromissos ou horários bloqueados para este dia."
                    : `Não encontrámos itens com o filtro "${FILTER_LABELS[filter]}".`
                }
                actionLabel={filter !== "all" ? "Limpar filtros" : "Novo Agendamento"}
                onAction={() => {
                  if (filter !== "all") setFilter("all");
                  else setIsNewAppointmentOpen(true);
                }}
              />
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item: TimelineItem, index: number) => {
                  const isCurrentHour = showCurrentHourHighlight && item.start === currentHourLabel;

                  if (item.type === "free") {
                    return (
                      <TimelineRow key={`free-${item.start}-${index}`} time={item.start} isCurrentHour={isCurrentHour}>
                        <TimelineFreeItemCard start={item.start} end={item.end} />
                      </TimelineRow>
                    );
                  }

                  if (item.type === "blocked") {
                    return (
                      <TimelineRow key={`blocked-${item.start}-${index}`} time={item.start} isCurrentHour={isCurrentHour}>
                        <TimelineBlockedItemCard start={item.start} end={item.end} />
                      </TimelineRow>
                    );
                  }

                  return (
                    <TimelineRow key={item.appointmentId} time={item.start} isCurrentHour={isCurrentHour}>
                      <TimelineBusyItemCard
                        item={item}
                        selectedDate={selectedDate}
                        onReschedule={(selected) => {
                          setSelectedAppointment({
                            appointmentId: selected.appointmentId,
                            start: selected.start,
                            end: selected.end,
                            status: selected.status,
                            service: {
                              id: selected.service.id,
                              name: selected.service.name,
                              duration: selected.service.duration,
                            },
                            client: selected.client ? { name: selected.client.name ?? "Cliente" } : null,
                          });
                          setRescheduleOpen(true);
                        }}
                      />
                    </TimelineRow>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <RescheduleModal
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setSelectedAppointment(null);
        }}
        selectedDate={selectedDate}
        appointment={selectedAppointment}
      />
    </div>
  );
}