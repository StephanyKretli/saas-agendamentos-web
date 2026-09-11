"use client";

/**
 * Disparo da conversão de cadastro do Google Ads.
 *
 * O lance automático da conta aprende com este evento — sem ele a conta só
 * paga por clique e não otimiza nada. Por isso, se o rótulo da ação de
 * conversão ainda não existir no painel, isso precisa aparecer no console em
 * vez de falhar calado (a régua deste projeto: medição que falha, falha visível).
 */

const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_SIGNUP_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL;

let hasWarnedMissingSignupLabel = false;

/** Dispara a conversão de cadastro. Chamar uma única vez por cadastro concluído. */
export function trackGoogleAdsSignupConversion(): void {
  if (!GOOGLE_ADS_SIGNUP_LABEL) {
    if (!hasWarnedMissingSignupLabel) {
      hasWarnedMissingSignupLabel = true;
      console.warn(
        "[Google Ads] NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_LABEL ausente — conversão de cadastro NÃO disparada."
      );
    }
    return;
  }

  // Sem GOOGLE_ADS_ID a tag base nem carrega (ver analytics-scripts.tsx, que já
  // avisa isso sozinho) — aqui só falta o gtag no window, nada a mais a dizer.
  if (!GOOGLE_ADS_ID) return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("event", "conversion", {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_SIGNUP_LABEL}`,
  });
}
