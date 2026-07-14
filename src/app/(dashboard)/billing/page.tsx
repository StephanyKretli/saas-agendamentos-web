"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, ShieldCheck, Users, MessageCircle, Wallet, Store, BarChart3, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, Variants } from "framer-motion";
import { MagicButton } from "@/components/ui/magic-button";

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

const FEATURES = [
  { icon: ShieldCheck, label: "Escudo Anti-Faltas (sinal via PIX)" },
  { icon: Users, label: "Profissionais ilimitados" },
  { icon: MessageCircle, label: "Lembretes automáticos no WhatsApp" },
  { icon: Wallet, label: "Comissionamento automático" },
  { icon: Store, label: "Vitrine digital própria" },
  { icon: BarChart3, label: "Relatórios financeiros" },
];

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.post('/billing/subscribe');

      // 🚨 Descasca o duplo "data" (o do Axios e o da sua API)
      const payload = response?.data?.data || response?.data || response;

      const url = payload?.checkoutUrl ||
                  payload?.asaasLink ||
                  payload?.invoiceUrl ||
                  payload?.manageUrl;

      if (url) {
        window.location.href = url;
      } else {
        console.error("Objeto final extraído:", payload);
        throw new Error("A API gerou a assinatura, mas não conseguimos ler o link.");
      }

    } catch (error: any) {
      console.error("🚨 ERRO RAIZ:", error.message);

      const errorPayload = error.response?.data?.data || error.response?.data || error.response;

      const linkNoErro = errorPayload?.asaasLink ||
                         errorPayload?.checkoutUrl ||
                         errorPayload?.invoiceUrl ||
                         errorPayload?.manageUrl;

      if (linkNoErro) {
        toast.success("A redirecionar para o pagamento...");
        window.location.href = linkNoErro;
      } else {
        toast.error(errorPayload?.message || "Erro ao conectar com o serviço de pagamento.");
        setIsLoading(false);
      }
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
          Esperamos que tenha adorado o sistema! Ative a sua assinatura abaixo para reativar a agenda e continuar a faturar no automático.
        </p>
      </motion.div>

      {/* CARD ÚNICO, CENTRALIZADO */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <motion.div variants={cardVariants} whileHover={{ y: -5 }}>
          <Card className="rounded-3xl border border-primary/50 bg-card p-8 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-primary/20">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-amber-400 rounded-t-3xl" />

            <div className="mb-2 relative z-10">
              <h3 className="text-2xl font-black text-foreground">Plano Profissional</h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">
                O motor completo do Syncro: agenda, PIX antecipado e comissões, sem letra miúda.
              </p>
            </div>

            <p className="text-xs font-bold text-amber-600 mt-6 relative z-10">
              Um bolo por semana te custa R$ 600.
            </p>
            <div className="mb-6 flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-black text-primary">R$ 97</span>
              <span className="text-muted-foreground font-medium">/mês</span>
            </div>

            <motion.ul variants={listVariants} className="space-y-4 mb-8 flex-1 relative z-10">
              {FEATURES.map((feature, i) => (
                <motion.li variants={checkVariants} key={i} className="flex items-center gap-3 text-sm text-foreground/90 font-semibold">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  {feature.label}
                </motion.li>
              ))}
            </motion.ul>

            <div className="relative z-10 mt-auto w-full" onClick={() => !isLoading && handleSubscribe()}>
              {isLoading ? (
                <Button disabled className="w-full h-14 rounded-2xl font-bold text-base shadow-md">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> A redirecionar...
                </Button>
              ) : (
                <MagicButton className="w-full h-14">
                  Assinar agora
                </MagicButton>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
