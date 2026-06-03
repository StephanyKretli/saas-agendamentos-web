"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
// 🌟 Usando caminho relativo (../) - O TypeScript nunca erra isto!
import { updateService } from "../services/services.api";
import { toast } from "react-hot-toast";

interface UpdateServicePayload {
  id: string;
  name?: string;
  duration?: number;
  priceCents?: number;
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    // 🌟 Usando a nossa função blindada!
    mutationFn: ({ id, ...data }: UpdateServicePayload) => updateService(id, data),
    onSuccess: () => {
      // Atualiza as listas no painel e na tela pública
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["public-booking-availability"] });
      toast.success("Serviço atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar o serviço.");
    }
  });
}