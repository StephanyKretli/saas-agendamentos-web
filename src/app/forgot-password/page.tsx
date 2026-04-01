"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await api.post('/auth/forgot-password', { email });
    
    setIsSubmitted(true);
  } catch (error) {
    toast.error("Ocorreu um erro ao tentar enviar o e-mail.");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* 🌟 ORBES DE FUNDO (Igual ao Login) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md p-8 relative z-10"
      >
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-6 shadow-inner border border-primary/20">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Recuperar Senha</h1>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Não se preocupe! Insira o e-mail associado à sua conta e enviaremos as instruções de recuperação.
          </p>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl">
          {isSubmitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">E-mail Enviado!</h2>
              <p className="text-sm font-medium text-muted-foreground">
                Enviámos um link mágico para <strong className="text-foreground">{email}</strong>. Siga os passos no e-mail para redefinir a sua senha.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  E-mail da Conta
                </label>
                <div className="relative">
                  <Input 
                    type="email" 
                    required 
                    placeholder="voce@salao.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 rounded-2xl pl-4 pr-4 bg-background/50 border-border/50 text-base shadow-inner focus-visible:ring-primary/50"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-95"
              >
                {isLoading ? "A enviar..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}