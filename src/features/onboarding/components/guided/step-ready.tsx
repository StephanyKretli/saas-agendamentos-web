"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, PartyPopper } from "lucide-react";
import { toast } from "react-hot-toast";
import { bookingUrl, bookingUrlLabel } from "../../lib/onboarding-utils";

interface Props {
  username: string;
  onGoToDashboard: () => void;
}

export function StepReady({ username, onGoToDashboard }: Props) {
  const [copied, setCopied] = React.useState(false);
  const url = bookingUrl(username);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        toast.success("Link copiado!");
        setTimeout(() => setCopied(false), 2000);
      },
      () => toast.error("Não consegui copiar — segure no link para copiar manualmente."),
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="space-y-6 text-center"
    >
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <PartyPopper className="h-8 w-8" />
      </span>

      <header className="space-y-2">
        <h1 className="text-2xl font-black text-zinc-100">Seu link está pronto</h1>
        <p className="text-sm text-zinc-400">Já dá para receber agendamentos agora.</p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-5">
        <p className="text-lg font-black text-primary break-all sm:text-xl">
          {bookingUrlLabel(username)}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar link"}
        </button>
        <a
          href={`/book/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3.5 text-sm font-bold text-zinc-200 transition-colors hover:bg-zinc-800"
        >
          <ExternalLink className="h-4 w-4" />
          Ver como sua cliente vê
        </a>
      </div>

      <p className="text-sm text-zinc-400">Cole esse link na bio do seu Instagram.</p>

      <button
        type="button"
        onClick={onGoToDashboard}
        className="text-sm font-bold text-zinc-400 transition-colors hover:text-zinc-200"
      >
        Ir para meu painel
      </button>
    </motion.div>
  );
}
