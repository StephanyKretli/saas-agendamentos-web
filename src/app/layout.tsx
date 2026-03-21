import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import { QueryProvider } from "@/providers/query-provider";

import "@/app/globals.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Agendamentos",
  description: "Plataforma de agendamento online para profissionais e pequenos negócios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <QueryProvider>
          {children}
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
      </body>
    </html>
  );
}