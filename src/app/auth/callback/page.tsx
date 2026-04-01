"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // 🌟 1. Guardar o token exatamente como você faz no Login normal
      localStorage.setItem("token", token); // Ajuste se usar cookies (ex: js-cookie)
      
      // 🌟 2. Redirecionar para o painel principal
      router.push("/dashboard"); // Ajuste para a rota do seu painel
    } else {
      // Se algo correr mal, volta para o login
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold">A iniciar sessão...</h2>
      <p className="text-muted-foreground mt-2">Aguarde um momento.</p>
    </div>
  );
}