"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { 
  CheckCircle2, X, Sparkles, Wallet, 
  MessageCircle, ShieldCheck, ArrowRight, Zap,
  PlayCircle, Smartphone // Novas importações!
} from "lucide-react";

// --- VARIANTES DE ANIMAÇÃO ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden font-sans">
      
      {/* 🌟 CABEÇALHO (AGORA COM A SUA LOGO!) */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8 max-w-6xl">
          <div className="flex items-center gap-3">
            {/* 👇 SUA LOGO AQUI 👇 (Coloque logo.png na pasta public) */}
            <img 
              src="/logo.png" 
              alt="Logo do Sistema" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // Fallback de segurança: Se não achar a imagem, mostra o "S" de volta
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black">
              S
            </div>
            <span className="text-xl font-black tracking-tight text-foreground hidden sm:block">Syncro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Link href="/register">
              <Button className="rounded-xl font-bold shadow-sm">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 px-4 sm:px-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 opacity-20 bg-primary/40 rounded-full blur-[120px] -z-10 pointer-events-none" />
          
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl text-center lg:text-left z-10">
                <motion.div variants={fadeInUp}>
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-black text-primary mb-6 shadow-sm">
                    <Sparkles className="h-4 w-4" /> A revolução na gestão do seu espaço
                  </span>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-foreground">
                    Pare de perder dinheiro com <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-amber-500">clientes que faltam.</span>
                  </h1>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <p className="text-lg text-muted-foreground font-medium mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    A única plataforma que exige <strong>sinal antecipado via PIX</strong>, calcula comissões automaticamente e avisa a sua equipe no WhatsApp. Durma descansado enquanto a agenda trabalha por você.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/register?plan=pro" className="w-full sm:w-auto">
                    <Button className="h-16 w-full sm:w-auto rounded-2xl px-8 text-lg font-black bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20 border-0 transition-transform hover:scale-105 group relative overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">Testar o PRO Grátis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mt-4 sm:mt-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Sem cartão de crédito
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block h-125"
              >
                <motion.div 
                  animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-10 right-0 w-80 rounded-2xl bg-card/90 backdrop-blur-xl border border-border p-5 shadow-xl z-20"
                >
                  <div className="flex gap-3 items-center border-b border-border/50 pb-3 mb-3">
                    <div className="bg-green-500 p-2 rounded-full"><MessageCircle className="h-5 w-5 text-white" /></div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Novo Agendamento!</p>
                      <p className="text-xs text-muted-foreground">Há 2 minutos</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    Olá Ana! O seu agendamento para <strong>Corte Feminino</strong> com a Maria foi confirmado. ✂️
                  </p>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-20 -left-10 w-72 rounded-2xl bg-card/90 backdrop-blur-xl border border-amber-500/30 p-5 shadow-lg z-30"
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <Zap className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Sinal PIX Pago</p>
                      <p className="text-2xl font-black text-foreground">+ R$ 30,00</p>
                    </div>
                  </div>
                </motion.div>

                <div className="absolute top-1/2 left-10 w-64 rounded-2xl bg-card border border-border p-5 shadow-xl -translate-y-1/2 z-10">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Dashboard Automático</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro Líquido</span>
                      <span className="text-sm font-black text-green-500">R$ 1.450</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden"><div className="w-[70%] h-full bg-green-500" /></div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">Comissões a Pagar</span>
                      <span className="text-sm font-black text-amber-500">R$ 890</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden"><div className="w-[40%] h-full bg-amber-500" /></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 👇 2. NOVA SECÇÃO: VÍDEO DO SISTEMA 👇 */}
        <section className="py-20 relative overflow-hidden bg-muted/20 border-t border-border/50">
          <div className="container mx-auto max-w-5xl px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary mb-4 uppercase tracking-widest">
                <PlayCircle className="h-3.5 w-3.5" /> Demonstração
              </span>
              <h2 className="text-3xl lg:text-5xl font-black mb-4 text-foreground">Veja o sistema em ação</h2>
              <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                Uma interface desenhada para ser simples, intuitiva e incrivelmente rápida. Tudo ao alcance de um clique.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} 
              className="relative rounded-[2rem] border border-border/50 bg-card/50 p-2 sm:p-4 shadow-2xl backdrop-blur-sm"
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-primary to-amber-500 rounded-[2.2rem] opacity-20 blur-xl pointer-events-none" />
              
              <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline // 🌟 Essencial para não abrir em tela cheia no iPhone
                  className="w-full h-full object-cover"
                >
                  {/* O navegador tenta carregar o WebM primeiro (melhor qualidade) */}
                  <source src="/demo.webm" type="video/webm" />
                  
                  {/* Se for um navegador muito antigo como o Safari velho, cai para o MP4 */}
                  <source src="/demo.mp4" type="video/mp4" />

                  
                  Seu navegador não suporta vídeos.
                </video>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 👇 3. NOVA SECÇÃO: RESPONSIVIDADE (MOBILE) 👇 */}
        <section className="py-24 border-b border-border/50 overflow-hidden">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="order-2 lg:order-1">
                 <motion.div variants={fadeInUp}>
                   <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-6 border border-primary/20">
                     <Smartphone className="h-6 w-6" />
                   </div>
                   <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-6 leading-tight">
                     A gestão do seu salão, <br className="hidden lg:block"/> na palma da mão.
                   </h2>
                 </motion.div>
                 
                 <motion.div variants={fadeInUp}>
                   <p className="text-lg text-muted-foreground font-medium mb-8">
                     Esqueça o computador. Faça a gestão da sua agenda, acompanhe os relatórios financeiros e adicione bloqueios de horários de onde estiver. O nosso sistema é 100% responsivo e funciona perfeitamente no seu celular.
                   </p>
                 </motion.div>
                 
                 <motion.div variants={fadeInUp} className="space-y-5">
                   <FeatureItem text="Dashboard financeiro completo no ecrã do celular" included={true} />
                   <FeatureItem text="Receba notificações de marcações em tempo real no WPP" included={true} />
                   <FeatureItem text="Envie o link da sua vitrine com 1 clique" included={true} />
                 </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} 
                className="relative flex justify-center lg:justify-end order-1 lg:order-2"
              >
                {/* Efeito de brilho fundo */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/20 blur-[80px] rounded-full -z-10" />
                
                {/* MOCKUP DE CELULAR */}
                <div className="relative w-[280px] h-[580px] bg-card rounded-[3rem] border-[8px] border-muted shadow-2xl overflow-hidden ring-1 ring-border">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
                     <div className="w-24 h-6 bg-muted rounded-b-xl shadow-inner" />
                  </div>
                  
                  {/* Conteúdo da Tela do Celular */}
                  <div className="absolute inset-0 z-10">
                    {/* 👇 Imagem Real do Mobile (Coloque mobile-app.jpg na pasta public) 👇 */}
                    <img 
                      src="/mobile-app.jpg" 
                      alt="Versão Mobile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback em código (Se não houver imagem, mostra este UI falso bonito)
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    
                    {/* FALLBACK UI FALSO (Aparece se a imagem não existir) */}
                    <div className="hidden w-full h-full bg-background pt-12 px-5 flex-col gap-5">
                       <div className="flex justify-between items-center">
                         <div>
                           <div className="h-4 w-20 bg-muted-foreground/20 rounded mb-2" />
                           <div className="h-6 w-32 bg-foreground rounded" />
                         </div>
                         <div className="h-10 w-10 bg-primary/20 rounded-full border border-primary/30" />
                       </div>
                       <div className="h-28 bg-card border border-border rounded-2xl p-5 shadow-sm">
                         <div className="h-4 w-24 bg-muted rounded mb-3" />
                         <div className="h-8 w-40 bg-foreground/10 rounded" />
                       </div>
                       <div className="space-y-3 mt-2">
                         <div className="h-4 w-16 bg-muted rounded mb-2" />
                         <div className="h-16 bg-card border border-border rounded-2xl shadow-sm" />
                         <div className="h-16 bg-card border border-border rounded-2xl shadow-sm" />
                         <div className="h-16 bg-card border border-border rounded-2xl shadow-sm" />
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 4. AGITAR A DOR (O CUSTO DE NÃO TER A FERRAMENTA) */}
        <section className="py-24 bg-muted/30 border-y border-border/50 relative overflow-hidden">
          <div className="container mx-auto max-w-4xl text-center px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}>
              <h2 className="text-3xl lg:text-5xl font-black mb-8 leading-tight text-foreground">
                Sabe quanto lhe custa um cliente que <span className="text-destructive line-through decoration-4">não aparece</span>?
              </h2>
              <p className="text-lg text-muted-foreground font-medium mb-12">
                Em média, os salões perdem <strong>20% do faturamento</strong> mensal devido a faltas e esquecimentos. Com o nosso sistema de Sinal Antecipado (PIX) e Lembretes de WhatsApp, esse número cai para quase ZERO.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { title: "Sem Furos", desc: "O cliente paga uma porcentagem para reservar.", icon: <ShieldCheck className="h-6 w-6 text-amber-500" /> },
                { title: "Zero Esforço", desc: "Avisos automáticos pelo seu próprio WhatsApp.", icon: <MessageCircle className="h-6 w-6 text-green-500" /> },
                { title: "Paz Mental", desc: "Repasses e comissões calculados na hora.", icon: <Wallet className="h-6 w-6 text-purple-500" /> }
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-card border border-border p-6 rounded-3xl text-left shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-muted rounded-2xl flex items-center justify-center mb-4 border border-border">{item.icon}</div>
                  <h3 className="text-lg font-black text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PRECIFICAÇÃO */}
        <section id="pricing" className="py-24 relative">
          <div className="container mx-auto max-w-5xl px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-foreground">Escolha o plano ideal para o seu momento</h2>
              <p className="text-muted-foreground font-medium mt-2">Sem taxas escondidas. Cancele quando quiser.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
              
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="text-xl font-black text-foreground">Starter</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1 mb-6">Para profissionais independentes e espaços pequenos.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-foreground">R$ 49</span><span className="text-muted-foreground font-bold">,90/mês</span>
                </div>
                <Link href="/register?plan=starter">
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold mb-8">Assinar Starter</Button>
                </Link>
                
                <div className="space-y-4 text-sm font-medium">
                  <FeatureItem text="Vitrine de agendamento online" included={true} />
                  <FeatureItem text="Equipe de até 3 profissionais" included={true} />
                  <FeatureItem text="Notificação de WhatsApp (Apenas Cliente)" included={true} />
                  <FeatureItem text="Dashboard básico (Faturamento bruto)" included={true} />
                  
                  <div className="pt-4 border-t border-border/50 space-y-4">
                    <FeatureItem text="Equipe Ilimitada" included={false} />
                    <FeatureItem text="Notificação WhatsApp (Para o Profissional)" included={false} />
                    <FeatureItem text="Sinal PIX Antecipado (Antifaltas)" included={false} />
                    <FeatureItem text="Cálculo e Repasse de Comissões" included={false} />
                    <FeatureItem text="Dashboard Avançado (Lucro Líquido)" included={false} />
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border-2 border-amber-500 bg-card p-8 shadow-2xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-amber-500 text-white text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Mais Escolhido
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-foreground mt-2">PRO</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1 mb-6">A gestão completa para salões que querem crescer.</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-foreground">R$ 99</span><span className="text-muted-foreground font-bold">,90/mês</span>
                </div>
                <Link href="/register?plan=pro">
                  <Button className="w-full h-12 rounded-xl font-black mb-2 bg-amber-500 hover:bg-amber-600 text-white shadow-lg border-0">Testar Grátis por 7 dias</Button>
                </Link>
                <p className="text-center text-xs font-semibold text-muted-foreground mb-6">Acesso total liberado no teste.</p>
                
                <div className="space-y-4 text-sm font-medium">
                  <FeatureItem text="Vitrine de agendamento online" included={true} />
                  <FeatureItem text="Equipe Ilimitada" included={true} />
                  <FeatureItem text="Notificação WhatsApp (Cliente e Profissional)" included={true} />
                  <FeatureItem text="Sinal PIX Antecipado (Antifaltas)" included={true} />
                  <FeatureItem text="Cálculo e Repasse Automático de Comissões" included={true} />
                  <FeatureItem text="Dashboard Avançado (Lucro Líquido e Taxas)" included={true} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <section className="py-24 bg-primary/5 border-t border-border/50 text-center px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6 tracking-tight">
              A sua agenda nunca mais será a mesma.
            </h2>
            <p className="text-xl text-muted-foreground font-medium mb-10">
              Junte-se aos profissionais que já não se preocupam com clientes fantasma. Configure o seu espaço em menos de 5 minutos.
            </p>
            <Link href="/register?plan=pro">
              <Button className="h-16 rounded-2xl px-12 text-lg font-black bg-foreground text-background hover:bg-foreground/90 shadow-lg transition-transform hover:scale-105">
                Criar Conta Agora
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-8 text-center border-t border-border">
        <p className="text-sm font-bold text-muted-foreground">
          © {new Date().getFullYear()} Stephany Kretli Development. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

function FeatureItem({ text, included }: { text: string, included: boolean }) {
  return (
    <div className={`flex items-start gap-3 ${included ? 'text-foreground' : 'text-muted-foreground/60'}`}>
      {included ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
      ) : (
        <X className="h-5 w-5 shrink-0" />
      )}
      <span className="leading-snug mt-0.5">{text}</span>
    </div>
  );
}