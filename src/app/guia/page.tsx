"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft, Store, Clock, Users, Scissors, MessageCircle,
  CalendarPlus, UserPlus, Ban, Wallet, KeySquare, Zap, BadgeAlert, List
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const DRAWER_SPRING = { type: "spring" as const, stiffness: 320, damping: 30 };

const GUIDE_SECTIONS_MOBILE: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "1. Configuração Inicial",
    items: [
      { id: "vitrine", label: "Vitrine & Perfil" },
      { id: "horarios", label: "Horários de Atendimento" },
      { id: "equipe", label: "Equipe & Profissionais" },
      { id: "servicos", label: "Cadastro de Serviços" },
      { id: "whatsapp", label: "Conexão WhatsApp" },
    ],
  },
  {
    title: "2. Gestão Diária",
    items: [
      { id: "agendamento", label: "Agendamento Manual" },
      { id: "clientes", label: "Cadastro de Clientes" },
      { id: "bloqueios", label: "Bloqueios de Horários" },
    ],
  },
  {
    title: "3. Avançado",
    items: [{ id: "financeiro", label: "Motor Financeiro & PIX" }],
  },
];

const ALL_SECTION_IDS = GUIDE_SECTIONS_MOBILE.flatMap((block) => block.items.map((item) => item.id));
const SECTION_LABEL_BY_ID = Object.fromEntries(
  GUIDE_SECTIONS_MOBILE.flatMap((block) => block.items.map((item) => [item.id, item.label]))
);

export default function GuidePage() {
  const [activeSectionId, setActiveSectionId] = useState<string>(ALL_SECTION_IDS[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveSectionId(topMost.target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    ALL_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen]);

  function handleNavigate(id: string) {
    setIsDrawerOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-amber-500/30 font-sans pb-36 lg:pb-24 scroll-smooth">
      
      {/* 🌟 NAVBAR */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar
          </Link>
          <div className="text-lg font-black tracking-tighter flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Logo Syncro" 
              className="h-6 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden sm:block">Syncro</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-12 lg:pt-20 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* 🌟 MENU LATERAL */}
        <aside className="lg:w-64 flex-shrink-0 lg:sticky lg:top-24 hidden lg:block space-y-8">
          <div>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">1. Configuração Inicial</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-400 list-none pl-0">
              <li><a href="#vitrine" className="hover:text-amber-500 transition-colors">Vitrine & Perfil</a></li>
              <li><a href="#horarios" className="hover:text-amber-500 transition-colors">Horários de Atendimento</a></li>
              <li><a href="#equipe" className="hover:text-amber-500 transition-colors">Equipe & Profissionais</a></li>
              <li><a href="#servicos" className="hover:text-amber-500 transition-colors">Cadastro de Serviços</a></li>
              <li><a href="#whatsapp" className="hover:text-amber-500 transition-colors">Conexão WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">2. Gestão Diária</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-400 list-none pl-0">
              <li><a href="#agendamento" className="hover:text-amber-500 transition-colors">Agendamento Manual</a></li>
              <li><a href="#clientes" className="hover:text-amber-500 transition-colors">Cadastro de Clientes</a></li>
              <li><a href="#bloqueios" className="hover:text-amber-500 transition-colors">Bloqueios de Horários</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black text-amber-500/50 uppercase tracking-widest mb-4">3. Avançado</h3>
            <ul className="space-y-3 text-sm font-medium text-zinc-400 list-none pl-0">
              <li><a href="#financeiro" className="hover:text-amber-500 transition-colors flex items-center gap-2"><Wallet className="w-3.5 h-3.5"/> Motor Financeiro & PIX</a></li>
            </ul>
          </div>
        </aside>

        {/* 🌟 CONTEÚDO DOS TUTORIAIS */}
        <main className="flex-1 w-full max-w-3xl">
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-100">
              Central de Tutoriais
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              O passo a passo completo para configurar o seu espaço, dominar a sua agenda e automatizar os seus recebimentos.
            </p>
          </header>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-24">

            {/* ================= BLOCO 1: CONFIGURAÇÃO INICIAL ================= */}
            <div className="space-y-16">
              <h2 className="text-2xl font-black text-zinc-100 border-b border-zinc-800 pb-4">1. Configuração Inicial</h2>
              
              {/* Vitrine */}
              <motion.section variants={fadeUp} id="vitrine" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><Store className="w-5 h-5 text-zinc-300" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Personalizando a sua Vitrine</h3>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-6">
                  <p className="text-zinc-400 font-semibold text-sm border-b border-zinc-800/50 pb-4">A primeira impressão do seu cliente. Acesse o menu <strong>Configurações</strong> para começar:</p>
                  
                  <div className="space-y-6">
                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-amber-500/90 font-bold text-xs uppercase tracking-wider block mb-1">Aba Perfil</span>
                      <p className="text-zinc-300 text-sm leading-relaxed font-medium">Adicione a sua foto ou logo, o nome da empresa, o CPF ou CNPJ e uma biografia ou descrição detalhada do seu espaço.</p>
                    </div>

                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-amber-500/90 font-bold text-xs uppercase tracking-wider block mb-1">WhatsApp de Notificações</span>
                      <p className="text-zinc-300 text-sm leading-relaxed font-medium">Insira o número de WhatsApp que você deseja que receba todas as notificações automáticas de agendamentos e cancelamentos realizados.</p>
                    </div>

                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-amber-500/90 font-bold text-xs uppercase tracking-wider block mb-1">Aba Vitrine</span>
                      <p className="text-zinc-300 text-sm leading-relaxed font-medium">Personalize a URL do seu link público de agendamento com o nome que desejar (ex: <em className="text-zinc-400 not-italic font-bold">meusyncro.com.br/salaodamaria</em>).</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Horários */}
              <motion.section variants={fadeUp} id="horarios" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><Clock className="w-5 h-5 text-zinc-300" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Horários de Funcionamento</h3>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="space-y-6">
                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block mb-1">Passo 01</span>
                      <p className="text-zinc-300 text-sm font-medium">Acesse o menu <strong>Horários</strong> e ative apenas os dias da semana em que o salão estará aberto.</p>
                    </div>
                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider block mb-1">Passo 02</span>
                      <p className="text-zinc-300 text-sm font-medium">Defina o horário exato de abertura e fechamento para cada um dos dias ativos.</p>
                    </div>
                    <div className="border-l-2 border-zinc-800 hover:border-amber-500/40 pl-4 transition-colors">
                      <span className="text-amber-500/90 font-bold text-xs uppercase tracking-wider block mb-1">Passo 03 (Importante)</span>
                      <p className="text-zinc-300 text-sm font-medium">Configure as pausas adicionando os intervalos do salão (como horário de almoço) caso haja, evitando agendamentos indesejados nesses períodos.</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Equipe */}
              <motion.section variants={fadeUp} id="equipe" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><Users className="w-5 h-5 text-zinc-300" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Equipe & Profissionais</h3>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-6">
                  <p className="text-zinc-400 font-semibold text-sm border-b border-zinc-800/50 pb-4">Gerencie as permissões de quem trabalha com você acessando <strong>Equipe &gt; Adicionar Profissional</strong>:</p>
                  
                  <div className="space-y-6">
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <span className="text-zinc-200 font-bold text-sm block mb-1">Dados Básicos</span>
                      <p className="text-zinc-400 text-sm font-medium">Preencha o nome completo, o e-mail de acesso e crie uma senha inicial para o profissional.</p>
                    </div>
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <span className="text-amber-500 font-bold text-sm block mb-1">Níveis de Permissão</span>
                      <p className="text-zinc-400 text-sm font-medium mb-2">Selecione o cargo correspondente ao acesso que ele terá no sistema:</p>
                      <div className="grid sm:grid-cols-2 gap-3 mt-3">
                        <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                          <strong className="text-zinc-200 text-xs block mb-1 uppercase tracking-wider">Membro</strong>
                          <span className="text-zinc-400 text-xs font-medium">Acesso estritamente limitado. Consegue visualizar e gerenciar apenas a sua própria agenda.</span>
                        </div>
                        <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800">
                          <strong className="text-zinc-200 text-xs block mb-1 uppercase tracking-wider">Co-Administrador</strong>
                          <span className="text-zinc-400 text-xs font-medium">Acesso total. Consegue visualizar relatórios, alterar configurações e gerenciar todas as funções.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Serviços */}
              <motion.section variants={fadeUp} id="servicos" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><Scissors className="w-5 h-5 text-amber-500" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Cadastro de Serviços</h3>
                </div>
                <div className="bg-linear-to-br from-zinc-900/80 to-zinc-950 border border-amber-500/20 rounded-3xl p-6 md:p-8 space-y-6">
                  <p className="text-zinc-400 font-semibold text-sm border-b border-zinc-800/50 pb-4">Acesse <strong>Serviços &gt; Novo Serviço</strong>. Preencha o nome do procedimento, selecione as profissionais que realizam, a duração em minutos e o preço cheio. Abaixo, configure os diferenciais:</p>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-950/50 border border-zinc-800/80 p-5 rounded-2xl">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-100 mb-2"><Zap className="w-4 h-4 text-amber-500"/> Otimizar Horários (Encaixe)</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed font-medium">Ideal para serviços rápidos. Esse recurso força os clientes da vitrine a agendarem apenas em horários adjacentes aos que já estão ocupados, blindando a sua grade contra buracos vazios.</p>
                    </div>
                    <div className="bg-zinc-950/50 border border-zinc-800/80 p-5 rounded-2xl">
                      <h4 className="flex items-center gap-2 text-sm font-bold text-zinc-100 mb-2"><Wallet className="w-4 h-4 text-amber-500"/> Preço de Manutenção</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed font-medium">Ative caso o serviço possua um retorno mais rápido e barato (ex: manutenção de cílios/unhas). O sistema cuida do preço promocional automaticamente.</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* WhatsApp */}
              <motion.section variants={fadeUp} id="whatsapp" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20"><MessageCircle className="w-5 h-5 text-emerald-500" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Conexão com WhatsApp</h3>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-4">
                  <p className="text-zinc-400 font-semibold text-sm border-b border-zinc-800/50 pb-4">Vincule o número que fará o envio em massa das notificações do salão:</p>
                  <div className="space-y-4">
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-zinc-300 text-sm font-medium">1. Navegue até o menu <strong>Configurações &gt; WhatsApp</strong>.</p>
                    </div>
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-zinc-300 text-sm font-medium">2. Clique no botão azul para <strong>Gerar QR Code</strong>.</p>
                    </div>
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-zinc-300 text-sm font-medium">3. No celular do salão, abra o WhatsApp, vá em <em>Aparelhos Conectados &gt; Conectar um Aparelho</em> e faça a leitura do código na tela do computador.</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>

            {/* ================= BLOCO 2: GESTÃO DIÁRIA ================= */}
            <div className="space-y-16">
              <h2 className="text-2xl font-black text-zinc-100 border-b border-zinc-800 pb-4">2. Gestão Diária</h2>

              {/* Agendamento Manual */}
              <motion.section variants={fadeUp} id="agendamento" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><CalendarPlus className="w-5 h-5 text-zinc-300" /></div>
                  <h3 className="text-xl font-bold text-zinc-100">Agendamento Manual</h3>
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 space-y-6">
                  <p className="text-zinc-400 font-semibold text-sm border-b border-zinc-800/50 pb-4">Para marcar horários recebidos por fora da plataforma, vá em <strong>Agenda &gt; Novo Agendamento</strong>:</p>
                  
                  <div className="space-y-5">
                    <div className="border-l-2 border-zinc-800 pl-4">
                      <span className="text-zinc-200 font-bold text-sm block mb-1">Seleção do Cliente</span>
                      <p className="text-zinc-400 text-sm font-medium">Busque pelo nome da cliente. Caso ela ainda não esteja na lista, você pode clicar para cadastrá-la rapidamente sem sair dessa janela.</p>
                    </div>

                    <div className="border-l-2 border-zinc-800 pl-4">
                      <span className="text-zinc-200 font-bold text-sm block mb-1">Dados do Serviço</span>
                      <p className="text-zinc-400 text-sm font-medium">Selecione o procedimento, defina o profissional responsável, a data e o horário desejado.</p>
                    </div>

                    <div className="border-l-2 border-amber-500/40 bg-amber-500/5 p-4 rounded-xl">
                      <span className="text-amber-500 font-bold text-sm flex items-center gap-1.5 mb-1">
                        <BadgeAlert className="w-4 h-4"/> Recurso Especial: Encaixe VIP
                      </span>
                      <p className="text-zinc-300 text-sm leading-relaxed font-medium">Ative esta opção se precisar forçar uma marcação em um horário que está bloqueado ou fora do expediente regular. O sistema vai ignorar as travas de segurança e realizar o agendamento personalizado.</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Clientes e Bloqueios (Grid) */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.section variants={fadeUp} id="clientes" className="scroll-mt-24">
                  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 h-full space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><UserPlus className="w-4 h-4 text-zinc-300" /></div>
                      <h3 className="text-lg font-bold text-zinc-100">Cadastro de Clientes</h3>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      Vá em <strong>Clientes &gt; Novo Cliente</strong>. Insira os dados de contato completos da cliente. Manter esse cadastro atualizado agiliza marcações manuais futuras e gera um histórico rico de atendimentos no salão.
                    </p>
                  </div>
                </motion.section>

                <motion.section variants={fadeUp} id="bloqueios" className="scroll-mt-24">
                  <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 h-full space-y-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700/50"><Ban className="w-4 h-4 text-zinc-300" /></div>
                      <h3 className="text-lg font-bold text-zinc-100">Bloqueios de Horários</h3>
                    </div>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                      Caso precise fechar o salão em um dia específico ou se ausentar por algumas horas, vá em <strong>Bloqueios</strong>. Selecione a aba correspondente (<em>Dia Inteiro</em> ou <em>Horário Específico</em>) e defina a data. A sua vitrine pública fechará as vagas na hora.
                    </p>
                  </div>
                </motion.section>
              </div>
            </div>

            {/* ================= BLOCO 3: FINANCEIRO E PIX ================= */}
            <div className="space-y-16 pb-20">
              <h2 className="text-2xl font-black text-amber-500 border-b border-zinc-800 pb-4">3. Motor Financeiro & PIX Antecipado</h2>
              
              <motion.section variants={fadeUp} id="financeiro" className="scroll-mt-24">
                <div className="bg-zinc-900/40 border border-amber-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden space-y-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
                  
                  <p className="text-zinc-300 font-medium text-base border-b border-zinc-800/50 pb-4">Abra o menu <strong>Configurações &gt; Financeiro</strong>. Esta seção gerencia as regras automáticas de comissão e o recebimento de sinal para blindar o caixa do salão.</p>

                  {/* Regras Financeiras */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-zinc-100 flex items-center gap-2"><Wallet className="w-5 h-5 text-amber-500"/> Configurações de Caixa</h4>
                    
                    <div className="space-y-4">
                      <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/80">
                        <span className="text-zinc-100 font-bold text-sm block mb-1">Centralização de Pagamentos</span>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed"><strong>Ativado:</strong> Todo o valor arrecadado nos agendamentos online entra direto na conta bancária do salão. <br/><strong>Desativado:</strong> Cada profissional configura e vincula a sua própria conta jurídica para receber os seus valores direto.</p>
                      </div>

                      <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/80">
                        <span className="text-zinc-100 font-bold text-sm block mb-1">Absorver Taxa do PIX</span>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed"><strong>Ativado:</strong> O salão assume o custo da taxa do Mercado Pago, calculando a comissão do profissional em cima do valor bruto total do serviço. <br/><strong>Desativado:</strong> A taxa de transação do PIX é descontada do montante antes de realizar o cálculo de repasse da equipe.</p>
                      </div>

                      <div className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800/80">
                        <span className="text-zinc-100 font-bold text-sm block mb-1">Tipo de Comissão</span>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed">Defina a regra padrão do estabelecimento: mude entre <strong>Porcentagem</strong> ou <strong>Valor Fixo</strong> e estipule a taxa padrão de repasse para os colaboradores.</p>
                      </div>
                    </div>
                  </div>

                  {/* Integração Mercado Pago */}
                  <div className="space-y-6 border-t border-zinc-800 pt-8">
                    <h4 className="text-lg font-bold text-zinc-100 flex items-center gap-2"><KeySquare className="w-5 h-5 text-blue-400"/> Ativação do Escudo Anti-Faltas (Mercado Pago)</h4>
                    <p className="text-zinc-400 text-sm font-medium">Siga os passos abaixo para coletar as credenciais e ativar a cobrança automática do sinal:</p>
                    
                    <div className="space-y-4">
                      <div className="border-l-2 border-zinc-800 pl-4">
                        <p className="text-zinc-300 text-sm font-medium">1. Faça login no <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Painel de Desenvolvedores do Mercado Pago</a>.</p>
                      </div>
                      <div className="border-l-2 border-zinc-800 pl-4">
                        <p className="text-zinc-300 text-sm font-medium">2. Acesse a aba <strong>Credenciais de Produção</strong> no menu lateral.</p>
                      </div>
                      <div className="border-l-2 border-zinc-800 pl-4">
                        <p className="text-zinc-300 text-sm font-medium">3. Localize o campo <strong>Access Token</strong>, copie a chave de texto longa gerada por eles e cole no campo correspondente dentro do Syncro.</p>
                      </div>
                      <div className="border-l-2 border-zinc-800 pl-4">
                        <p className="text-zinc-300 text-sm font-medium">4. Ajuste a <strong>Porcentagem de Sinal</strong> que o cliente deve pagar obrigatoriamente via PIX na vitrine para confirmar o horário (ex: 20%).</p>
                      </div>
                      <div className="border-l-2 border-amber-500/50 pl-4">
                        <p className="text-zinc-200 text-sm font-bold">5. Clique em Salvar. Pronto, a cobrança automatizada com QR Code já estará ativa para os clientes!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

            </div>

          </motion.div>
        </main>
      </div>

      {/* 🌟 BARRA FIXA MOBILE (índice) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 h-14 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400 font-medium truncate">
            {SECTION_LABEL_BY_ID[activeSectionId] ?? ""}
          </span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-200 shrink-0"
          >
            <List className="w-4 h-4" />
            Índice
          </button>
        </div>
      </div>

      {/* 🌟 DRAWER MOBILE (bottom-sheet com o índice completo) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={DRAWER_SPRING}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-zinc-800 bg-zinc-950 p-6 pb-10"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={DRAWER_SPRING}
            >
              <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-zinc-700" />
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-5">Índice</h3>

              {GUIDE_SECTIONS_MOBILE.map((block) => (
                <div key={block.title} className="mb-6 last:mb-0">
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">
                    {block.title}
                  </h4>
                  <ul className="space-y-1 list-none pl-0">
                    {block.items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleNavigate(item.id)}
                          className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                            activeSectionId === item.id
                              ? "bg-amber-500/10 text-amber-500"
                              : "text-zinc-300 hover:bg-zinc-900"
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}