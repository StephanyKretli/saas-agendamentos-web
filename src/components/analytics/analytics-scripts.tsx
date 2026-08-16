"use client";

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

export function AnalyticsScripts() {
  const pathname = usePathname();

  const isBlocked = NO_TRACKING_ROUTES.some((route) => pathname?.startsWith(route));
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

      <GoogleAnalytics gaId="G-2G70NFE4Q5" />
    </>
  );
}
