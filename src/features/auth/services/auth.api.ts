import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post("/auth/login", payload);

  return response.data.data as LoginResponse;
}
