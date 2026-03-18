"use client";

import { usePathname } from "next/navigation";
import { useSettingsQuery } from "@/features/settings/hooks/use-settings";

const pageMeta: Record<
  string,
  { title: string; description: string }
> = {
  "/dashboard": {
    title: "Dashboard",
    description: "Acompanhe os principais números e a visão geral do seu mês.",
  },
  "/agenda": {
    title: "Agenda",
    description: "Visualize horários, reagende atendimentos e acompanhe seu dia.",
  },
  "/clients": {
    title: "Clientes",
    description: "Gerencie sua base de clientes e mantenha tudo organizado.",
  },
  "/services": {
    title: "Serviços",
    description: "Cadastre, edite e organize os serviços que você oferece.",
  },
  "/business-hours": {
    title: "Horários",
    description: "Defina seus horários de funcionamento e disponibilidade.",
  },
  "/blocked-slots": {
    title: "Bloqueios",
    description: "Controle indisponibilidades e horários que não podem ser agendados.",
  },
  "/settings": {
    title: "Configurações",
    description: "Ajuste seu perfil, preferências e regras do sistema.",
  },
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export function DashboardHeader() {
  const pathname = usePathname();
  const { data } = useSettingsQuery();

  const meta = pageMeta[pathname] ?? {
    title: "Painel",
    description: "Gerencie sua agenda, clientes e serviços.",
  };

  return (
    <header className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Painel do profissional
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {meta.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.description}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          {data?.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.name ?? "Usuário"}
              className="h-12 w-12 rounded-full border border-border object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {getInitial(data?.name)}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {data?.name ?? "Profissional"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              @{data?.username ?? "usuario"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}