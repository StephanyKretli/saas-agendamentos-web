"use client";

import * as React from "react";
import { ChevronLeft, User, Calendar as CalendarIcon, Clock, ShieldCheck, Scissors, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/app/book/[username]/page";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(priceCents / 100);
}

function formatFullDate(date?: Date) {
  if (!date) return "—";
  const s = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(date);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = {
  cart: CartItem[];
  professionalName?: string | null;
  selectedDate?: Date;
  selectedTime?: string | null;
  clientName?: string;
  clientPhone?: string;
  requirePixDeposit?: boolean;
  pixDepositPercentage?: number | null;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onEdit: (step: number) => void;
};

export function BookingReview({
  cart,
  professionalName,
  selectedDate,
  selectedTime,
  clientName,
  clientPhone,
  requirePixDeposit,
  pixDepositPercentage,
  isSubmitting,
  onConfirm,
  onEdit,
}: Props) {
  const totalDuration = cart.reduce((acc, i) => acc + i.finalDuration, 0);
  const totalPriceCents = cart.reduce((acc, i) => acc + i.finalPrice, 0);

  // O sinal e calculado sobre o TOTAL (mesma conta do backend) e so quando o
  // salao exige deposito. Se o backend ainda nao informar o percentual, mostramos
  // um aviso suave e o valor exato aparece na proxima tela (a do PIX).
  const hasDepositConfig = !!requirePixDeposit && !!pixDepositPercentage;
  const depositCents = hasDepositConfig ? Math.round(totalPriceCents * (pixDepositPercentage! / 100)) : 0;
  const remainderCents = totalPriceCents - depositCents;

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => onEdit(5)}
          aria-label="Voltar"
          className="p-2 hover:bg-muted rounded-full"
        >
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Revisar e confirmar</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Confira tudo antes de fechar o agendamento.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        {/* Serviços */}
        <div className="p-4 border-b border-border">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-3">Serviços</p>
          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <Scissors className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">
                      {item.service.name}
                      {item.isMaintenance && <span className="text-emerald-500 text-xs font-medium ml-1">(Manutenção)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.finalDuration} min</p>
                  </div>
                </div>
                <p className="text-sm text-foreground shrink-0">{formatPrice(item.finalPrice)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Profissional / Data / Horário / Contato */}
        <ReviewRow icon={User} label="Profissional" value={professionalName || "—"} onEdit={() => onEdit(2)} />
        <ReviewRow icon={CalendarIcon} label="Data" value={formatFullDate(selectedDate)} onEdit={() => onEdit(3)} />
        <ReviewRow
          icon={Clock}
          label="Horário"
          value={selectedTime ? `${selectedTime} · ${totalDuration} min de duração` : "—"}
          onEdit={() => onEdit(4)}
        />
        {(clientName || clientPhone) && (
          <ReviewRow
            icon={Phone}
            label="Seus dados"
            value={[clientName, clientPhone].filter(Boolean).join(" · ")}
            onEdit={() => onEdit(5)}
            last
          />
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between px-1 py-4">
        <span className="text-sm text-muted-foreground">Total dos serviços</span>
        <span className="text-base font-semibold text-foreground">{formatPrice(totalPriceCents)}</span>
      </div>

      {/* Bloco do sinal PIX */}
      {requirePixDeposit && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">Sinal para garantir o horário</span>
          </div>
          {hasDepositConfig ? (
            <>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-amber-700/80 dark:text-amber-400/80">
                  Você paga agora (PIX{pixDepositPercentage ? `, ${pixDepositPercentage}%` : ""})
                </span>
                <span className="text-xl font-bold text-foreground">{formatPrice(depositCents)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-amber-700/80 dark:text-amber-400/80">Restante no dia do atendimento</span>
                <span className="text-xs text-amber-700/80 dark:text-amber-400/80">{formatPrice(remainderCents)}</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
              Um sinal via PIX será solicitado para confirmar o horário. O valor aparece na próxima etapa.
            </p>
          )}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground text-center mt-3 mb-4 leading-relaxed">
        {requirePixDeposit
          ? "O sinal evita furos na agenda. Você recebe a confirmação no WhatsApp."
          : "Você recebe a confirmação do agendamento no WhatsApp."}
      </p>

      <Button className="w-full h-12 text-base font-bold" onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting
          ? "Confirmando..."
          : requirePixDeposit
            ? "Confirmar e pagar sinal"
            : "Confirmar agendamento"}
      </Button>
    </section>
  );
}

function ReviewRow({
  icon: Icon,
  label,
  value,
  onEdit,
  last,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onEdit: () => void;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 p-4 ${last ? "" : "border-b border-border"}`}>
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground mt-0.5 truncate">{value}</p>
      </div>
      <button onClick={onEdit} className="text-xs font-medium text-primary hover:underline shrink-0">
        Editar
      </button>
    </div>
  );
}
