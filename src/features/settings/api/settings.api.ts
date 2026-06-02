import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import type { UserSettings, UpdateSettingsPayload } from "../types/settings.types";

export async function getSettings(): Promise<UserSettings> {
  const response: any = await api.get("/settings", {
    headers: getAuthHeaders(),
  });
  
  // 🛡️ O segredo: desempacota o .data do Axios E o .data do seu backend
  return response?.data?.data ?? response?.data ?? response;
}

export async function updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
  const response: any = await api.patch("/settings", payload, {
    headers: getAuthHeaders(),
  });
  
  return response?.data?.data ?? response?.data ?? response;
}

export async function uploadAvatar(file: File): Promise<UserSettings> {
  const formData = new FormData();
  formData.append("file", file);

  const response: any = await api.patch("/settings/avatar", formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  
  return response?.data?.data ?? response?.data ?? response;
}
