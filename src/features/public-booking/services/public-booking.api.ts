import { apiFetch } from "@/lib/api";
import type { PublicProfessionalProfile } from "../types/public-booking.types";

export async function getBookingProfile(
  username: string,
): Promise<PublicProfessionalProfile> {
  return apiFetch<PublicProfessionalProfile>(`/public/book/${username}`, {
    method: "GET",
    cache: "no-store",
  });
}