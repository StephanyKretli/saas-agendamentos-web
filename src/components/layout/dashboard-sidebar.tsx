"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAccessToken } from "@/lib/auth-storage";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agenda", label: "Agenda" },
  { href: "/clients", label: "Clientes" },
  { href: "/services", label: "Serviços" },
  { href: "/business-hours", label: "Horários" },
  { href: "/blocked-slots", label: "Bloqueios" },
  { href: "/settings", label: "Configurações" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    removeAccessToken();
    router.push("/login");
  }

  return (
    <aside className="w-full border-b border-border bg-card p-4 md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          SaaS Agendamentos
        </h2>
        <p className="text-sm text-muted-foreground">Painel do profissional</p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm transition",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 w-full rounded-xl border border-border px-3 py-2 text-sm text-foreground transition hover:bg-muted"
      >
        Sair
      </button>
    </aside>
  );
}