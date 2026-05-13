"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useBlockedDates } from "@/features/blocked-dates/hooks/use-blocked-dates";
import { useBlockedSlots } from "@/features/blocked-slots/hooks/use-blocked-slots";
import { useTeam } from "@/features/team/hooks/use-team";
import { useSettings } from "@/features/settings/hooks/use-settings";

import { BlockedDatesForm } from "@/features/blocked-dates/components/blocked-dates-form";
import { BlockedDatesList } from "@/features/blocked-dates/components/blocked-dates-list";

import { BlockedSlotForm } from "@/features/blocked-slots/components/blocked-slot-form";
import { BlockedSlotList } from "@/features/blocked-slots/components/blocked-slot-list";

import { Calendar, Clock, ShieldAlert, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number, icon: any }) {
  return (
    <motion.div 
      variants={statItemVariants}
      className="rounded-3xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlockedDatesPage() {
  const [activeTab, setActiveTab] = useState<"dates" | "slots">("dates");
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);
  
  const { data: team = [], isLoading: loadingTeam } = useTeam();
  const { data: profile } = useSettings();
  const isSalonOwner = profile && !(profile as any).ownerId;

  useEffect(() => {
    if (profile && !selectedProfessionalId) {
      setSelectedProfessionalId(String((profile as any).id));
    }
  }, [profile, selectedProfessionalId]);

  const { data: activeDates = [] } = useBlockedDates(selectedProfessionalId || "");
  const { data: activeSlots = [] } = useBlockedSlots(selectedProfessionalId || "");

  const selectedMember = team.find((m: any) => String(m.id) === selectedProfessionalId) || profile;
  
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 sm:p-8">
      
      {/* HEADER COM SELEÇÃO DE EQUIPE */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bloqueios de Agenda
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gerencie as ausências e intervalos da sua equipe.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Profissional:</span>
          
          {isSalonOwner ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex h-11 items-center gap-3 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/50 focus:outline-none active:scale-95">
                  {selectedMember?.avatarUrl ? (
                    <img src={(selectedMember as any).avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <span className="truncate max-w-[150px]">{selectedMember?.name || "Selecionar..."}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                sideOffset={8}
                className="w-64 rounded-2xl p-2 shadow-2xl border border-border bg-card ring-1 ring-black/5"
              >
                {team.map((member: any) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => setSelectedProfessionalId(String(member.id))}
                    /* 🌟 Adicionamos 'text-foreground' para garantir que o texto fique claro no modo escuro por padrão */
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer mb-1 outline-none transition-all text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                  >
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted-foreground/10">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    {/* 🌟 Garantimos que o span também use a cor correta */}
                    <span className="flex-1 truncate text-sm font-medium text-inherit">
                      {member.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex h-11 items-center gap-3 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm">
              {profile?.avatarUrl ? (
                <img src={(profile as any).avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
              <span className="truncate max-w-[150px]">{(profile as any).name}</span>
            </div>
          )}
        </div>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
      <motion.div 
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard label="Dias Bloqueados" value={activeDates.length} icon={Calendar} />
        <StatCard label="Horários Bloqueados" value={activeSlots.length} icon={Clock} />
        <StatCard label="Total de Ausências" value={activeDates.length + activeSlots.length} icon={ShieldAlert} />
      </motion.div>

      {/* TABS DE NAVEGAÇÃO */}
      <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
        <button
          onClick={() => setActiveTab("dates")}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "dates" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Datas Inteiras
        </button>
        <button
          onClick={() => setActiveTab("slots")}
          className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${
            activeTab === "slots" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Horários Específicos
        </button>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      {!selectedProfessionalId ? (
        <div className="flex h-40 items-center justify-center text-sm font-medium text-muted-foreground">
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          A carregar...
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "dates" ? (
            <motion.div
              key="dates-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid gap-8 lg:grid-cols-[380px_1fr]"
            >
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
                <h3 className="text-lg font-bold mb-4">Bloquear Dia Inteiro</h3>
                <BlockedDatesForm professionalId={selectedProfessionalId} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Dias Bloqueados
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{activeDates.length}</span>
                </h3>
                <BlockedDatesList professionalId={selectedProfessionalId} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="slots-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid gap-8 lg:grid-cols-[380px_1fr]"
            >
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
                <h3 className="text-lg font-bold mb-4">Bloquear Horário</h3>
                <BlockedSlotForm professionalId={selectedProfessionalId} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  Horários Bloqueados
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{activeSlots.length}</span>
                </h3>
                <BlockedSlotList professionalId={selectedProfessionalId} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}