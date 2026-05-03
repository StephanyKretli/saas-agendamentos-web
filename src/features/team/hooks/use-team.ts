import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; 
import { toast } from "sonner"; // Sonner é excelente, ótima escolha!
import { extractErrorMessage } from "@/lib/error-utils";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response = await api.get("/team");
      
      // Procura a lista de usuários no envelopamento do Axios e do NestJS
      const payload = response?.data?.data || response?.data || response || [];
      
      // Se por acaso não for um array, retorna um array vazio para não quebrar o .map()
      return Array.isArray(payload) ? payload : [];
    },
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/team", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profissional adicionado com sucesso!");
      // Atualiza a lista na hora
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    // 🌟 AQUI! Usamos a função para puxar o motivo exato.
    // Troquei de 'any' para 'unknown' para o TypeScript ficar feliz
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao adicionar profissional.");
      toast.error(errorMessage);
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const response = await api.delete(`/team/${memberId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profissional removido com sucesso!"); // 🌟 Adicionado um feedback de sucesso aqui também!
      queryClient.invalidateQueries({ queryKey: ['team'] }); 
    },
    // 🌟 AQUI! Tratamento de erro adicionado para a remoção
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao remover profissional.");
      toast.error(errorMessage);
    },
  });
}