"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAccessToken } from "@/lib/auth-storage";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agenda", label: "Agenda" },
  { href: "/clients", label: "Clientes" },
  { href: "/services", label: "Serviços" },
  { href: "/business-hours", label: "Horários" },
  { href: "/blocked-slots", label: "Bloqueios" },
  { href: "/settings", label: "Configurações" },
];

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSettings();
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    removeAccessToken();
    router.push("/login");
  }

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-3">
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
            <p className="truncate text-sm font-semibold text-foreground">
              {data?.name ?? "SaaS Agendamentos"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              @{data?.username ?? "painel"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-muted/40 px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Navegação
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize seu dia, seus serviços e suas configurações.
          </p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
        {/* NOVO: Botão de Tema */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 text-slate-700" />
              <span>Modo Escuro</span>
            </>
          )}
        </button>

        {/* Botão de Sair (que já existia) */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          Sair do painel
        </button>
      </div>
    </aside>
  );
}