"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers"; // 🌟 Adicionado para garantir autenticação
import { extractErrorMessage } from "@/lib/error-utils";

interface UpdateFinancialData {
  absorbPixFee?: boolean;
  defaultCommissionRate?: number;
  commissionType?: "PERCENTAGE" | "FIXED";
  requirePixDeposit?: boolean;
  pixDepositPercentage?: number;
  mercadoPagoAccessToken?: string;
}

export function useUpdateFinancial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFinancialData) => {
      // 🌟 Requisição blindada com Headers e extração correta de dados!
      const response: any = await api.patch("/settings/financial", data, {
        headers: getAuthHeaders(),
      });
      return response?.data?.data ?? response?.data ?? response;
    },
    onSuccess: () => {
      toast.success("Regras financeiras atualizadas com sucesso!");
      // Atualiza os dados do perfil na tela instantaneamente
      queryClient.invalidateQueries({ queryKey: ["settings"] }); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao salvar as configurações.");
      toast.error(errorMessage);
    },
  });
}