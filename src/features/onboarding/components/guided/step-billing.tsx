"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { maskCpfCnpj, maskCardNumber, maskPostalCode } from "../../lib/onboarding-utils";
import type { OnboardingBillingPayload } from "../../api/onboarding.api";

interface Props {
  saving: boolean;
  serverError: string | null;
  onContinue: (payload: OnboardingBillingPayload) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const inputStyle =
  "w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:border-primary/50 focus:ring-1 focus:ring-primary/20";

export function StepBilling({ saving, serverError, onContinue }: Props) {
  // Nome evita colidir com o `document` global do DOM dentro do componente.
  const [cpfCnpj, setCpfCnpj] = React.useState("");
  const [cardHolderName, setCardHolderName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = React.useState("");
  const [cardExpiryYear, setCardExpiryYear] = React.useState("");
  const [cardCcv, setCardCcv] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [addressNumber, setAddressNumber] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const documentDigits = cpfCnpj.replace(/\D/g, "");
  const cardNumberDigits = cardNumber.replace(/\D/g, "");

  const canContinue =
    (documentDigits.length === 11 || documentDigits.length === 14) &&
    cardHolderName.trim().length > 0 &&
    cardNumberDigits.length >= 13 &&
    cardExpiryMonth.length === 2 &&
    cardExpiryYear.length === 4 &&
    cardCcv.length >= 3 &&
    postalCode.replace(/\D/g, "").length === 8 &&
    addressNumber.trim().length > 0 &&
    phone.replace(/\D/g, "").length >= 10 &&
    !saving;

  function handleSubmit() {
    onContinue({
      document: documentDigits,
      cardHolderName: cardHolderName.trim(),
      cardNumber: cardNumberDigits,
      cardExpiryMonth,
      cardExpiryYear,
      cardCcv,
      postalCode: postalCode.replace(/\D/g, ""),
      addressNumber: addressNumber.trim(),
      phone: phone.replace(/\D/g, ""),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="space-y-6"
    >
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-zinc-100">Garanta sua vaga</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Seu teste grátis continua valendo. Só pedimos o cartão agora pra garantir sua
          assinatura quando os 14 dias acabarem — nada é cobrado hoje.
        </p>
      </header>

      <div className="space-y-2.5">
        <label className="relative block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">
            CPF ou CNPJ
          </span>
          <input
            autoFocus
            inputMode="numeric"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(maskCpfCnpj(e.target.value))}
            placeholder="000.000.000-00"
            className={inputStyle}
          />
        </label>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <CreditCard className="h-3.5 w-3.5" />
          Cartão de crédito
        </div>

        <input
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
          placeholder="Nome impresso no cartão"
          className={inputStyle}
        />

        <input
          inputMode="numeric"
          value={cardNumber}
          onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
          placeholder="Número do cartão"
          className={inputStyle}
        />

        <div className="grid grid-cols-3 gap-2.5">
          <select
            value={cardExpiryMonth}
            onChange={(e) => setCardExpiryMonth(e.target.value)}
            className={`${inputStyle} appearance-none`}
          >
            <option value="">Mês</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            inputMode="numeric"
            value={cardExpiryYear}
            onChange={(e) => setCardExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="Ano"
            className={inputStyle}
          />
          <input
            inputMode="numeric"
            value={cardCcv}
            onChange={(e) => setCardCcv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="CVV"
            className={inputStyle}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <input
          inputMode="numeric"
          value={postalCode}
          onChange={(e) => setPostalCode(maskPostalCode(e.target.value))}
          placeholder="CEP"
          className={inputStyle}
        />
        <input
          value={addressNumber}
          onChange={(e) => setAddressNumber(e.target.value)}
          placeholder="Número"
          className={inputStyle}
        />
      </div>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="WhatsApp (11) 99999-9999"
        className={inputStyle}
      />

      <p className="flex items-start gap-2 text-[11px] text-zinc-500">
        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Pagamento processado pelo Asaas. Seu cartão fica salvo com segurança e só é cobrado
        depois do fim do teste.
      </p>

      {serverError && <p className="text-xs text-amber-400">{serverError}</p>}

      <button
        type="button"
        disabled={!canContinue}
        onClick={handleSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Confirmar e ir para o painel
      </button>
    </motion.div>
  );
}
