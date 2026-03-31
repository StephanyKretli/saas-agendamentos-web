"use client";

import { useState } from "react";
import { Check, Copy, AlertCircle, QrCode } from "lucide-react";

type BookingSuccessProps = {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  paymentStatus?: string;
  depositCents?: number | null;
  pixPayload?: string | null;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function BookingSuccess({
  clientName,
  serviceName,
  date,
  time,
  paymentStatus,
  depositCents,
  pixPayload,
}: BookingSuccessProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPendingPayment = paymentStatus === "PENDING" && pixPayload;

  // 🌟 ESTADO 1: AGUARDANDO PAGAMENTO DO SINAL
  if (isPendingPayment) {
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`;

    return (
      <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm animate-in fade-in duration-500">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white shadow-sm">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-amber-600 dark:text-amber-500">
            Falta muito pouco!
          </h2>
          <p className="mt-2 text-sm text-amber-700/80 dark:text-amber-400/80 max-w-sm mx-auto">
            {clientName}, para garantir o seu horário de <strong>{serviceName}</strong> no dia {formatDate(date)} às {time}, faça o pagamento do sinal de reserva.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
            <p className="text-sm font-medium text-muted-foreground">Valor do Sinal</p>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(depositCents!)}
            </p>
          </div>

          <div className="space-y-5">
            {/* 👇 MÁGICA AQUI: Adicionamos "hidden md:flex" para sumir no celular */}
            <div className="hidden md:flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-6 border border-border shadow-sm">
              <img 
                src={qrCodeImageUrl} 
                alt="QR Code para pagamento via PIX" 
                className="h-44 w-44 rounded-md"
                draggable={false}
              />
              <p className="mt-3 text-xs font-medium text-zinc-500 text-center">
                Escaneie com a câmara ou app do seu banco
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <QrCode className="h-4 w-4" />
                {/* 👇 Ocultamos o "Ou use o" no celular para o texto fazer mais sentido */}
                <p><span className="hidden md:inline">Ou use o </span>PIX Copia e Cola</p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixPayload}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground outline-none"
                />
                <button
                  onClick={handleCopyPix}
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-amber-700/80 dark:text-amber-500/80">
            Assim que o pagamento for reconhecido, o seu agendamento será confirmado automaticamente e você receberá um WhatsApp!
          </p>
        </div>
      </div>
    );
  }

  // 🌟 ESTADO 2: 100% CONFIRMADO (Sem sinal ou já pago)
  return (
    <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 shadow-sm animate-in fade-in duration-500">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-sm">
        <Check className="h-7 w-7" />
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
          Agendamento confirmado!
        </h2>
        <p className="mt-2 text-sm text-green-600/80 dark:text-green-400/80">
          {clientName}, seu horário foi reservado com sucesso.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Serviço</p>
          <p className="mt-1 text-base font-semibold text-foreground">{serviceName}</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</p>
            <p className="mt-1 text-sm font-medium text-foreground">{formatDate(date)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Horário</p>
            <p className="mt-1 text-sm font-medium text-foreground">{time}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-muted/20 px-4 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Você receberá a confirmação por e-mail ou WhatsApp em breve.
        </p>
      </div>
    </div>
  );
}