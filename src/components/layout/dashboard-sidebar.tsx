"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAccessToken } from "@/lib/auth-storage";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { Moon, Sun, Menu, X } from "lucide-react"; 
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion"; // 🌟 Importamos a magia

const baseItems = [
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

// 🌟 Variantes para animação em cascata (Stagger)
const navVariants = {
  open: {
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  },
  closed: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 }
  }
};

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } }
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: { y: { stiffness: 1000 } }
  }
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSettings(); 
  const { theme, setTheme } = useTheme();
  
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleLogout() {
    removeAccessToken();
    router.push("/login");
  }

  const menuItems = React.useMemo(() => {
    const items = [...baseItems];
    // 👇 Usamos a tipagem do seu settings.types que adicionamos antes
    if (data && (data.role === "ADMIN" || !data.ownerId)) {
        // Encontra o índice das Configurações
        const settingsIndex = items.findIndex(item => item.href === '/settings');
        if (settingsIndex !== -1) {
          items.splice(settingsIndex, 0, { href: "/team", label: "Equipe" });
        }
    }
    return items;
  }, [data]);

  return (
    <aside className="flex h-full flex-col rounded-3xl border border-border bg-card p-4 shadow-sm overflow-hidden">
      {/* 1. CABEÇALHO (FIXO) */}
      <div className="border-b border-border pb-4 shrink-0 relative z-20 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name ?? "Usuário"}
                className="h-12 w-12 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary shrink-0">
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

          <motion.button
            whileTap={{ scale: 0.9 }} // 🌟 Feedback de clique
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-muted md:hidden transition-colors relative z-30"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="mt-4 rounded-2xl bg-muted/40 px-3 py-3 transition-all">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Navegação
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize o seu dia e a sua equipe.
          </p>
        </div>
      </div>

      {/* 2. ÁREA DE LINKS (SCROLLÁVEL) */}
      {/* 👇 Usamos motion.div aqui para controlar a abertura mobile */}
      <div 
        className={`flex-1 overflow-y-auto pr-1 mt-4 scrollbar-thin scrollbar-thumb-border transition-all ${
          isOpen ? "block" : "hidden md:block"
        }`}
      >
        <nav className="space-y-1 relative">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }} // Mantemos o micro-movimento
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {/* 🌟 O FUNDO MÁGICO QUE DESLIZA */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarTab"
                      className="absolute inset-0 bg-primary rounded-2xl shadow-sm z-0"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  <span className="relative z-10">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* 3. RODAPÉ (FIXO NO FINAL) */}
      <div className={`mt-auto flex flex-col gap-2 border-t border-border pt-4 shrink-0 relative z-20 bg-card ${
          isOpen ? "flex" : "hidden md:flex"
      }`}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted hover:border-border/80"
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
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleLogout}
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10 hover:border-destructive/20"
        >
          Sair do painel
        </motion.button>
      </div>
    </aside>
  );
}