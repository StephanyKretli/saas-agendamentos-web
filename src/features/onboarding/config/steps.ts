import type { LucideIcon } from "lucide-react";
import { User, Store, Clock, Users, Scissors, ShieldCheck, Smartphone } from "lucide-react";

export type OnboardingStepId =
  | "profile"
  | "vitrine"
  | "hours"
  | "team"
  | "services"
  | "shield"
  | "whatsapp";

export interface OnboardingStep {
  id: OnboardingStepId;
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
  checklist: string[];
  route: string;
  cta: string;
  required: boolean;
  skippable: boolean;
  /** Rótulo exibido na trilha lateral. Independente de `required` — nem todo passo opcional ganha rótulo. */
  badge?: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "profile",
    icon: User,
    title: "Perfil",
    headline: "Libere o PIX e a agenda paga",
    description:
      "Sem CPF ou CNPJ cadastrado, o Mercado Pago não libera cobranças de sinal — e sem sinal, falta continua custando caro.",
    checklist: [
      "Documento valida o Escudo Anti-Faltas",
      "Necessário para o Mercado Pago aceitar sua conta",
      "Leva menos de 1 minuto",
    ],
    route: "/settings?tab=perfil",
    cta: "Completar perfil",
    required: true,
    skippable: false,
  },
  {
    id: "vitrine",
    icon: Store,
    title: "Vitrine",
    headline: "Sua vitrine já está no ar",
    description:
      "Desde o seu cadastro você já tem um link próprio para receber agendamentos — não precisa fazer nada agora.",
    checklist: [
      "Link ativo desde o seu cadastro",
      "Pronto para compartilhar na bio do Instagram",
      "Pode ser alterado quando quiser em Configurações",
    ],
    route: "/settings?tab=vitrine",
    cta: "Continuar",
    required: false,
    skippable: true,
  },
  {
    id: "hours",
    icon: Clock,
    title: "Horários",
    headline: "Não perca horário fora da sua agenda",
    description:
      "Defina os dias e horários em que você atende para que clientes só marquem quando você realmente está disponível.",
    checklist: [
      "Bloqueia agendamentos fora do expediente",
      "Evita mensagens fora de hora",
      "Pode ter horários diferentes por profissional",
    ],
    route: "/business-hours",
    cta: "Definir horários",
    required: true,
    skippable: false,
  },
  {
    id: "team",
    icon: Users,
    title: "Equipe",
    headline: "Multiplique sua agenda com a equipe",
    description:
      "Convide profissionais para dividir os agendamentos — ou nos diga que trabalha sozinha para seguir em frente.",
    checklist: [
      "Cada profissional tem a própria agenda",
      "Comissionamento configurável por serviço",
      "Sem equipe? Sem problema, é só avisar",
    ],
    route: "/team",
    cta: "Convidar profissional",
    required: false,
    skippable: true,
    badge: "Opcional",
  },
  {
    id: "services",
    icon: Scissors,
    title: "Serviços",
    headline: "Sem serviço cadastrado, ninguém agenda",
    description:
      "Cadastre o que você oferece, com preço e duração, para o seu link de agendamento ter o que vender.",
    checklist: [
      "Aparece na sua vitrine pública na hora",
      "Duração define o bloqueio certo na agenda",
      "Pode ter preço de manutenção separado",
    ],
    route: "/services",
    cta: "Cadastrar serviço",
    required: true,
    skippable: false,
  },
  {
    id: "shield",
    icon: ShieldCheck,
    title: "Escudo Anti-Faltas",
    headline: "A razão de você estar aqui",
    description:
      "Conecte o Mercado Pago e ative o sinal via PIX para que clientes só marquem horário levando o compromisso a sério.",
    checklist: [
      "Cobra um sinal no ato do agendamento",
      "Reduz drasticamente o não comparecimento",
      "Exige CPF/CNPJ e Mercado Pago conectado",
    ],
    route: "/settings?tab=pagamentos",
    cta: "Ativar Escudo Anti-Faltas",
    required: false,
    skippable: true,
    badge: "Recomendado",
  },
  {
    id: "whatsapp",
    icon: Smartphone,
    title: "WhatsApp",
    headline: "Lembretes automáticos, zero esquecimento",
    description:
      "Conecte o número do salão para enviar lembretes automáticos e reduzir esquecimentos sem precisar mandar mensagem manual.",
    checklist: [
      "Lembrete automático 1 dia e 1 hora antes",
      "Reduz faltas sem gastar seu tempo",
      "Leva 30 segundos com QR Code",
    ],
    route: "/settings?tab=whatsapp",
    cta: "Conectar WhatsApp",
    required: false,
    skippable: true,
  },
];
