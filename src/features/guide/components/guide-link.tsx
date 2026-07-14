"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

const GUIDE_SECTIONS = {
  vitrine: { anchor: "vitrine", label: "Como personalizar a vitrine" },
  horarios: { anchor: "horarios", label: "Como configurar horários" },
  equipe: { anchor: "equipe", label: "Como adicionar profissionais" },
  servicos: { anchor: "servicos", label: "Como cadastrar serviços" },
  whatsapp: { anchor: "whatsapp", label: "Como conectar o WhatsApp" },
  agendamento: { anchor: "agendamento", label: "Como agendar manualmente" },
  clientes: { anchor: "clientes", label: "Como cadastrar clientes" },
  bloqueios: { anchor: "bloqueios", label: "Como bloquear horários" },
  financeiro: { anchor: "financeiro", label: "Como ativar o Escudo Anti-Faltas" },
} as const;

export type GuideSection = keyof typeof GUIDE_SECTIONS;

interface GuideLinkProps {
  section: GuideSection;
  className?: string;
}

export function GuideLink({ section, className = "" }: GuideLinkProps) {
  const { anchor, label } = GUIDE_SECTIONS[section];

  return (
    <Link
      href={`/guia#${anchor}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-fit items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs font-semibold text-zinc-400 transition-colors hover:border-amber-500/30 hover:text-amber-500 ${className}`}
    >
      <BookOpen className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
