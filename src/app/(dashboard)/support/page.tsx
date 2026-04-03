"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  LifeBuoy, 
  MessageSquareHeart, 
  Mail, 
  MessageCircle, 
  Send, 
  Lightbulb, 
  Bug, 
  Star,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "SUGGESTION", // SUGGESTION, COMPLIMENT, BUG
    subject: "",
    message: ""
  });

  const inputStyle = "rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none w-full";

  // Não se esqueça de importar a API no topo do ficheiro:
  // import { api } from "@/lib/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 🚀 Chamamos a nova rota do nosso Back-end!
      await api.post('/support/feedback', formData);

      setFormData({ type: "SUGGESTION", subject: "", message: "" });
      
      // Mensagens de sucesso personalizadas
      if (formData.type === "COMPLIMENT") {
        toast.success("Elogio enviado! Muito obrigado pelo carinho! ❤️");
      } else if (formData.type === "BUG") {
        toast.success("Problema reportado. A nossa equipa já vai investigar! 🛠️");
      } else {
        toast.success("Sugestão enviada! Vamos analisar com carinho. 🚀");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao enviar. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    // Substitua pelo número real de suporte do seu SaaS
    window.open("https://wa.me/5531991826431?text=Olá! Preciso de ajuda com o meu painel.", "_blank");
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      {/* CABEÇALHO */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Headphones className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Ajuda & Feedback</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">Como podemos tornar o seu dia a dia ainda melhor?</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* COLUNA ESQUERDA: CANAIS DE SUPORTE DIRETO */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl border border-border bg-card p-6 shadow-sm overflow-hidden relative group transition-all hover:border-green-500/30 hover:shadow-md">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500/10 blur-2xl transition-all group-hover:bg-green-500/20" />
              <div className="relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-foreground">Suporte Rápido</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6 font-medium">Precisa de ajuda imediata? Fale com a nossa equipa diretamente pelo WhatsApp.</p>
                <Button onClick={handleWhatsApp} className="w-full rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold shadow-sm gap-2 h-11">
                  <MessageCircle className="h-4 w-4" /> Chamar no WhatsApp
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="rounded-3xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">E-mail de Suporte</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium mb-2">Para questões complexas ou financeiras.</p>
                  <a href="mailto:suporte@stephanykretli.com.br" className="text-sm font-bold text-primary hover:underline">suporte@stephanykretli.com.br</a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO DE FEEDBACK */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                <MessageSquareHeart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground">Deixe a sua opinião</h2>
                <p className="text-sm text-muted-foreground font-medium">Construímos este sistema para si. A sua voz é a nossa prioridade.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seleção do Tipo de Feedback */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">O que gostaria de partilhar?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.type === 'SUGGESTION' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'}`}>
                    <input type="radio" name="type" value="SUGGESTION" checked={formData.type === 'SUGGESTION'} onChange={() => setFormData({...formData, type: 'SUGGESTION'})} className="sr-only" />
                    <Lightbulb className={`h-6 w-6 mb-2 ${formData.type === 'SUGGESTION' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-bold ${formData.type === 'SUGGESTION' ? 'text-primary' : 'text-muted-foreground'}`}>Sugestão</span>
                  </label>
                  
                  <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.type === 'COMPLIMENT' ? 'border-amber-500 bg-amber-500/5' : 'border-border bg-background hover:border-amber-500/30'}`}>
                    <input type="radio" name="type" value="COMPLIMENT" checked={formData.type === 'COMPLIMENT'} onChange={() => setFormData({...formData, type: 'COMPLIMENT'})} className="sr-only" />
                    <Star className={`h-6 w-6 mb-2 ${formData.type === 'COMPLIMENT' ? 'text-amber-500' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-bold ${formData.type === 'COMPLIMENT' ? 'text-amber-500' : 'text-muted-foreground'}`}>Elogio</span>
                  </label>

                  <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${formData.type === 'BUG' ? 'border-destructive bg-destructive/5' : 'border-border bg-background hover:border-destructive/30'}`}>
                    <input type="radio" name="type" value="BUG" checked={formData.type === 'BUG'} onChange={() => setFormData({...formData, type: 'BUG'})} className="sr-only" />
                    <Bug className={`h-6 w-6 mb-2 ${formData.type === 'BUG' ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-bold ${formData.type === 'BUG' ? 'text-destructive' : 'text-muted-foreground'}`}>Problema</span>
                  </label>
                </div>
              </div>

              {/* Assunto */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assunto</label>
                <input 
                  value={formData.subject} 
                  onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                  className={inputStyle} 
                  placeholder={formData.type === 'BUG' ? "Ex: Erro ao cancelar horário" : "Ex: Adicionar opção de cor no calendário"} 
                />
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Mensagem</label>
                <textarea 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className={`${inputStyle} min-h-[120px] resize-none`} 
                  placeholder="Conte-nos todos os detalhes..." 
                />
              </div>

              {/* Botão Enviar */}
              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="h-12 w-full sm:w-auto rounded-2xl px-10 text-sm font-bold shadow-sm transition-all gap-2">
                  {isSubmitting ? "A enviar..." : "Enviar Feedback"}
                  {!isSubmitting && <Send className="h-4 w-4" />}
                </Button>
              </div>

            </form>
          </Card>
        </motion.div>
        
      </motion.div>
    </div>
  );
}