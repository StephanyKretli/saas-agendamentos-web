"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth-storage";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = React.useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-3xl border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">
          Carregando painel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-[1600px] p-4 md:p-6">
        <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-2xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                Menu
              </button>
            </div>

            <DashboardHeader />

            <main className="rounded-3xl border border-border bg-background p-4 shadow-sm md:p-6">
              {children}
            </main>
          </div>
        </div>
      </div>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <div className="h-full w-[88%] max-w-[320px] bg-background p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Menu</p>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="rounded-xl border border-border px-3 py-1.5 text-sm text-foreground"
              >
                Fechar
              </button>
            </div>

            <div
              onClick={() => setMobileSidebarOpen(false)}
              className="h-[calc(100%-48px)]"
            >
              <DashboardSidebar />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}