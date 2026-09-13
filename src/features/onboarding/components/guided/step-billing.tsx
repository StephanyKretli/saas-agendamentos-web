"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { maskCpfCnpj, maskCardNumber, maskPostalCode, formatTrialEndDate } from "../../lib/onboarding-utils";
import {
  validateBillingForm,
  firstInvalidField,
  normalizeExpiryYear,
  onlyDigits,
  type BillingFormValues,
  type BillingFormErrors,
} from "../../lib/billing-validation";
import type { OnboardingBillingPayload } from "../../api/onboarding.api";

interface Props {
  saving: boolean;
  serverError: string | null;
  /** ISO — mesmo `trialEndsAt` que o backend manda pro Asaas como nextDueDate. */
  trialEndsAt: string | null;
  onContinue: (payload: OnboardingBillingPayload) => void;
}

type FocusableField = HTMLInputElement | HTMLSelectElement;

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const inputStyle =
  "w-full rounded-xl border bg-zinc-900/60 px-4 py-3.5 text-sm text-zinc-100 outline-none transition-colors focus:ring-1";
const inputBorder = (hasError: boolean) =>
  hasError
    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
    : "border-zinc-800 focus:border-primary/50 focus:ring-primary/20";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-400">{message}</p>;
}

export function StepBilling({ saving, serverError, trialEndsAt, onContinue }: Props) {
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
  const [errors, setErrors] = React.useState<BillingFormErrors>({});

  const fieldRefs = React.useRef<Partial<Record<keyof BillingFormValues, FocusableField | null>>>({});

  // Corrigir um campo apaga só o erro dele — não precisa reenviar o form
  // inteiro pra ver o feedback sumir.
  function clearFieldError(field: keyof BillingFormValues) {
    setErrors((prev) => {
      if (prev[field] === undefined) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit() {
    const values: BillingFormValues = {
      document: cpfCnpj,
      cardHolderName,
      cardNumber,
      cardExpiryMonth,
      cardExpiryYear,
      cardCcv,
      postalCode,
      addressNumber,
      phone,
    };

    const validationErrors = validateBillingForm(values);
    setErrors(validationErrors);

    const first = firstInvalidField(validationErrors);
    if (first) {
      fieldRefs.current[first]?.focus();
      return;
    }

    onContinue({
      document: onlyDigits(cpfCnpj),
      cardHolderName: cardHolderName.trim(),
      cardNumber: onlyDigits(cardNumber),
      cardExpiryMonth,
      // Normaliza aqui, na hora de montar o payload — nunca no onChange do
      // campo (ver normalizeExpiryYear). "30" digitado vira "2030" só agora.
      cardExpiryYear: normalizeExpiryYear(cardExpiryYear),
      cardCcv,
      postalCode: onlyDigits(postalCode),
      addressNumber: addressNumber.trim(),
      phone: onlyDigits(phone),
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
        {trialEndsAt ? (
          <p className="text-sm text-zinc-400 leading-relaxed">
            Você não será cobrado hoje. A primeira cobrança de R$ 97 é em{" "}
            <span className="font-bold text-zinc-200">{formatTrialEndDate(trialEndsAt)}</span>,
            quando terminam seus 14 dias. Cancele antes disso e não paga nada.
          </p>
        ) : (
          <p className="text-sm text-zinc-500">Carregando…</p>
        )}
      </header>

      <div className="space-y-2.5">
        <label className="relative block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">
            CPF ou CNPJ
          </span>
          <input
            ref={(el) => {
              fieldRefs.current.document = el;
            }}
            autoFocus
            inputMode="numeric"
            value={cpfCnpj}
            onChange={(e) => {
              setCpfCnpj(maskCpfCnpj(e.target.value));
              clearFieldError("document");
            }}
            placeholder="000.000.000-00"
            className={`${inputStyle} ${inputBorder(!!errors.document)}`}
          />
          <FieldError message={errors.document} />
        </label>
      </div>

      <div className="space-y-2.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <CreditCard className="h-3.5 w-3.5" />
          Cartão de crédito
        </div>

        <div>
          <input
            ref={(el) => {
              fieldRefs.current.cardHolderName = el;
            }}
            value={cardHolderName}
            onChange={(e) => {
              setCardHolderName(e.target.value.toUpperCase());
              clearFieldError("cardHolderName");
            }}
            placeholder="Nome impresso no cartão"
            className={`${inputStyle} ${inputBorder(!!errors.cardHolderName)}`}
          />
          <FieldError message={errors.cardHolderName} />
        </div>

        <div>
          <input
            ref={(el) => {
              fieldRefs.current.cardNumber = el;
            }}
            inputMode="numeric"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(maskCardNumber(e.target.value));
              clearFieldError("cardNumber");
            }}
            placeholder="Número do cartão"
            className={`${inputStyle} ${inputBorder(!!errors.cardNumber)}`}
          />
          <FieldError message={errors.cardNumber} />
        </div>

        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
          Validade (MM/AA) e CVV
        </span>
        <div className="grid grid-cols-3 gap-2.5">
          <div>
            <select
              ref={(el) => {
                fieldRefs.current.cardExpiryMonth = el;
              }}
              value={cardExpiryMonth}
              onChange={(e) => {
                setCardExpiryMonth(e.target.value);
                clearFieldError("cardExpiryMonth");
              }}
              className={`${inputStyle} ${inputBorder(!!errors.cardExpiryMonth)} appearance-none`}
            >
              <option value="">Mês</option>
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <FieldError message={errors.cardExpiryMonth} />
          </div>
          <div>
            <input
              ref={(el) => {
                fieldRefs.current.cardExpiryYear = el;
              }}
              inputMode="numeric"
              value={cardExpiryYear}
              onChange={(e) => {
                setCardExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 4));
                clearFieldError("cardExpiryYear");
              }}
              placeholder="AA"
              className={`${inputStyle} ${inputBorder(!!errors.cardExpiryYear)}`}
            />
            <FieldError message={errors.cardExpiryYear} />
          </div>
          <div>
            <input
              ref={(el) => {
                fieldRefs.current.cardCcv = el;
              }}
              inputMode="numeric"
              value={cardCcv}
              onChange={(e) => {
                setCardCcv(e.target.value.replace(/\D/g, "").slice(0, 4));
                clearFieldError("cardCcv");
              }}
              placeholder="CVV"
              className={`${inputStyle} ${inputBorder(!!errors.cardCcv)}`}
            />
            <FieldError message={errors.cardCcv} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <input
            ref={(el) => {
              fieldRefs.current.postalCode = el;
            }}
            inputMode="numeric"
            value={postalCode}
            onChange={(e) => {
              setPostalCode(maskPostalCode(e.target.value));
              clearFieldError("postalCode");
            }}
            placeholder="CEP"
            className={`${inputStyle} ${inputBorder(!!errors.postalCode)}`}
          />
          <FieldError message={errors.postalCode} />
        </div>
        <div>
          <input
            ref={(el) => {
              fieldRefs.current.addressNumber = el;
            }}
            value={addressNumber}
            onChange={(e) => {
              setAddressNumber(e.target.value);
              clearFieldError("addressNumber");
            }}
            placeholder="Número"
            className={`${inputStyle} ${inputBorder(!!errors.addressNumber)}`}
          />
          <FieldError message={errors.addressNumber} />
        </div>
      </div>

      <div>
        <input
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearFieldError("phone");
          }}
          placeholder="WhatsApp (11) 99999-9999"
          className={`${inputStyle} ${inputBorder(!!errors.phone)}`}
        />
        <FieldError message={errors.phone} />
      </div>

      <p className="flex items-start gap-2 text-[11px] text-zinc-500">
        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        Pagamento processado pelo Asaas. Seu cartão fica salvo com segurança e só é cobrado
        depois do fim do teste.
      </p>

      {serverError && <p className="text-xs text-amber-400">{serverError}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={handleSubmit}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Confirmar e ir para o painel
      </button>
    </motion.div>
  );
}
