"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; 
import { getAuthHeaders } from "@/lib/auth-headers"; // 🌟 NOVO: Garante que você tem permissão
import { toast } from "sonner"; 
import { extractErrorMessage } from "@/lib/error-utils";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const response: any = await api.get("/team", {
        headers: getAuthHeaders(),
      });
      
      const payload = response?.data?.data ?? response?.data ?? response ?? [];
      return Array.isArray(payload) ? payload : [];
    },
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response: any = await api.post("/team", data, {
        headers: getAuthHeaders(),
      });
      // 🌟 Nossa extração blindada
      return response?.data?.data ?? response?.data ?? response;
    },
    onSuccess: () => {
      toast.success("Profissional adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao adicionar profissional.");
      toast.error(errorMessage);
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response: any = await api.patch(`/team/${id}`, data, {
        headers: getAuthHeaders(),
      });
      return response?.data?.data ?? response?.data ?? response;
    },
    onSuccess: () => {
      toast.success("Profissional atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao atualizar profissional.");
      toast.error(errorMessage);
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const response: any = await api.delete(`/team/${memberId}`, {
        headers: getAuthHeaders(),
      });
      return response?.data?.data ?? response?.data ?? response;
    },
    onSuccess: () => {
      toast.success("Profissional removido com sucesso!"); 
      queryClient.invalidateQueries({ queryKey: ['team'] }); 
    },
    onError: (error: unknown) => {
      const errorMessage = extractErrorMessage(error, "Erro ao remover profissional.");
      toast.error(errorMessage);
    },
  });
}