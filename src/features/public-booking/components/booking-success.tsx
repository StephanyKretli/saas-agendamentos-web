"use client";

import { useState, useEffect } from "react";
import { Check, Copy, AlertCircle, QrCode } from "lucide-react";
import { motion, Variants } from "framer-motion";
import confetti from "canvas-confetti"; // 🌟 1. Importamos a biblioteca de confetes

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

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24,
      staggerChildren: 0.15 
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

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

  const isPendingPayment = paymentStatus === "PENDING" && pixPayload;

  // 🌟 2. O Disparo dos Confetes!
  useEffect(() => {
    // Só atira os confetes se NÃO estiver aguardando pagamento
    if (!isPendingPayment) {
      confetti({
        particleCount: 150, // Quantidade de papelinhos
        spread: 80, // O quão longe eles se espalham
        origin: { y: 0.6 }, // De onde eles saem (0.6 é um pouco abaixo do meio da tela)
        colors: ['#22c55e', '#16a34a', '#4ade80', '#ffffff'], // Tons de verde para combinar
        disableForReducedMotion: true // Respeita quem tem sensibilidade a animações no celular
      });
    }
  }, [isPendingPayment]);

  const handleCopyPix = () => {
    if (pixPayload) {
      navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 🌟 ESTADO 1: AGUARDANDO PAGAMENTO DO SINAL
  if (isPendingPayment) {
    const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`;

    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm"
      >
        <motion.div variants={itemVariants} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-xl font-bold text-white shadow-lg">
          <AlertCircle className="h-8 w-8" />
        </motion.div>

        <motion.div variants={itemVariants} className="mt-5 text-center">
          <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            Falta muito pouco!
          </h2>
          <p className="mt-2 text-sm text-amber-700/80 dark:text-amber-400/80 max-w-sm mx-auto">
            {clientName}, para garantir o seu horário de <strong>{serviceName}</strong> no dia {formatDate(date)} às {time}, faça o pagamento do sinal de reserva.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
            <p className="text-sm font-medium text-muted-foreground">Valor do Sinal</p>
            <p className="text-2xl font-black text-foreground">
              {formatPrice(depositCents!)}
            </p>
          </div>

          <div className="space-y-5">
            <div className="hidden md:flex flex-col items-center justify-center rounded-2xl bg-white p-4 py-6 border border-border shadow-sm transition-transform hover:scale-[1.02]">
              <img 
                src={qrCodeImageUrl} 
                alt="QR Code PIX" 
                className="h-44 w-44 rounded-md"
                draggable={false}
              />
              <p className="mt-3 text-xs font-medium text-zinc-500 text-center">
                Escaneie com a câmara do seu banco
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <QrCode className="h-4 w-4 text-amber-500" />
                <p><span className="hidden md:inline">Ou use o </span>PIX Copia e Cola</p>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixPayload}
                  className="w-full rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground outline-none font-mono"
                />
                <button
                  onClick={handleCopyPix}
                  className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors active:scale-95"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-4 text-center">
          <p className="text-xs sm:text-sm font-medium text-amber-700/80 dark:text-amber-500/80">
            Assim que o pagamento for reconhecido, o seu agendamento será confirmado automaticamente.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // 🌟 ESTADO 2: 100% CONFIRMADO (Sem sinal ou já pago)
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 shadow-sm"
    >
      <motion.div variants={itemVariants} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-lg">
        <Check className="h-8 w-8" />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-5 text-center">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
          Agendamento confirmado!
        </h2>
        <p className="mt-2 text-sm text-green-600/80 dark:text-green-400/80">
          {clientName}, o seu horário foi reservado com sucesso.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Serviço</p>
          <p className="mt-1 text-lg font-bold text-foreground">{serviceName}</p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Data</p>
            <p className="mt-1 text-base font-semibold text-foreground">{formatDate(date)}</p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Horário</p>
            <p className="mt-1 text-base font-semibold text-foreground">{time}</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-5 rounded-2xl border border-green-500/20 bg-green-500/5 px-4 py-4 text-center">
        <p className="text-sm font-medium text-green-700/80 dark:text-green-400/80">
          Receberá a confirmação por e-mail ou WhatsApp em breve.
        </p>
      </motion.div>
    </motion.div>
  );
}