import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { DashboardMetrics, TodayAppointment } from "../types/dashboard.types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response: any = await api.get("/dashboard/metrics", {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Extrai os dados reais da métrica (desempacota o Axios)
  return response?.data?.data || response?.data || response;
}

export async function getDashboardToday(): Promise<TodayAppointment[]> {
  const response: any = await api.get("/dashboard/today", {
    headers: getAuthHeaders(),
  });
  
  // 🌟 Extrai o array de agendamentos do dia
  return response?.data?.data || response?.data || response;
}