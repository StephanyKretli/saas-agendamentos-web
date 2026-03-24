import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; 
import { getAuthHeaders } from "@/lib/auth-headers"; // <-- Faltava isso!

interface UpdateServicePayload {
  id: string;
  name?: string;
  duration?: number;
  priceCents?: number;
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateServicePayload) => {
      // O Axios precisa que os dados (data) fiquem no segundo parâmetro, e os headers no terceiro.
      const response = await api.patch(`/services/${id}`, data, {
        headers: getAuthHeaders()
      }); 
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}