"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // 🌟 Importamos a magia
import { useBlockedDates } from "@/features/blocked-dates/hooks/use-blocked-dates";
import { useBlockedSlots } from "@/features/blocked-slots/hooks/use-blocked-slots";

import { BlockedDatesForm } from "@/features/blocked-dates/components/blocked-dates-form";
import { BlockedDatesList } from "@/features/blocked-dates/components/blocked-dates-list";

import { BlockedSlotForm } from "@/features/blocked-slots/components/blocked-slot-form";
import { BlockedSlotList } from "@/features/blocked-slots/components/blocked-slot-list";

import { Calendar, Clock, ShieldAlert } from "lucide-react";

// 🌟 Variáveis de animação para os cartões do topo
const statsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const statItemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div 
      variants={statItemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-colors hover:border-primary/30"
    >
      {/* Detalhe de luz suave no fundo do cartão */}
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <div className={`h-2 w-2 rounded-full ${value > 0 ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/30"}`} />
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground truncate" title={label}>
          {label}
        </p>
      </div>
      <p className="text-3xl sm:text-4xl font-black text-foreground relative z-10">{value}</p>
    </motion.div>
  );
}

export default function BlockedSlotsPage() {
  const [activeTab, setActiveTab] = useState<"dates" | "slots">("dates");

  const { data: blockedDates, isLoading: loadingDates } = useBlockedDates();
  const { data: blockedSlots, isLoading: loadingSlots } = useBlockedSlots();

  const activeDates = (blockedDates ?? []).filter((item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(item.date).getTime() >= today.getTime();
  });

  const activeSlots = (blockedSlots ?? []).filter((item) => {
    return new Date(item.end).getTime() >= new Date().getTime();
  });

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen pb-10">
      
      {/* HEADER ANIMADO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Bloqueios de Agenda</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Gerencie ausências e folgas. Eventos passados são arquivados automaticamente.
            </p>
          </div>
        </div>
      </motion.div>

      {/* STATS EM CASCATA */}
      <motion.div 
        variants={statsContainerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3"
      >
        <StatCard label="Dias Bloqueados" value={activeDates.length} />
        <StatCard label="Horários Bloqueados" value={activeSlots.length} />
        <div className="col-span-2 sm:col-span-1 xl:col-span-1">
          <StatCard label="Total Ativo" value={activeDates.length + activeSlots.length} />
        </div>
      </motion.div>

      {/* 🌟 TABS DE NAVEGAÇÃO DESLIZANTES */}
      <div className="flex w-full sm:w-fit rounded-2xl bg-muted/40 p-1.5 border border-border/50">
        {[
          { id: "dates", label: "Dias Inteiros", icon: Calendar },
          { id: "slots", label: "Horários Específicos", icon: Clock }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "dates" | "slots")}
              className={`relative flex flex-1 sm:flex-none sm:min-w-[180px] items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-bold transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="blockedTabsIndicator"
                  className="absolute inset-0 bg-background rounded-xl shadow-sm border border-border/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 🌟 ÁREA DE CONTEÚDO COM TRANSIÇÃO CROSSFADE */}
      <div className="relative">
        <AnimatePresence mode="wait">
          
          {/* CONTEÚDO DA ABA: DIAS */}
          {activeTab === "dates" && (
            <motion.div 
              key="dates"
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              className="grid items-start gap-6 lg:grid-cols-[350px_1fr]"
            >
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm sticky top-24">
                <BlockedDatesForm />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Dias cadastrados
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{activeDates.length}</span>
                </h3>
                
                {loadingDates ? (
                  <div className="h-24 animate-pulse rounded-3xl border border-border bg-muted/50" />
                ) : !activeDates.length ? (
                  <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center shadow-sm">
                    <Calendar className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Agenda livre!</p>
                    <p className="text-xs text-muted-foreground mt-1">Não possui dias futuros bloqueados.</p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm p-2">
                    <BlockedDatesList />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* CONTEÚDO DA ABA: HORÁRIOS */}
          {activeTab === "slots" && (
            <motion.div 
              key="slots"
              initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="grid items-start gap-6 lg:grid-cols-[350px_1fr]"
            >
              <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-sm sticky top-24">
                <BlockedSlotForm />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  Horários cadastrados
                  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{activeSlots.length}</span>
                </h3>
                
                {loadingSlots ? (
                  <div className="h-24 animate-pulse rounded-3xl border border-border bg-muted/50" />
                ) : !activeSlots.length ? (
                  <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center shadow-sm">
                    <Clock className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-foreground">Tudo a funcionar!</p>
                    <p className="text-xs text-muted-foreground mt-1">Não possui horários futuros bloqueados.</p>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm p-2">
                    <BlockedSlotList />
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}