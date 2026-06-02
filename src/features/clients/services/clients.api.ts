import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

export async function getClients(page: number = 1, search: string = "") {
  try {
    const response = await api.get(`/clients`, {
      params: { page, limit: 10, search },
      headers: getAuthHeaders(),
    });

    // 🚨 DEBUG CRÍTICO: Vamos ver no console o que o axios entrega
    console.log("DEBUG API - Resposta bruta:", response);

    // Se o seu interceptor do axios já retorna response.data, 
    // tentar acessar response.data.data pode quebrar.
    // Vamos garantir que devolvemos o objeto correto.
    const result = response.data?.data ?? response.data;
    
    console.log("DEBUG API - Objeto retornado:", result);
    return result;
  } catch (error) {
    console.error("DEBUG API - Erro na requisição:", error);
    throw error;
  }
}

export async function getClientHistory(clientId: string) {
  const response = await api.get(`/clients/${clientId}/history`, { headers: getAuthHeaders() });
  return response.data?.data ?? response.data;
}

export async function createClient(payload: any) {
  const response = await api.post("/clients", payload, { headers: getAuthHeaders() });
  return response.data;
}

export async function deleteClient(id: string) {
  const response = await api.delete(`/clients/${id}`, { headers: getAuthHeaders() });
  return response.data;
}
