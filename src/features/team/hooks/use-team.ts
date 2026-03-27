import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; 
import { toast } from "sonner";

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
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar profissional.");
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
      queryClient.invalidateQueries({ queryKey: ['team'] }); 
    },
  });
}