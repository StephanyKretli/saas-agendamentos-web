"use client";

import { useQuery } from "@tanstack/react-query";
import { getOnboardingState } from "../api/onboarding.api";

/**
 * Estado do fluxo guiado (/onboarding). Fonte da verdade tanto do gate no
 * layout do painel quanto da retomada de passo dentro do fluxo.
 */
export function useOnboardingState(enabled = true) {
  return useQuery({
    queryKey: ["onboarding-state"],
    queryFn: getOnboardingState,
    enabled,
    staleTime: 15_000,
  });
}
