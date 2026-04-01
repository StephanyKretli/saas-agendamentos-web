"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Sparkles, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast"; 
import { motion, Variants } from "framer-motion"; // 🌟 Adicionamos o Framer Motion
import { MagicButton } from "@/components/ui/magic-button"; // 🌟 Trazemos o botão brilhante

// Variáveis de animação para os cartões
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 }
  }
};

// Variáveis para as listas de vantagens
const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.5 }
  }
};

const checkVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
};

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (plan: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/billing/subscribe', { plan });
      
      toast.success("Redirecionando para o pagamento seguro...");
      
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao processar assinatura.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center max-w-5xl mx-auto pb-20 px-4 pt-12 overflow-hidden">
      
      {/* 🌟 Background Glow suave no topo */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER DO BLOQUEIO ANIMADO */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-4 mb-14 relative z-10"
      >
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
          className="h-20 w-20 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-full mb-2 shadow-inner border border-amber-500/20"
        >
          <Lock className="h-10 w-10" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          O seu período de testes <span className="text-amber-500">terminou.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mt-2 font-medium">
          Esperamos que tenha adorado o sistema! Escolha um plano abaixo para reativar a sua agenda e continuar a faturar no automático.
        </p>
      </motion.div>

      {/* CARDS DE PLANOS ANIMADOS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full relative z-10"
      >
        
        {/* PLANO STARTER */}
        <motion.div variants={cardVariants} whileHover={{ y: -5 }}>
          <Card className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-xl h-full">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Plano Starter</h3>
              <p className="text-sm text-muted-foreground mt-2">Perfeito para profissionais independentes ou salões pequenos.</p>
            </div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-4xl font-black">R$ 49</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
            
            <motion.ul variants={listVariants} className="space-y-4 mb-8 flex-1">
              {["Até 3 profissionais na equipe", "Agenda online 24/7", "Lembretes via WhatsApp", "Suporte por email"].map((feature, i) => (
                <motion.li variants={checkVariants} key={i} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            <Button 
              onClick={() => handleSubscribe('STARTER')} 
              disabled={isLoading}
              variant="outline" 
              className="w-full h-12 rounded-2xl font-bold text-base hover:bg-muted/50"
            >
              Assinar Starter
            </Button>
          </Card>
        </motion.div>

        {/* PLANO PRO (DESTAQUE COM MAGIC BUTTON) */}
        <motion.div variants={cardVariants} whileHover={{ y: -8 }}>
          <Card className="rounded-3xl border border-primary/50 bg-card p-8 shadow-2xl flex flex-col relative overflow-hidden h-full ring-1 ring-primary/20">
            {/* 🌟 Orbe brilhante dentro do card Premium */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary to-amber-400 rounded-t-3xl"></div>            <div className="absolute top-5 right-5 bg-primary text-primary-foreground text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles className="h-3.5 w-3.5" /> MAIS POPULAR
            </div>

            <div className="mb-6 pr-24 relative z-10">
              <h3 className="text-2xl font-black text-foreground">Plano Premium</h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">O motor completo para salões que querem escalar e evitar faltas.</p>
            </div>
            <div className="mb-6 flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-black text-primary">R$ 99</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>
            
            <motion.ul variants={listVariants} className="space-y-4 mb-8 flex-1 relative z-10">
              {["Profissionais ILIMITADOS", "Cobrança de PIX (Sinal antecipado)", "Lembretes via WhatsApp", "Relatórios financeiros detalhados", "Suporte prioritário"].map((feature, i) => (
                <motion.li variants={checkVariants} key={i} className="flex items-center gap-3 text-sm text-foreground/90 font-semibold">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            {/* 🌟 O Magic Button em ação! */}
            <div className="relative z-10 mt-auto w-full" onClick={() => !isLoading && handleSubscribe('PRO')}>
              {isLoading ? (
                <Button disabled className="w-full h-14 rounded-2xl font-bold text-base shadow-md">
                  A processar...
                </Button>
              ) : (
                <MagicButton className="w-full h-14" disabled={isLoading}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Assinar Premium
                </MagicButton>
              )}
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}