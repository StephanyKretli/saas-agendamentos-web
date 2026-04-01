"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/use-login";
import { saveAccessToken } from "@/lib/auth-storage";
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react"; 
import { GlowingBackground } from "@/components/ui/glowing-background";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = React.useState("demo@demo.com");
  const [password, setPassword] = React.useState("123456");
  const [showPassword, setShowPassword] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
      });

      const token = response.accessToken || (response as any).access_token;

      if (!token) {
        toast.error("Erro ao autenticar. Tente novamente.");
        return;
      }

      saveAccessToken(token);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Credenciais inválidas.");
      console.error("Falha na tentativa de login:", error);
    }
  }

  // 🌟 Função simples de redirecionamento para a nossa nova rota do NestJS
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3333/auth/google';
  };

  return (
    <GlowingBackground>
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Entrar</h1>
          <p className="text-sm text-muted-foreground">
            Acesse seu painel para gerenciar agendamentos, clientes e serviços.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
              placeholder="voce@email.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Senha</label>
              
              <div className="flex justify-end">
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueceu-se da senha?
                </Link>
              </div>
            </div>
  
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
                placeholder="********"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1} 
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </button>
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

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Crie uma agora
          </Link>
        </p>

      </div>
    </main>
    </GlowingBackground>
  );
}