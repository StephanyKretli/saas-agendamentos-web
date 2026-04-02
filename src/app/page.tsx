"use client";

import { motion, Variants } from "framer-motion";
import { Calendar, Wallet, Users, Bell, ArrowRight, PlayCircle, Smartphone, CheckCircle2, XCircle, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-zinc-950 pb-20 overflow-hidden font-sans">
      
      {/* 🌟 HERO SECTION: O GATILHO E A PROMESSA 🌟 */}
      <section className="pt-32 pb-16 px-4 text-center max-w-5xl mx-auto space-y-8 relative">
        {/* Efeitos de luz no fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Pare de perder dinheiro com faltas
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
            A sua agenda cheia, <br className="hidden md:block"/>
            sem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-500">dores de cabeça.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Liberte-se do WhatsApp. O seu cliente agenda sozinho, paga um sinal via PIX antecipado e recebe lembretes automáticos. <strong>Você foca no seu talento, nós focamos na gestão.</strong>
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/register" className="w-full sm:w-auto">
              {/* BOTÃO CORRIGIDO E SUPER PREMIUM */}
              <button className="relative inline-flex h-14 w-full sm:w-auto overflow-hidden rounded-full p-[2px] focus:outline-none group shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)] transition-shadow hover:shadow-[0_0_60px_-15px_rgba(168,85,247,0.7)]">
                <span className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#a855f7_50%,#E2CBFF_100%)] animate-[spin_3s_linear_infinite]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-8 py-1 text-lg font-bold text-white backdrop-blur-3xl transition-colors group-hover:bg-zinc-900">
                  Começar 14 dias grátis
                </span>
              </button>
            </Link>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium px-4 py-4 transition-colors">
              <PlayCircle className="h-6 w-6 text-primary" /> Ver como funciona
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Não exige cartão de crédito. Configure o seu salão em 2 minutos.</p>
        </motion.div>

        {/* VÍDEO / MOCKUP DE ALTO IMPACTO */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 mx-auto max-w-4xl relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-2 shadow-2xl"
        >
          {/* Aqui você pode colocar um <video autoPlay loop muted> que você mesma gravou do app funcionando! */}
          <div className="aspect-video w-full rounded-xl bg-zinc-950 flex flex-col items-center justify-center overflow-hidden relative border border-zinc-800/50">
             <Smartphone className="h-12 w-12 text-zinc-700 mb-4" />
             <p className="text-zinc-500 font-medium text-center px-4">
               Dica: Grave a tela do seu telemóvel usando o app e coloque o vídeo aqui.<br/>Ver o sistema rodando liso converte muito mais que fotos estáticas!
             </p>
          </div>
        </motion.div>
      </section>

      {/* 🌟 NOVA SESSÃO: AGITAÇÃO DA DOR VS SOLUÇÃO (GATILHO DE NECESSIDADE) 🌟 */}
      <section className="py-24 px-4 max-w-5xl mx-auto border-t border-zinc-800/50 mt-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">A forma antiga está te custando caro.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Você não abriu o seu negócio para ser recepcionista 24 horas por dia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* O PROBLEMA */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-6">
              <XCircle className="h-6 w-6" /> A realidade atual
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="bg-red-500/10 p-1 rounded text-red-500 mt-0.5"><XCircle className="h-4 w-4" /></span>
                Clientes marcam, não aparecem e você fica com o horário vago, perdendo dinheiro.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="bg-red-500/10 p-1 rounded text-red-500 mt-0.5"><XCircle className="h-4 w-4" /></span>
                Seu WhatsApp não para de tocar nos finais de semana e à noite pedindo horários.
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <span className="bg-red-500/10 p-1 rounded text-red-500 mt-0.5"><XCircle className="h-4 w-4" /></span>
                Fazer o cálculo de comissões da sua equipe no final do mês é um pesadelo no papel.
              </li>
            </ul>
          </div>

          {/* A SOLUÇÃO */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <h3 className="text-xl font-bold text-primary flex items-center gap-2 mb-6 relative z-10">
              <CheckCircle2 className="h-6 w-6" /> Com a nossa plataforma
            </h3>
            <ul className="space-y-4 relative z-10">
              <li className="flex items-start gap-3 text-foreground font-medium">
                <span className="bg-primary/20 p-1 rounded text-primary mt-0.5"><CheckCircle2 className="h-4 w-4" /></span>
                Garantia de receita: o cliente paga um sinal por PIX para travar o horário. Fim das faltas.
              </li>
              <li className="flex items-start gap-3 text-foreground font-medium">
                <span className="bg-primary/20 p-1 rounded text-primary mt-0.5"><CheckCircle2 className="h-4 w-4" /></span>
                A sua agenda trabalha sozinha 24/7 com um link exclusivo na bio do seu Instagram.
              </li>
              <li className="flex items-start gap-3 text-foreground font-medium">
                <span className="bg-primary/20 p-1 rounded text-primary mt-0.5"><CheckCircle2 className="h-4 w-4" /></span>
                Dashboard financeiro automático. Saiba exatamente quanto faturou e quanto deve pagar à equipe.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🌟 O BENTO GRID (Funcionalidades Detalhadas) 🌟 */}
      <section className="max-w-6xl mx-auto px-4 mt-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Feito para acelerar o seu crescimento</h2>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
        >
          {/* Bento Item 1: Ocupa 2 colunas */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col md:flex-row justify-between items-center overflow-hidden relative group hover:border-primary/50 transition-colors"
          >
            <div className="relative z-10 md:w-1/2 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-white">O seu link na Bio</h3>
              <p className="text-zinc-400 text-lg">
                Personalize o seu site em minutos. O seu cliente escolhe o serviço, o profissional, vê as horas disponíveis e agenda em segundos.
              </p>
            </div>
            
            {/* Espaço para mockup do celular */}
            <div className="relative md:w-1/2 h-full min-h-[200px] w-full mt-6 md:mt-0 flex justify-end items-end group-hover:scale-105 transition-transform duration-700">
              <div className="w-[80%] h-[120%] bg-zinc-950 rounded-t-3xl border-t-8 border-x-8 border-zinc-800 shadow-2xl translate-y-8 flex items-center justify-center overflow-hidden relative">
                 <p className="text-xs text-zinc-600 text-center px-4 relative z-10">Coloque um print do seu <br/>SaaS no mobile aqui</p>
                 <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: Proteção PIX */}
          <motion.div 
            variants={itemVariants}
            className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 p-8 flex flex-col justify-between group hover:shadow-lg transition-all"
          >
            <div>
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-amber-500">Trava Anti-Faltas</h3>
              <p className="text-amber-500/70 mt-3">
                Exija o pagamento de um sinal via PIX para confirmar a reserva. Quem paga sinal, aparece.
              </p>
            </div>
          </motion.div>

          {/* Bento Item 3: Avisos no WhatsApp */}
          <motion.div 
            variants={itemVariants}
            className="rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 p-8 flex flex-col justify-between group hover:shadow-lg transition-all relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 mb-6 group-hover:rotate-12 transition-transform">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-green-500">Avisos no Zap</h3>
              <p className="text-green-500/70 mt-3">
                Lembretes enviados automaticamente pelo sistema no WhatsApp para o cliente não esquecer.
              </p>
            </div>
          </motion.div>

          {/* Bento Item 4: Ocupa 2 colunas - Gestão */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 rounded-3xl bg-zinc-900 border border-zinc-800 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-colors"
          >
            <div className="relative z-10 md:w-2/3">
              <div className="h-12 w-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-white">Relatórios e Comissões</h3>
              <p className="text-zinc-400 mt-3 text-lg">
                Acabe com o fechamento manual. O sistema calcula sozinho as comissões de cada profissional e mostra o seu faturamento em tempo real.
              </p>
            </div>
            
            <div className="absolute top-0 right-0 h-full w-1/3 opacity-30 group-hover:opacity-50 transition-opacity flex items-center justify-end pr-8">
               <div className="flex -space-x-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-700 border-4 border-zinc-900"></div>
                  <div className="w-16 h-16 rounded-full bg-zinc-600 border-4 border-zinc-900"></div>
                  <div className="w-16 h-16 rounded-full bg-primary/80 border-4 border-zinc-900 flex items-center justify-center text-white font-bold">+3</div>
               </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 🌟 CALL TO ACTION FINAL 🌟 */}
      <section className="py-24 mt-20 relative">
        <div className="absolute inset-0 bg-primary/5 border-t border-primary/10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-6">Pronto para modernizar o seu salão?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">Junte-se a dezenas de profissionais que já automatizaram as suas agendas e aumentaram o seu faturamento.</p>
          <Link href="/register">
            <button className="h-14 px-10 rounded-full bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25 hover:-translate-y-1 active:translate-y-0 transform duration-200">
              Criar o meu salão agora
            </button>
          </Link>
          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> Leva menos de 2 minutos
          </p>
        </div>
      </section>

    </main>
  );
}