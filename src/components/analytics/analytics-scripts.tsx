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

      {/* Base do Meta Pixel */}
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
              fbq('init', '1092047139463333');
              fbq('track', 'PageView');
            `,
        }}
      />

      <GoogleAnalytics gaId="G-2G70NFE4Q5" />
    </>
  );
}
