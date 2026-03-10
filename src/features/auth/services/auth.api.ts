import { apiFetch } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}