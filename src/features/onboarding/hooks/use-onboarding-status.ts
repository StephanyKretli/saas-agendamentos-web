"use client";

import { useSettings } from "@/features/settings/hooks/use-settings";
import { useServices } from "@/features/services/hooks/use-services";
import { useBusinessHours } from "@/features/business-hours/hooks/use-business-hours";
import { useTeam } from "@/features/team/hooks/use-team";
import { useWhatsappStatus } from "@/features/whatsapp/hooks/use-whatsapp-status";
import type { OnboardingStepId } from "../config/steps";

export interface OnboardingStatus {
  profile: boolean;
  vitrine: boolean;
  hours: boolean;
  team: boolean;
  services: boolean;
  shield: boolean;
  whatsapp: boolean;
  stepFlags: Record<OnboardingStepId, boolean>;
  salonId: string | undefined;
  isMinimumReady: boolean;
  isFullyOnboarded: boolean;
  progress: number;
  done: number;
  total: number;
  isLoading: boolean;
}

export function useOnboardingStatus(): OnboardingStatus {
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: businessHours, isLoading: isLoadingHours } = useBusinessHours();
  const { data: teamMembers, isLoading: isLoadingTeam } = useTeam();

  const isSalonOwner = settings ? !settings.ownerId : false;
  const salonId = settings ? (isSalonOwner ? settings.id : settings.ownerId ?? undefined) : undefined;
  const { data: whatsappStatus, isLoading: isLoadingWhatsapp } = useWhatsappStatus(salonId ?? undefined);

  // CPF/CNPJ é pré-requisito do PIX: sem documento, o Escudo Anti-Faltas não pode ser ligado
  const profile = Boolean((settings as any)?.document);

  // O link já existe desde o cadastro (username é obrigatório no signup) — este passo
  // nasce concluído por design; serve como reforço positivo, não como tarefa.
  const vitrine = Boolean(settings?.username);

  const hours = Boolean(businessHours && businessHours.length > 0);

  // GET /services/me devolve um array puro, não o objeto paginado {items,total}
  // que ServicesListResponse declara — mesmo contorno já usado em services/page.tsx
  const servicesList = Array.isArray(services) ? services : (services as any)?.items ?? [];
  const services_ = servicesList.length > 0;

  // GET /team sempre inclui a própria dona (isOwner: true) — só conta convites reais
  const hasRealTeamMembers = Boolean(
    teamMembers?.some((member: any) => member?.isOwner !== true)
  );
  const team = hasRealTeamMembers || (settings as any)?.isSoloProfessional === true;

  const shield =
    Boolean((settings as any)?.mercadoPagoAccessToken) &&
    Boolean((settings as any)?.requirePixDeposit) &&
    ((settings as any)?.pixDepositPercentage ?? 0) > 0;

  const whatsapp = whatsappStatus === "CONNECTED";

  const isMinimumReady = profile && hours && services_;
  const isFullyOnboarded = profile && vitrine && hours && team && services_ && shield && whatsapp;

  const stepFlags: Record<OnboardingStepId, boolean> = {
    profile,
    vitrine,
    hours,
    team,
    services: services_,
    shield,
    whatsapp,
  };

  const total = Object.keys(stepFlags).length;
  const done = Object.values(stepFlags).filter(Boolean).length;
  const progress = total === 0 ? 0 : done / total;

  const isLoading =
    isLoadingSettings || isLoadingServices || isLoadingHours || isLoadingTeam || isLoadingWhatsapp;

  return {
    profile,
    vitrine,
    hours,
    team,
    services: services_,
    shield,
    whatsapp,
    stepFlags,
    salonId,
    isMinimumReady,
    isFullyOnboarded,
    progress,
    done,
    total,
    isLoading,
  };
}
