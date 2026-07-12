"use client";

import { motion, Variants } from "framer-motion";
import { 
  ChevronRight, ShieldCheck, Clock, Smartphone, Sparkles, 
  BarChart3, Users, ChevronDown 
} from "lucide-react";
import Link from "next/link";

// 🌟 Variantes de Animação Refinadas (Entradas Suaves e Elegantes)
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.2 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const } 
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-hidden">
      
      {/* 🌟 NAVBAR MINIMALISTA */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Logo Syncro" 
              className="h-8 w-auto object-contain"
            />
            <span className="hidden sm:block">Syncro</span>
          </div>
          <Link 
            href="/register" 
            className="text-sm font-bold text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </nav>

      {/* 🌟 HERO SECTION MAGNÉTICA */}
      <section className="relative pt-40 pb-20 px-6 flex flex-col items-center text-center">
        {/* Glow de fundo elegante */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="relative z-10 max-w-3xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm mb-8 text-xs font-semibold text-zinc-300 shadow-xl shadow-black/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            A agenda da nova geração de profissionais
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Sua agenda lotada, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              sem perder tempo no WhatsApp.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            O Syncro é a plataforma premium que trabalha 24h por você. Seus clientes marcam sozinhos em poucos segundos, enquanto você foca no que realmente importa: atender com excelência.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/register"
              className="relative group inline-flex h-14 items-center justify-center rounded-2xl bg-zinc-100 px-8 font-bold text-zinc-950 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(244,244,245,0.1)] hover:shadow-[0_0_60px_rgba(244,244,245,0.15)]"
            >
              Começar Meus Dias Grátis
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 🌟 JORNADA DO CLIENTE (Bento Grid) */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-950 relative">
        <div className="absolute left-0 top-1/3 w-96 h-96 bg-zinc-800/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Experiência fluida. Da bio ao agendamento.</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">Esqueça o vai-e-vem de mensagens. Uma interface desenhada para converter curiosos em clientes confirmados.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="col-span-1 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-8 flex flex-col hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 shadow-inner border border-zinc-700/50">
                <Smartphone className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Link Exclusivo</h3>
              <p className="text-zinc-400 leading-relaxed">Seu espaço personalizado. O cliente acessa pelo Instagram e vê todos os seus serviços com uma estética de alto padrão.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="col-span-1 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 p-8 flex flex-col hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 flex items-center justify-center mb-6 shadow-inner border border-zinc-700/50">
                <Clock className="w-6 h-6 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sincronização Real</h3>
              <p className="text-zinc-400 leading-relaxed">A sua agenda sabe quando você está livre. O sistema bloqueia conflitos e organiza os encaixes automaticamente.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="col-span-1 md:col-span-3 rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-amber-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
            >
              {/* Glow sutil que reage ao hover */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-500" />
              
              <div className="flex-1 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck className="w-4 h-4" />
                  Opcional
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Escudo Anti-Faltas</h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                  Cansada de clientes que marcam e não aparecem? Ative o recebimento de sinal via PIX para confirmar a reserva. Filtre curiosos, garanta o seu tempo e blinde a sua agenda contra furos.
                </p>
              </div>
              
              <div className="w-full md:w-1/3 z-10 flex justify-center md:justify-end">
                <motion.div 
                  animate={floatAnimation} 
                  className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50"
                >
                  {/* Substitua 'mockup-pix.png' pelo nome da sua imagem na pasta public */}
                  <img 
                    src="/mockup-pix.png" 
                    alt="Tela de Pagamento PIX" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🌟 SHOW, DON'T TELL: O MOTOR DO SEU NEGÓCIO */}
      <section className="py-24 px-6 border-t border-zinc-900/50 bg-zinc-950 relative">
        {/* Luzes de fundo para o Painel */}
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Muito mais que uma agenda. <br className="hidden sm:block"/>
              <span className="text-zinc-500">O cérebro do seu salão.</span>
            </h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Dashboard Financeiro */}
            <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="group rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-blue-500 w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-zinc-100 relative z-10">Raio-X Financeiro</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10">
                Abra o aplicativo e saiba exatamente como está a saúde do seu negócio. Faturamento bruto, lucro líquido real e taxas de cancelamento calculados em tempo real, sem planilhas complexas.
              </p>
            </motion.div>

            {/* Lembretes WhatsApp */}
            <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="group rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform">
                 <Smartphone className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-zinc-100 relative z-10">Secretária Virtual 24h</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10">
                O Syncro dispara lembretes automáticos no WhatsApp do cliente 24h e 3h antes do horário. Se houver cancelamento, você e o cliente são notificados instantaneamente. Zero mensagens manuais.
              </p>
            </motion.div>

            {/* Comissões e Equipe */}
            <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="md:col-span-2 group rounded-3xl bg-zinc-900/30 border border-zinc-800/60 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all duration-300 overflow-hidden relative">
              <div className="absolute -left-20 bottom-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
              
              <div className="flex-1 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-zinc-100">Comissionamento no Piloto Automático</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Tem equipe? O sistema divide automaticamente o que é do salão e o que é repasse dos profissionais a cada serviço concluído. Chega de passar horas fechando o mês na calculadora.
                </p>
              </div>
              
              <div className="w-full md:w-1/3 z-10 flex justify-center md:justify-end">
                <motion.div 
                  animate={floatAnimation} 
                  className="relative w-full max-w-[320px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-700/50"
                >
                  <img 
                    src="/mockup-comissoes.png" 
                    alt="Painel de Comissões" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 FAQ - QUEBRANDO OBJEÇÕES */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-zinc-900/50">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-zinc-100">Perguntas Frequentes</h2>
            <p className="text-zinc-400">Tudo o que você precisa saber antes de transformar sua agenda.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="space-y-4"
          >
            {[
              { 
                q: "Meus clientes precisam baixar algum aplicativo?", 
                a: "Não. Eles acessam o seu link exclusivo diretamente pelo navegador do celular ou computador. O agendamento é feito em segundos, sem necessidade de senhas complexas ou downloads."
              },
              { 
                q: "Como funciona o repasse do PIX de agendamento?", 
                a: "O Syncro processa o PIX de segurança (sinal) instantaneamente no momento da reserva. O valor cai diretamente na sua conta integrada do Mercado Pago, garantindo que o dinheiro fique no seu controle imediato."
              },
              { 
                q: "É difícil configurar a plataforma pela primeira vez?", 
                a: "Nossa interface foi desenhada para ser extremamente intuitiva. Em menos de 10 minutos você consegue cadastrar seus serviços, definir seu horário de funcionamento e começar a receber agendamentos."
              }
            ].map((faq, idx) => (
              <motion.details 
                key={idx} variants={fadeUp}
                className="group rounded-2xl bg-zinc-900/30 border border-zinc-800/50 p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer hover:border-zinc-700 transition-colors"
              >
                <summary className="flex items-center justify-between font-semibold text-lg text-zinc-200 outline-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="mt-4 text-zinc-400 leading-relaxed overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🌟 CTA FINAL */}
      <section className="py-32 px-6 relative overflow-hidden border-t border-zinc-900/80 bg-zinc-950">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Eleve o nível do seu atendimento hoje.</h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Experimente o Syncro gratuitamente. Sem compromisso, sem cartão de crédito exigido. Apenas resultados reais.</p>
            <Link 
              href="/register"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-zinc-100 px-10 font-bold text-zinc-950 transition-all hover:scale-105 shadow-[0_0_30px_rgba(244,244,245,0.15)]"
            >
              Criar Minha Conta Grátis
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}