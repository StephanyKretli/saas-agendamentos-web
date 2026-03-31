"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/features/auth/hooks/use-register";
import { toast } from "react-hot-toast";
import { Scissors, User, Mail, Link as LinkIcon, Lock, Sparkles, Eye, EyeOff } from "lucide-react"; // 👈 1. Eye e EyeOff adicionados

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false); // 👈 2. Estado para o olhinho

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setFormData({ ...formData, username: slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await registerMutation.mutateAsync(formData);
      toast.success("Conta criada com sucesso! Faça login para começar.");
      router.push("/login"); 
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta. O email ou link já pode estar em uso.");
    }
  };

  const inputStyle = "w-full rounded-xl border border-border bg-card/50 px-10 py-3 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      
      {/* LADO ESQUERDO: Apresentação (Escondido no mobile) */}
      <div className="hidden md:flex flex-1 bg-primary/5 border-r border-border flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-xl">
            <Scissors className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            A sua agenda cheia,<br/>sem dores de cabeça.
          </h1>
          <p className="text-lg text-muted-foreground">
            Crie a sua conta agora e ganhe 14 dias de acesso Premium gratuito. Acabe com as faltas dos clientes cobrando sinais via PIX.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-600">
            <Sparkles className="h-4 w-4" /> Sem cartão de crédito no registo
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Formulário */}
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 animate-in fade-in duration-500">
        <div className="mx-auto w-full max-w-md space-y-8">
          
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Criar Conta</h2>
            <p className="text-sm text-muted-foreground">Preencha os dados abaixo para criar o seu salão.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1 relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Nome da Empresa (ex: Studio Beauty)" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={inputStyle} 
              />
            </div>

            <div className="space-y-1 relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="E-mail de acesso" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={inputStyle} 
              />
            </div>

            <div className="space-y-1 relative">
              <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Seu link (ex: studio-beauty)" 
                value={formData.username}
                onChange={handleUsernameChange}
                className={inputStyle} 
              />
              {formData.username && (
                <p className="text-xs text-primary mt-1.5 ml-1 font-medium">
                  Seu link será: app.com/book/<strong>{formData.username}</strong>
                </p>
              )}
            </div>

            {/* 👇 3. Campo da senha com o ícone extra à direita */}
            <div className="space-y-1 relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Crie uma senha forte" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={inputStyle} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={registerMutation.isPending}
              className="w-full h-12 rounded-xl font-bold text-base shadow-md transition-all hover:shadow-lg active:scale-95 mt-4"
            >
              {registerMutation.isPending ? "A criar o seu salão..." : "Começar 14 dias grátis"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Faça login aqui
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}