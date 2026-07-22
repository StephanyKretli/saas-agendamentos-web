"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeAccessToken } from "@/lib/auth-storage";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Calendar,
  Users,
  MoreHorizontal,
  Plus,
  Scissors,
  Clock,
  CalendarOff,
  UsersRound,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";

type NavItem = { href: string; label: string; icon: React.ElementType };

// Abas primarias (o polegar alcanca): as 4 telas mais usadas. As demais vao
// para a folha "Mais" — resolve os 9 itens que nao cabem numa barra inferior.
const PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/clients", label: "Clientes", icon: Users },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSettings();
  const { theme, setTheme } = useTheme();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const isOwner = data && (data.role === "ADMIN" || !data.ownerId);

  // Itens que vao para a folha "Mais", conforme o cargo.
  const moreItems: NavItem[] = React.useMemo(() => {
    const ownerExtra: NavItem[] = [
      { href: "/services", label: "Serviços", icon: Scissors },
      { href: "/business-hours", label: "Horários", icon: Clock },
      { href: "/blocked-slots", label: "Bloqueios", icon: CalendarOff },
      { href: "/team", label: "Equipe", icon: UsersRound },
      { href: "/settings", label: "Configurações", icon: Settings },
      { href: "/support", label: "Ajuda e feedback", icon: HelpCircle },
    ];
    const teamExtra: NavItem[] = [
      { href: "/blocked-slots", label: "Bloqueios", icon: CalendarOff },
      { href: "/settings", label: "Configurações", icon: Settings },
      { href: "/support", label: "Ajuda e feedback", icon: HelpCircle },
    ];
    return isOwner ? ownerExtra : teamExtra;
  }, [isOwner]);

  React.useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  function handleLogout() {
    removeAccessToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    else router.push("/login");
  }

  const isActive = (href: string) => pathname === href;
  const moreActive = moreItems.some((i) => pathname === i.href);

  function Tab({ item }: { item: NavItem }) {
    const active = isActive(item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        className="relative flex flex-1 flex-col items-center gap-1 py-2"
        aria-label={item.label}
      >
        {active && (
          <motion.span
            layoutId="mobileNavActive"
            className="absolute -top-px h-0.5 w-8 rounded-full bg-primary"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <Icon
          className={`h-6 w-6 transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
        />
        <span
          className={`text-[10px] font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <>
      {/* Barra inferior — só no mobile. O desktop continua com a sidebar. */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-between border-t border-border bg-background/95 px-2 pt-1 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <Tab item={PRIMARY[0]} />
        <Tab item={PRIMARY[1]} />

        {/* Botão central: ação mais repetida — novo agendamento. */}
        <div className="flex flex-1 justify-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push("/agenda?novo=1")}
            aria-label="Novo agendamento"
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background"
          >
            <Plus className="h-7 w-7" />
          </motion.button>
        </div>

        <Tab item={PRIMARY[2]} />

        <button
          onClick={() => setSheetOpen(true)}
          className="relative flex flex-1 flex-col items-center gap-1 py-2"
          aria-label="Mais opções"
        >
          {moreActive && (
            <span className="absolute -top-px h-0.5 w-8 rounded-full bg-primary" />
          )}
          <MoreHorizontal
            className={`h-6 w-6 transition-colors ${moreActive ? "text-foreground" : "text-muted-foreground"}`}
          />
          <span
            className={`text-[10px] font-medium transition-colors ${moreActive ? "text-foreground" : "text-muted-foreground"}`}
          >
            Mais
          </span>
        </button>
      </nav>

      {/* Folha "Mais" */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-border bg-card p-4 md:hidden"
              style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />

              <div className="overflow-hidden rounded-2xl border border-border">
                {moreItems.map((item, i) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${
                        i < moreItems.length - 1 ? "border-b border-border" : ""
                      } ${active ? "bg-muted" : "hover:bg-muted/60"}`}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-500" /> Claro
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" /> Escuro
                    </>
                  )}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Sair
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
