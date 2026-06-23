import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider"; 
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syncro | Agendamentos Online",
  description: "A sua plataforma inteligente de agendamentos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            forcedTheme="dark"  
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
        
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: { background: '#10B981' }, 
            },
            error: {
              style: { background: '#EF4444' }, 
            },
          }} 
        />

        {/* RD Station */}
        <Script 
          src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/07f7a314-b4bc-4663-a260-43741fc8a45d-loader.js"
          strategy="afterInteractive"
        />

        {/* 🎯 Base do Meta Pixel */}
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
      </body>

      <GoogleAnalytics gaId="G-2G70NFE4Q5" />
    </html>
  );
}