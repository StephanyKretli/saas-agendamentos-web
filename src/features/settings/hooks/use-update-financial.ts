import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
// Ajuste o import da sua instância do Axios/Fetch
import { api } from "@/lib/api"; 
import { extractErrorMessage } from "@/lib/error-utils";


interface UpdateFinancialData {
  absorbPixFee?: boolean;
  defaultCommissionRate?: number;
  commissionType?: "PERCENTAGE" | "FIXED";
}

export function useUpdateFinancial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFinancialData) => {
      // Bate exatamente na rota PATCH que acabamos de criar no NestJS
      const response = await api.patch("/settings/financial", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Regras financeiras atualizadas com sucesso!");
      // Atualiza os dados do perfil na tela instantaneamente
      queryClient.invalidateQueries({ queryKey: ["settings"] }); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao salvar as configurações. Tente novamente.");
      toast.error(errorMessage);
    },
  });
}