import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { UserSettings, UpdateSettingsPayload } from "../types/settings.types";

export async function getSettings(): Promise<UserSettings> {
  const response: any = await api.get("/settings", {
    headers: getAuthHeaders(),
  });
  
  // 🛡️ Desempacota o objeto não importa como o backend/Axios entregue
  return response?.data?.user ?? response?.data ?? response?.user ?? response;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
  const response: any = await api.patch("/settings", payload, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.user ?? response?.data ?? response?.user ?? response;
}

export async function uploadAvatar(file: File): Promise<UserSettings> {
  const formData = new FormData();
  formData.append("file", file);

  const response: any = await api.patch("/settings/avatar", formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  
  return response?.data?.user ?? response?.data ?? response?.user ?? response;
}
