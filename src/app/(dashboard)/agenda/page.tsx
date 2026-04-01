"use client";

import * as React from "react";
import { ptBR } from "date-fns/locale";
import { format, addDays, subDays } from "date-fns";
import { motion, AnimatePresence, Variants } from "framer-motion";

import { DaySummary } from "@/features/appointments/components/day-summary";
import { RescheduleModal } from "@/features/appointments/components/reschedule-modal";
import { TimelineBlockedItemCard } from "@/features/appointments/components/timeline-blocked-item-card";
import { TimelineBusyItemCard } from "@/features/appointments/components/timeline-busy-item-card";
import { TimelineFreeItemCard } from "@/features/appointments/components/timeline-free-item-card";
import { TimelineRow } from "@/features/appointments/components/timeline-row";
import { TimelineItem, useDayTimeline } from "@/features/appointments/hooks/use-day-timeline";

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

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemEntryVariants: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 300, damping: 25 } 
  }
};

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = React.useState(formatDateInput(new Date()));
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = React.useState(false);
  const [isMobileCalendarOpen, setIsMobileCalendarOpen] = React.useState(false); 
  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);

  const { data: profile } = useSettings();
  const { data: team } = useTeam();

  const [selectedProfessionalId, setSelectedProfessionalId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (profile?.id && !selectedProfessionalId) {
      setSelectedProfessionalId(profile.id);
    }
  }, [profile?.id, selectedProfessionalId]);

  const professionals = React.useMemo(() => {
    const uniqueMap = new Map();
    if (profile) uniqueMap.set(String(profile.id), { id: profile.id, name: profile.name || "Você (Admin)", avatarUrl: profile.avatarUrl || null });
    if (Array.isArray(team)) {
      team.forEach(m => {
        if (m.id && String(m.id) !== String(profile?.id)) uniqueMap.set(String(m.id), { id: m.id, name: m.name, avatarUrl: m.avatarUrl || null });
      });
    }
    return Array.from(uniqueMap.values());
  }, [profile, team]);

  const activeProfessional = React.useMemo(() => {
    return professionals.find(p => String(p.id) === String(selectedProfessionalId)) || professionals[0];
  }, [professionals, selectedProfessionalId]);

  const { data: timelineData, isLoading, isError } = useDayTimeline(selectedDate, selectedProfessionalId);
  const items: TimelineItem[] = timelineData?.items ?? [];

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* 🌟 HEADER COM O NOVO PADRÃO DE DESIGN */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between max-w-400 mx-auto"      >
        {/* Lado Esquerdo: Ícone + Títulos (Estilo Bloqueios) */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">A sua Agenda</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              {displayDateCapitalized}
            </p>
          </div>
        </div>
        
        {/* Lado Direito: Filtro de Profissionais e Botão Novo */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full lg:w-auto">
          {professionals.length > 1 && (
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <motion.button 
                   whileHover={{ borderColor: "rgba(var(--primary), 0.3)" }}
                   className="h-12 rounded-2xl flex items-center gap-3 px-4 w-full sm:w-auto justify-between sm:justify-start bg-card border border-border shadow-sm transition-colors"
                 >
                   <div className="flex items-center gap-2">
                     {activeProfessional?.avatarUrl ? (
                       <img src={activeProfessional.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                     ) : (
                       <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                         <User className="h-3.5 w-3.5" />
                       </div>
                     )}
                     <span className="font-semibold text-sm">{activeProfessional?.name || "A carregar..."}</span>
                   </div>
                   <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                 </motion.button>
               </DropdownMenuTrigger>
               
               <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width] sm:w-64 rounded-2xl p-2 shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
                 {professionals.map((prof: any) => {
                   const isSelected = selectedProfessionalId && String(selectedProfessionalId) === String(prof.id);
                   return (
                     <DropdownMenuItem
                       key={`dropdown-${prof.id}`}
                       onClick={() => setSelectedProfessionalId(prof.id)}
                       className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 last:mb-0 outline-none transition-colors ${
                         isSelected 
                           ? "bg-primary/15 text-primary font-bold focus:bg-primary/20" 
                           : "text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                       }`}
                     >
                       {prof.avatarUrl ? (
                         <img src={prof.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover shadow-sm" />
                       ) : (
                         <div className={`h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${isSelected ? 'bg-primary/20' : 'bg-muted-foreground/10'}`}>
                           <User className="h-4 w-4" />
                         </div>
                     )}
                       <span className="flex-1 truncate text-sm">{prof.name}</span>
                     </DropdownMenuItem>
                   );
                 })}
               </DropdownMenuContent>
             </DropdownMenu>
          )}
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Button onClick={() => setIsNewAppointmentOpen(true)} className="rounded-xl w-full sm:w-auto shrink-0 h-12 shadow-sm font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Novo Agendamento
              </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isNewAppointmentOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-xl border border-border max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Novo Agendamento</h2>
                        <button onClick={() => setIsNewAppointmentOpen(false)} className="rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <AppointmentForm 
                        initialDate={selectedDate as any}
                        professionalId={selectedProfessionalId}
                        onCancel={() => setIsNewAppointmentOpen(false)}
                        onSuccess={() => setIsNewAppointmentOpen(false)}
                    />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-34 sm:top-24 z-20 flex lg:hidden items-center justify-between rounded-full border border-border/50 bg-background/90 backdrop-blur-sm p-1.5 shadow-sm">
        <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="rounded-full hover:bg-muted text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <button onClick={() => setIsMobileCalendarOpen(true)} className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 rounded-full transition-colors">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">{displayDateCapitalized}</span>
        </button>

        <Button variant="ghost" size="icon" onClick={goToNextDay} className="rounded-full hover:bg-muted text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {isMobileCalendarOpen && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm lg:hidden"
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-sm rounded-3xl bg-card p-5 shadow-xl border border-border"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Escolher data</h2>
                        <button onClick={() => setIsMobileCalendarOpen(false)} className="rounded-full p-2 hover:bg-muted text-muted-foreground">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex justify-center bg-background p-2 rounded-2xl border border-border/50">
                        <Calendar
                            mode="single" locale={ptBR} selected={calendarDate}
                            onSelect={(newDate) => { 
                                if (newDate) {
                                    setSelectedDate(formatDateInput(newDate));
                                    setIsMobileCalendarOpen(false);
                                }
                            }}
                        />
                    </div>
                    <Button onClick={goToToday} variant="outline" className="w-full mt-4 rounded-xl font-bold">
                        Ir para Hoje
                    </Button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[auto_1fr] items-start">
        
        <div className="hidden lg:block rounded-3xl border border-border bg-card/50 p-4 shadow-sm sticky top-25 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between px-2">
            <h2 className="font-semibold text-foreground text-sm">Calendário</h2>
            {!items.length && !isLoading && (
              <button onClick={goToToday} className="text-xs font-bold text-primary hover:underline transition-all">
                Hoje
              </button>
            )}
          </div>
          <div className="bg-background rounded-2xl border border-border/50 shadow-inner p-1">
            <Calendar
              mode="single" locale={ptBR} selected={calendarDate}
              onSelect={(newDate) => { if (newDate) setSelectedDate(formatDateInput(newDate)); }}
            />
          </div>
        </div>

        <div className="space-y-6 min-w-0">
          
          {!isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DaySummary {...summary as any} />
            </motion.div>
          )}

          <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm overflow-hidden relative">
            {isLoading ? (
              <TimelineSkeleton /> 
            ) : isError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
                <p className="font-semibold">Erro ao carregar a agenda.</p>
                <p className="text-sm mt-1 opacity-80">Verifique a sua ligação ou tente novamente.</p>
              </div>
            ) : !items.length ? (
              <EmptyState
                icon={CalendarIcon}
                title="A sua agenda está livre"
                description="Não existem compromissos ou horários bloqueados para este dia."
                actionLabel="Novo Agendamento"
                onAction={() => setIsNewAppointmentOpen(true)}
              />
            ) : (
              <motion.div 
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4 relative"
              >
                <div className="absolute left-5.5 top-2 bottom-2 w-0.5 bg-border/40 rounded-full" />

                {items.map((item: any, index: number) => (
                  <motion.div 
                    key={item.appointmentId || `item-${index}`} 
                    variants={itemEntryVariants}
                    whileHover={{ x: 3 }}
                    className="relative z-10"
                  >
                    <TimelineRow time={item.start}>
                      
                      {item.type.toLowerCase() === "free" && (
                        <motion.div 
                          whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--primary), 0.03)" }}
                          whileTap={{ scale: 0.99 }}
                          className="rounded-2xl transition-shadow hover:shadow-md"
                        >
                          <TimelineFreeItemCard start={item.start} end={item.end} />
                        </motion.div>
                      )}
                      
                      {item.type.toLowerCase() === "blocked" && (
                        <div className="opacity-70 grayscale">
                          <TimelineBlockedItemCard start={item.start} end={item.end} />
                        </div>
                      )}
                      
                      {item.type.toLowerCase() === "busy" && (
                        <motion.div 
                          whileHover={{ scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                          className="rounded-2xl transition-all border border-transparent hover:border-border/80 hover:bg-background shadow-sm overflow-hidden"
                        >
                          <TimelineBusyItemCard
                            item={item}
                            selectedDate={selectedDate}
                            onReschedule={(selected) => {
                              setSelectedAppointment({
                                appointmentId: selected.appointmentId,
                                start: selected.start,
                                end: selected.end,
                                status: selected.status,
                                service: { id: selected.service.id, name: selected.service.name, duration: selected.service.duration },
                                client: selected.client ? { name: selected.client.name ?? "Cliente" } : null,
                              });
                              setRescheduleOpen(true);
                            }}
                          />
                        </motion.div>
                      )}
                    </TimelineRow>
                  </motion.div>
                ))}
              </motion.div>
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
        selectedDate={selectedDate as any}
        appointment={selectedAppointment}
      />
    </div>
  );
}