"use client";

import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
        mutationCache: new MutationCache({
          onError: (error) => {
            toast.error(error.message || "Erro ao processar a ação.");
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}