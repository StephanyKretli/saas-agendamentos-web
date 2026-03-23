import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return api.post("/auth/login", payload) as Promise<LoginResponse>;
}