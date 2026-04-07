"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

// 1. Criamos um componente filho que guarda toda a sua lógica que lê a URL
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      // 🌟 1. Guardar o token exatamente como você faz no Login normal
      localStorage.setItem("token", token); 
      
      // 🌟 2. Redirecionar para o painel principal
      router.push("/dashboard"); 
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

// 2. A página oficial agora apenas "envelopa" o filho com o Suspense
export default function AuthCallbackPage() {
  return (
    // O fallback é o que o Next.js mostra enquanto processa a URL
    <Suspense 
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">A carregar...</h2>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}