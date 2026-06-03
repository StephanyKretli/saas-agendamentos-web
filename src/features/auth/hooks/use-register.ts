"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRegister() {
  return useMutation({
    mutationFn: async (data: any) => {
      // Faz a chamada POST para a rota de registo do seu NestJS
      const response = await api.post('/auth/register', data);
      
      // 🌟 Correção: Extraindo os dados da resposta bruta do Axios
      return response.data?.data || response.data;
    },
  });
}