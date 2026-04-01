"use client";

import { motion } from "framer-motion";
import { Calendar, Wallet, Users, Bell } from "lucide-react";
import { MagicButton } from "@/components/ui/magic-button"; 
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20">
      
      {/* CABEÇALHO DA LANDING PAGE */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            O Futuro da Gestão
          </span>
          <h1 className="mt-6 text-5xl md:text-6xl font-black text-foreground tracking-tight">
            Tudo que o seu salão precisa num <span className="text-primary">único lugar.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Esqueça o papel e caneta. Atraia mais clientes, cobre sinais via PIX e faça a gestão da sua equipe de forma automática.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <MagicButton>Criar Conta Grátis</MagicButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 🌟 O BENTO GRID */}
      <section className="max-w-5xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          
          {/* Bento Item 1: Ocupa 2 colunas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="md:col-span-2 rounded-3xl bg-white dark:bg-zinc-900 border border-border p-8 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Agenda Online 24h</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Os seus clientes marcam horários sozinhos a qualquer hora do dia através do seu link exclusivo.
              </p>
            </div>
            {/* Um detalhe visual decorativo */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-transform group-hover:scale-110" />
          </motion.div>

          {/* Bento Item 2: Ocupa 1 coluna */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600 mb-4">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-500">Proteção via PIX</h3>
              <p className="text-amber-700/80 dark:text-amber-400/80 mt-2 text-sm">
                Cobre um sinal automático via Mercado Pago e acabe com as faltas.
              </p>
            </div>
          </motion.div>

          {/* Bento Item 3: Ocupa 1 coluna */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="rounded-3xl bg-blue-500/10 border border-blue-500/20 p-8 flex flex-col justify-between"
          >
            <div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-500">Avisos no WhatsApp</h3>
              <p className="text-blue-700/80 dark:text-blue-400/80 mt-2 text-sm">
                Lembretes automáticos para si e para o seu cliente.
              </p>
            </div>
          </motion.div>

          {/* Bento Item 4: Ocupa 2 colunas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="md:col-span-2 rounded-3xl bg-zinc-950 border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Gestão da equipe</h3>
              <p className="text-zinc-400 mt-2 max-w-sm">
                Controle os serviços, horários e comissões de cada profissional da sua barbearia ou salão.
              </p>
            </div>
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 opacity-20">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="99.5" stroke="white" strokeDasharray="4 4"/>
                <circle cx="100" cy="100" r="79.5" stroke="white" strokeDasharray="4 4"/>
                <circle cx="100" cy="100" r="59.5" stroke="white" strokeDasharray="4 4"/>
              </svg>
            </div>
          </motion.div>

        </div>
      </section>

    </main>
  );
}