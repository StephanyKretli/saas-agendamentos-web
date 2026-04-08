"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { saveAccessToken } from "@/lib/auth-storage";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("access_token");

  useEffect(() => {
    if (token) {
      // Usa a nossa função oficial (que salva no localStorage e nos Cookies)
      saveAccessToken(token); 
      router.push("/dashboard"); 
    } else {
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

export default function AuthCallbackPage() {
  return (
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