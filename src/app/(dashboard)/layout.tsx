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
    <div className="min-h-screen bg-muted/30 md:flex md:p-4 md:gap-4 lg:gap-6">
      
      <div className="md:w-64 lg:w-72 md:shrink-0">
        <DashboardSidebar />
      </div>

      <main className="flex-1 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {children}
      </main>

    </div>
  );
}