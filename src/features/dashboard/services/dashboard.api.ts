import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { DashboardMetrics, TodayAppointment } from "../types/dashboard.types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return api.get("/dashboard/metrics", {
    headers: getAuthHeaders(),
  }) as Promise<DashboardMetrics>;
}

export async function getDashboardToday(): Promise<TodayAppointment[]> {
  return api.get("/dashboard/today", {
    headers: getAuthHeaders(),
  }) as Promise<TodayAppointment[]>;
}