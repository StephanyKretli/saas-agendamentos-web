"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Suspense } from "react";

// 🌟 Importação do seu cliente da API (ajuste o caminho se necessário)
import { api } from "@/lib/api"; 

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // O token que virá no e-mail

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redireciona se não houver token (Segurança básica)
  useEffect(() => {
    if (!token) {
      toast.error("Link de recuperação inválido ou expirado.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token de segurança ausente.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // 🌟 Chamada REAL ao seu backend NestJS
      await api.post('/auth/reset-password', { 
        token, 
        password 
      });
      
      setIsSuccess(true);
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      toast.error("Erro ao redefinir senha. O link pode ter expirado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Orbs Estilizados */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-4 border border-primary/20 shadow-inner">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Nova Senha</h1>
          <p className="text-muted-foreground mt-2 font-medium">Crie uma senha forte e segura para a sua conta.</p>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="mx-auto h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Tudo pronto!</h2>
                  <p className="text-muted-foreground mt-2">A sua senha foi atualizada. Agora já pode aceder ao painel.</p>
                </div>
                <Button asChild className="w-full h-14 rounded-2xl font-bold text-base">
                  <Link href="/login">Ir para o Login <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="space-y-5"
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      required 
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 rounded-2xl pl-12 bg-background/50 border-border/50"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Confirmar Nova Senha</label>
                  <div className="relative">
                    <Input 
                      type="password"
                      required 
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-14 rounded-2xl pl-12 bg-background/50 border-border/50"
                      placeholder="••••••••"
                    />
                    <ShieldCheck className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl font-bold text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isLoading ? "A atualizar..." : "Redefinir Senha"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}