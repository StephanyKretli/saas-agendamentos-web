"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth-storage";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando painel...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col p-4 gap-4 md:flex-row md:p-4 lg:p-6 lg:gap-6">
      
      <div className="md:w-64 lg:w-72 md:shrink-0 md:sticky md:top-4 lg:top-6 md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-3rem)]">
        <DashboardSidebar />
      </div>

      <main className="flex-1 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6 md:p-8 overflow-hidden">
        {children}
      </main>

    </div>
  );
}