"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Lock, Sparkles, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast"; 

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  // Esta função vai chamar o seu backend para gerar o link do Asaas
  const handleSubscribe = async (plan: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/billing/subscribe', { plan });
      
      toast.success("Redirecionando para o pagamento seguro...");
      
      // Envia a Dona do Salão para a tela de pagamento do Asaas
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao processar assinatura.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4 pt-8">
      
      {/* HEADER DO BLOQUEIO */}
      <div className="flex flex-col items-center text-center gap-4 mb-12">
        <div className="h-16 w-16 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-full mb-2">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          O seu período de testes terminou.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Esperamos que tenha adorado o sistema! Escolha um plano abaixo para reativar a sua agenda e continuar a faturar.
        </p>
      </div>

      {/* CARDS DE PLANOS */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* PLANO STARTER */}
        <Card className="rounded-3xl border border-border bg-card p-8 shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Plano Starter</h3>
            <p className="text-sm text-muted-foreground mt-2">Perfeito para profissionais independentes ou salões pequenos.</p>
          </div>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-4xl font-black">R$ 49</span>
            <span className="text-muted-foreground font-medium">/mês</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Até 3 profissionais na equipe", "Agenda online 24/7", "Lembretes via WhatsApp", "Suporte por email"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground/80 font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            onClick={() => handleSubscribe('STARTER')} 
            disabled={isLoading}
            variant="outline" 
            className="w-full h-12 rounded-2xl font-bold text-base"
          >
            Assinar Starter
          </Button>
        </Card>

        {/* PLANO PRO (DESTAQUE) */}
        <Card className="rounded-3xl border-2 border-primary bg-primary/5 p-8 shadow-md flex flex-col relative overflow-hidden transition-all hover:shadow-lg">
        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary to-amber-400"></div>          <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> MAIS POPULAR
          </div>

          <div className="mb-6 pr-12">
            <h3 className="text-xl font-bold text-foreground">Plano Premium</h3>
            <p className="text-sm text-muted-foreground mt-2">O motor completo para salões que querem escalar e evitar faltas.</p>
          </div>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-4xl font-black">R$ 99</span>
            <span className="text-muted-foreground font-medium">/mês</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Profissionais ILIMITADOS", "Cobrança de PIX (Sinal antecipado)", "Lembretes via WhatsApp", "Relatórios financeiros detalhados", "Suporte prioritário"].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-foreground/90 font-medium">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            onClick={() => handleSubscribe('PRO')} 
            disabled={isLoading}
            className="w-full h-12 rounded-2xl font-bold text-base shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {isLoading ? "A carregar..." : "Assinar Premium"}
          </Button>
        </Card>

      </div>
    </div>
  );
}