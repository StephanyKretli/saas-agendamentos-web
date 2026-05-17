"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "../services/public-booking.api";

// 🌟 Tipagem atualizada para o "Carrinho"
export type UseBookingAvailabilityParams = {
  username: string;
  serviceId?: string | null; // Mantido por retrocompatibilidade
  cartItems?: { serviceId: string; isMaintenance: boolean }[]; // O NOSSO CARRINHO AQUI!
  date: string | null;
  professionalId: string | null; 
};

export function useBookingAvailability({
  username,
  serviceId,
  cartItems, // Extraindo o carrinho
  date,
  professionalId,
}: UseBookingAvailabilityParams) {
  
  // MÁGICA: Se não houver UUID do profissional, usa o username da URL!
  const effectiveProfId = professionalId || username;

  return useQuery({
    // 🌟 Usamos JSON.stringify no carrinho para o React Query saber quando ele muda de verdade
    queryKey: [
      "public-booking-availability", 
      username, 
      serviceId, 
      cartItems ? JSON.stringify(cartItems) : null, 
      date, 
      effectiveProfId
    ],
    queryFn: () =>
      getBookingAvailability({
        username,
        serviceId: serviceId || undefined,
        cartItems, // 🌟 Passa o carrinho para a chamada da API
        date: date!,
        professionalId: effectiveProfId!,
      }),
    // 🌟 A API só vai buscar horários se tiver data, profissional e (um serviceId antigo OU um carrinho preenchido)
    enabled: !!username && !!date && !!effectiveProfId && (!!serviceId || (cartItems !== undefined && cartItems.length > 0)),
  });
}