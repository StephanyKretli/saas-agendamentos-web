import { api } from "@/lib/api";
import type {
  CreatePublicAppointmentPayload,
  CreatePublicAppointmentResponse,
  PublicAvailabilityResponse,
  PublicBookingProfileResponse,
} from "../types/public-booking.types";

export async function getBookingProfile(
  username: string,
): Promise<PublicBookingProfileResponse> {
  const response: any = await api.get(`/public/book/${username}`, {
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
  
  // 🌟 Garante que o perfil do salão e os serviços carregam
  return response?.data?.data || response?.data || response;
}

export async function getBookingAvailability(params: {
  username: string;
  serviceId?: string; // 🌟 Agora é opcional
  cartItems?: { serviceId: string; isMaintenance: boolean }[]; // 🌟 O Carrinho entra aqui!
  date: string;
  professionalId: string; 
  isMaintenance?: boolean;
}): Promise<PublicAvailabilityResponse> {
  const searchParams = new URLSearchParams({
    date: params.date,
    professionalId: params.professionalId, 
  });

  // Mantém a compatibilidade com a versão antiga de 1 serviço
  if (params.serviceId) {
    searchParams.append("serviceId", params.serviceId);
  }

  if (params.isMaintenance) {
    searchParams.append("isMaintenance", "true");
  }

  // 🌟 A NOVA PEÇA: Se houver um carrinho, transforma o array em string e envia na URL!
  if (params.cartItems && params.cartItems.length > 0) {
    searchParams.append("cartItems", JSON.stringify(params.cartItems));
  }

  const response: any = await api.get(
    `/public/book/${params.username}/availability?${searchParams.toString()}`,
    {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
  
  // 🌟 Garante que os horários aparecem
  return response?.data?.data || response?.data || response;
}

export async function createPublicAppointment(params: {
  username: string;
  payload: CreatePublicAppointmentPayload;
}): Promise<CreatePublicAppointmentResponse> {
  const response: any = await api.post(
    `/public/book/${params.username}/appointments`,
    params.payload
  );
  
  // 🌟 Garante que o agendamento (e o PIX, se houver) é retornado corretamente para a tela de sucesso
  return response?.data?.data || response?.data || response;
}