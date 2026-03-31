"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/features/auth/hooks/use-login";
import { saveAccessToken } from "@/lib/auth-storage";
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react"; // 👈 1. Importando os ícones

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const [email, setEmail] = React.useState("demo@demo.com");
  const [password, setPassword] = React.useState("123456");
  const [showPassword, setShowPassword] = React.useState(false); // 👈 2. Estado para controlar a visibilidade

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

  return (
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

          {/* 👇 3. Bloco da senha atualizado com o botão de visualizar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Senha</label>
              
              <button 
                type="button" 
                onClick={() => {
                  if (!email || !email.includes('@')) {
                    toast("Introduza um e-mail válido para recuperar a senha.");
                    return;
                  }
                  toast(`Instruções de recuperação enviadas para ${email}`);
                }}
                className="text-xs text-primary hover:underline transition-opacity active:opacity-70"
              >
                Esqueci minha senha
              </button>
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
                tabIndex={-1} // Impede que o tab foque neste botão antes do botão de submit
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
      </div>
    </main>
  );
}