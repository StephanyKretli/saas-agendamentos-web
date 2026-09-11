"use client";

import { useEffect } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

/**
 * Rotas onde NENHUM script de rastreamento pode carregar.
 *
 * Motivo: o token de sessao do login social chega em /auth/callback pela query
 * string (?token=...). RD Station, Meta Pixel e Google Analytics capturam a URL
 * completa (com query string) no pageview — ou seja, o token ia parar, em texto
 * puro, nos paineis de tres terceiros a cada login com Google.
 */
const NO_TRACKING_ROUTES = ["/auth/callback"];

/**
 * Mesmo ID usado pelo pixel do navegador e pela API de Conversoes (/api/meta-capi).
 * Se as duas pernas apontarem para datasets diferentes, a deduplicacao por event_id
 * nao acontece e o Gerenciador de Eventos mostra metade dos cadastros.
 */
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * ID da conta do Google Ads. Sem valor de reserva embutido — de propósito:
 * o Google Ads faz lance automático a partir do evento de conversão, e um ID
 * fixo escondido faria a tag "funcionar" apontando pro lugar errado sem que
 * ninguém notasse a variável ausente.
 */
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

let hasWarnedMissingGoogleAdsId = false;

export function AnalyticsScripts() {
  const pathname = usePathname();

  const isBlocked = NO_TRACKING_ROUTES.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (isBlocked) return;
    if (!GOOGLE_ADS_ID && !hasWarnedMissingGoogleAdsId) {
      hasWarnedMissingGoogleAdsId = true;
      console.warn(
        "[Google Ads] NEXT_PUBLIC_GOOGLE_ADS_ID ausente — a medição de conversão do Google Ads está DESLIGADA."
      );
    }
  }, [isBlocked]);

  if (isBlocked) return null;

  return (
    <>
      {/* RD Station */}
      <Script
        src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/07f7a314-b4bc-4663-a260-43741fc8a45d-loader.js"
        strategy="afterInteractive"
      />

      {/* Base do Meta Pixel.
          O ID vem da variavel de ambiente, sem valor fixo de reserva: um fallback
          embutido esconde a variavel ausente e o pixel do navegador segue disparando
          enquanto a API de Conversoes falha calada — foi o que aconteceu ate 14/08/2026,
          quando os eventos server-side pararam de ser enviados sem ninguem perceber. */}
      {META_PIXEL_ID && (
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
        }}
      />
      )}

      {/* Tag do Google Ads (gtag.js). Necessária pro lance automático da conta
          aprender com a conversão de cadastro — sem ela a conta só paga por
          clique e não otimiza nada. */}
      {GOOGLE_ADS_ID && (
        <>
          <Script
            id="google-ads-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-ads-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `,
            }}
          />
        </>
      )}

      <GoogleAnalytics gaId="G-2G70NFE4Q5" />
    </>
  );
}
