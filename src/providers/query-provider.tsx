"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * QueryClient unico da aplicacao.
 *
 * Exposto via `getQueryClient()` para que login e logout possam limpar o cache
 * na troca de sessao. Sem isso, dois profissionais de saloes diferentes usando
 * o mesmo celular (cenario comum quando dividem espaco) podiam ver dados em
 * cache da conta anterior — agenda, clientes, configuracoes financeiras.
 */
let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/** Limpa todo o cache — chamar sempre que a sessao mudar (login/logout). */
export function clearQueryCache() {
  browserQueryClient?.clear();
}

export function QueryProvider({ children }: Props) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
