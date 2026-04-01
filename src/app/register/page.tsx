"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRegister } from "@/features/auth/hooks/use-register";
import { toast } from "react-hot-toast";
import { Scissors, User, Mail, Link as LinkIcon, Lock, Sparkles, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "", 
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const slug = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setFormData({ ...formData, username: slug });
  };

  // Função para chamar o login do Google no backend
  const handleGoogleLogin = () => {
    // Redireciona o utilizador para a rota do NestJS que inicia o fluxo OAuth
    // Ajuste o caminho '/auth/google' conforme a configuração do seu backend
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("As senhas não coincidem. Verifique e tente novamente.");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await registerMutation.mutateAsync(dataToSend);
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

            <div className="space-y-1 relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirme a sua senha" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={inputStyle} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

          {/* 👇 NOVA SECÇÃO: Separador e Botão do Google 👇 */}
          <div className="mt-6 flex items-center justify-center space-x-2">
            <span className="h-px w-full bg-border"></span>
            <span className="text-xs font-medium text-muted-foreground uppercase">ou</span>
            <span className="h-px w-full bg-border"></span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {/* SVG Oficial da Logo do Google */}
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com o Google
          </button>
          {/* 👆 FIM DA NOVA SECÇÃO 👆 */}

          <p className="text-center text-sm text-muted-foreground mt-8">
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