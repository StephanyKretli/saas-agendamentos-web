import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { DashboardMetrics } from "../types/dashboard.types";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return api.get("/dashboard/metrics", {
    headers: getAuthHeaders(),
  });
}