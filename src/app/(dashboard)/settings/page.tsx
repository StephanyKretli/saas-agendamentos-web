"use client";

import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { useUpdateSettings } from "@/features/settings/hooks/use-update-settings";
import { useUpdateFinancial } from "@/features/settings/hooks/use-update-financial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { 
  User, CheckCircle2, Copy, Camera, Trash2, ShieldCheck, 
  Settings as SettingsIcon, DollarSign, Percent, 
  CreditCard, AlertCircle, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { api } from "@/lib/api";

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.4 } }
};

export default function SettingsPage() {
  const { data: profile, isLoading } = useSettings();
  const isSalonOwner = !(profile as any)?.ownerId;
  // 👇 Nova trava de segurança que inclui os gerentes do salão
  const isAdmin = isSalonOwner || (profile as any)?.role === 'ADMIN'; 
  
  const adminCentralizedPayments = (profile as any)?.owner?.centralizePayments ?? false;
  
  const updateMutation = useUpdateSettings();
  const updateFinancialMutation = useUpdateFinancial();
  const [isBillingActionLoading, setIsBillingActionLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
    currentPassword: "",
    newPassword: "",
    requirePixDeposit: false,    
    pixDepositPercentage: 20,  
    mercadoPagoAccessToken: "", 
    centralizePayments: true,
    absorbPixFee: true,
    commissionType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    defaultCommissionRate: 50 as number | "",
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        username: profile.username || "",
        // @ts-ignore
        email: profile.email || "",
        // @ts-ignore
        phone: profile.phone || "",
        // @ts-ignore
        bio: profile.bio || "",
        // @ts-ignore
        avatarUrl: profile.avatarUrl || "",
        // @ts-ignore
        requirePixDeposit: profile.requirePixDeposit ?? false,
        // @ts-ignore
        pixDepositPercentage: profile.pixDepositPercentage ?? 20,
        // @ts-ignore
        mercadoPagoAccessToken: profile.mercadoPagoAccessToken || "",
        // @ts-ignore
        centralizePayments: profile.centralizePayments ?? true,
        // @ts-ignore
        absorbPixFee: profile.absorbPixFee ?? true,
        // @ts-ignore
        commissionType: profile.commissionType ?? "PERCENTAGE",
        // @ts-ignore
        defaultCommissionRate: profile.defaultCommissionRate ?? 50,
      }));
    }
  }, [profile]);

  const handleCopyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const link = `${window.location.origin}/book/${formData.username}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado com sucesso!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const settingsPayload = {
      name: formData.name,
      username: formData.username,
      requirePixDeposit: formData.requirePixDeposit,
      pixDepositPercentage: formData.pixDepositPercentage,
      mercadoPagoAccessToken: formData.mercadoPagoAccessToken,
      centralizePayments: formData.centralizePayments,
    };

    const financialPayload = {
      absorbPixFee: formData.absorbPixFee,
      commissionType: formData.commissionType,
      defaultCommissionRate: formData.defaultCommissionRate === "" ? 0 : Number(formData.defaultCommissionRate),
    };

    try {
      await Promise.all([
        updateMutation.mutateAsync(settingsPayload),
        updateFinancialMutation.mutateAsync(financialPayload)
      ]);
      toast.success("Configurações guardadas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações", error);
      toast.error("Erro ao guardar as configurações.");
    }
  };

  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  // Funções temporárias para a Assinatura (a serem ligadas ao Backend de pagamentos)
  const handleMudarPlano = async () => {
    try {
      setIsBillingActionLoading(true);
      // Pede o link ao Back-end
      const response = await api.post('/billing/subscribe', { plan: 'PRO' });
      
      // 👉 A mesma correção: extrai os dados seja qual for o formato do Axios!
      const responseData = response.data ? response.data : response;
      const url = responseData.checkoutUrl;
      
      if (url) {
        toast.success("Redirecionando para o Asaas...");
        window.location.href = url;
      } else {
        throw new Error("Link do Asaas não encontrado na resposta.");
      }
    } catch (error: any) {
      console.error("Erro no botão de Configurações:", error);
      toast.error(error.response?.data?.message || "Erro ao gerar link de pagamento.");
    } finally {
      setIsBillingActionLoading(false);
    }
  };

  const handleCancelarAssinatura = () => {
    if (confirm("Tem a certeza que deseja cancelar a sua assinatura? Perderá acesso ao painel no fim do ciclo.")) {
      toast.success("Solicitação de cancelamento iniciada.");
    }
  };

  const isSaving = updateMutation.isPending || updateFinancialMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  const inputStyle = "rounded-xl border border-border bg-card px-4 py-2.5 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none";

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-10 max-w-6xl mx-auto">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Configurações</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">Gerencie a sua identidade e a vitrine pública.</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Tabs defaultValue="perfil" className="space-y-6 sm:space-y-8 w-full">
            
            <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              <div className="w-max sm:w-fit rounded-xl bg-muted/50 p-1 border border-border/50 shadow-sm">
                <TabsList className="bg-transparent p-0 h-auto gap-1 w-full flex">
                  <TabsTrigger value="perfil" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary">Perfil</TabsTrigger>
                  <TabsTrigger value="vitrine" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary">Vitrine</TabsTrigger>
                  <TabsTrigger value="seguranca" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary">Segurança</TabsTrigger>
                  <TabsTrigger value="pagamentos" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-amber-600 data-[state=active]:text-amber-600">Financeiro & PIX</TabsTrigger>
                  {/* 👇 Botão visível para Owner e Admin 👇 */}
                  {isAdmin && (
                    <TabsTrigger value="assinatura" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-lg py-2.5 px-6 sm:px-4 text-xs sm:text-sm font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-purple-600 data-[state=active]:text-purple-600">Assinatura</TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>

            <TabsContent value="perfil" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <Card className="rounded-3xl border border-border bg-card shadow-sm p-6 flex flex-col items-center text-center gap-4 transition-all hover:shadow-md">
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center transition-all group-hover:border-primary/30">
                      {formData.avatarUrl ? <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover" /> : <User className="h-14 w-14 text-muted-foreground/40" />}
                    </div>
                    <motion.button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg transition-transform"><Camera className="h-4 w-4" /></motion.button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Foto de Perfil</h4>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Recomendado: 400x400px</p>
                  </div>
                  {formData.avatarUrl && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive text-xs hover:bg-destructive/10 font-bold mt-2" 
                      onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}
                    >
                      <Trash2 className="h-3 w-3 mr-2" /> Remover Foto
                    </Button>
                  )}
                </Card>

                <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 transition-all hover:shadow-md">
                  <div className="space-y-5 sm:space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Empresa</label>
                      <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full ${inputStyle}`} placeholder="Ex: Studio Beauty" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                      <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full ${inputStyle}`} placeholder="(11) 99999-9999" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio / Descrição</label>
                      <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={`w-full min-h-28 resize-none ${inputStyle}`} placeholder="Conte para os seus clientes o que o seu espaço oferece de melhor..." />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="vitrine" className="outline-none">
                <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 max-w-3xl">
                   <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Link de Agendamento</label>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-2.5 text-xs text-muted-foreground opacity-50 font-medium">app.com/book/</span>
                          <input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})} className={`w-full pl-24 ${inputStyle} font-semibold`} />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                          <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-10 w-full sm:w-auto px-6 font-bold shadow-sm">
                            <Copy className="h-3.5 w-3.5" /> Copiar Link
                          </Button>
                        </motion.div>
                      </div>
                      <p className="text-xs text-muted-foreground ml-1 mt-2">Este é o link público que você deve colocar na bio do seu Instagram.</p>
                    </div>
                </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="outline-none">
                <Card className="rounded-3xl border border-border bg-card shadow-sm p-5 sm:p-6 max-w-3xl">
                   <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Senha Atual</label>
                      <input type="password" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} className={`w-full ${inputStyle}`} placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                      <input type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} className={`w-full ${inputStyle}`} placeholder="Mínimo 6 caracteres" />
                    </div>
                  </div>
                </Card>
            </TabsContent>

            <TabsContent value="pagamentos" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
                
                {!isSalonOwner && adminCentralizedPayments && (
                  <Card className="rounded-3xl border border-border bg-muted/30 shadow-sm p-8 flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-4 shadow-inner">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-black text-foreground">Recebimentos e Repasses</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md font-medium">
                      As regras financeiras e a cobrança de PIX são geridas exclusivamente pela administração do salão.
                    </p>
                  </Card>
                )}

                {(isSalonOwner || (!isSalonOwner && !adminCentralizedPayments)) && (
                  <Card className="rounded-3xl border border-amber-500/20 shadow-xl overflow-hidden ring-1 ring-amber-500/10">
                    <div className="bg-amber-500/10 p-5 sm:p-6 border-b border-amber-500/10 flex items-start gap-4">
                      <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-600 shrink-0 shadow-inner"><ShieldCheck className="h-6 w-6" /></div>
                      <div>
                        <h2 className="text-lg font-black text-foreground">Proteção Contra Faltas</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Configure a cobrança de um sinal via PIX para garantir o comparecimento dos clientes.</p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 space-y-6 bg-card">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <label className="text-sm font-bold text-foreground">Cobrar PIX Antecipado (Sinal)</label>
                          <p className="text-xs text-muted-foreground mt-1 font-medium">Exija um pagamento parcial no momento do agendamento online.</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={formData.requirePixDeposit} onChange={(e) => setFormData({...formData, requirePixDeposit: e.target.checked})} />
                          <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                      </div>

                      <AnimatePresence>
                        {formData.requirePixDeposit && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="space-y-8 p-6 mt-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                              
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-bold text-foreground">Percentagem do Sinal</label>
                                  <span className="text-3xl font-black text-amber-600">{formData.pixDepositPercentage}%</span>
                                </div>
                                <input type="range" min="5" max="100" step="5" value={formData.pixDepositPercentage} onChange={(e) => setFormData({...formData, pixDepositPercentage: Number(e.target.value)})} className="w-full h-2.5 bg-amber-500/20 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                                <div className="flex justify-between text-xs font-bold text-muted-foreground/60">
                                  <span>5%</span><span>50%</span><span>100%</span>
                                </div>
                              </div>

                              <hr className="border-border/50" />

                              <div className="space-y-4">
                                <label className="text-sm font-bold text-foreground">
                                  Mercado Pago Access Token
                                </label>
                                
                                <div className="rounded-2xl border border-amber-500/20 bg-white/50 dark:bg-black/20 p-5 space-y-4 shadow-sm">
                                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-600/80">Como obter o seu token:</h4>
                                  <ol className="list-decimal list-inside text-sm text-foreground/80 space-y-3 font-medium marker:text-amber-500 marker:font-black">
                                    <li>Acesse ao <a href="https://www.mercadopago.com.br/developers/panel/credentials" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-500 hover:underline font-bold transition-all">Painel de Desenvolvedores</a> do Mercado Pago.</li>
                                    <li>Crie uma nova aplicação (se ainda não tiver uma).</li>
                                    <li>No menu lateral esquerdo, vá a <strong>Credenciais de Produção</strong>.</li>
                                    <li>Copie a chave <strong>Access token</strong> <span className="text-xs text-muted-foreground">(começa com APP_USR)</span>.</li>
                                  </ol>
                                </div>

                                <input 
                                  type="password" 
                                  placeholder="Cole a sua chave APP_USR-... aqui"
                                  value={formData.mercadoPagoAccessToken}
                                  onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})}
                                  className={`w-full ${inputStyle} font-mono text-sm h-12 border-amber-500/30 focus:border-amber-500/60 focus:ring-amber-500/20`}
                                />
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                )}

                {isSalonOwner && (
                  <Card className="rounded-3xl border border-primary/20 shadow-xl overflow-hidden ring-1 ring-primary/10">
                    <div className="bg-primary/5 p-5 sm:p-6 border-b border-primary/10 flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0 shadow-inner"><DollarSign className="h-6 w-6" /></div>
                      <div>
                        <h2 className="text-lg font-black text-foreground">Repasses e Comissões</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Defina como o salão lida com as taxas e o pagamento da equipe.</p>
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-6 space-y-8 bg-card">
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
                        <div>
                          <label className="text-sm font-bold text-foreground">Centralizar Pagamentos da Equipe</label>
                          <p className="text-xs text-muted-foreground mt-1 max-w-md font-medium">Todo o dinheiro entra na sua conta para posterior repasse.</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center shrink-0 mt-2 sm:mt-0">
                          <input type="checkbox" className="peer sr-only" checked={formData.centralizePayments} onChange={(e) => setFormData({...formData, centralizePayments: e.target.checked})} />
                          <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">Absorver Taxa do PIX</h3>
                          <p className="text-xs text-muted-foreground max-w-md">Se desativado, a taxa do Mercado Pago é descontada antes de calcular a comissão do profissional.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input type="checkbox" className="sr-only peer" checked={formData.absorbPixFee} onChange={(e) => setFormData({...formData, absorbPixFee: e.target.checked})} />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tipo de Comissão</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="commissionType" value="PERCENTAGE" checked={formData.commissionType === "PERCENTAGE"} onChange={() => setFormData({...formData, commissionType: "PERCENTAGE"})} className="text-primary focus:ring-primary h-4 w-4" />
                              <span className="text-sm font-medium">Porcentagem (%)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="commissionType" value="FIXED" checked={formData.commissionType === "FIXED"} onChange={() => setFormData({...formData, commissionType: "FIXED"})} className="text-primary focus:ring-primary h-4 w-4" />
                              <span className="text-sm font-medium">Fixo (R$)</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3 relative">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {formData.commissionType === "PERCENTAGE" ? "Taxa Padrão" : "Valor Padrão"}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              {formData.commissionType === "PERCENTAGE" ? <Percent className="h-4 w-4 text-muted-foreground" /> : <span className="text-muted-foreground text-sm font-bold">R$</span>}
                            </div>
                            <input type="number" min="0" step={formData.commissionType === "PERCENTAGE" ? "1" : "0.01"} placeholder="Ex: 50" value={formData.defaultCommissionRate} onChange={(e) => setFormData({...formData, defaultCommissionRate: e.target.value ? Number(e.target.value) : ""})} className={`w-full pl-10 ${inputStyle}`} />
                          </div>
                        </div>
                      </div>

                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {/* 👇 Aba visível para Owner e Admin 👇 */}
            {isAdmin && (
              <TabsContent value="assinatura" className="outline-none">
                <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
                  <Card className="rounded-3xl border border-purple-500/20 shadow-xl overflow-hidden ring-1 ring-purple-500/10">
                    <div className="bg-purple-500/10 p-5 sm:p-6 border-b border-purple-500/10 flex items-start gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-600 shrink-0 shadow-inner">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-foreground">Assinatura e Plano</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Faça a gestão do seu plano no sistema.</p>
                      </div>
                    </div>
                    
                    <div className="p-5 sm:p-6 space-y-6 bg-card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 gap-4">
                        <div>
                          <p className="text-sm font-bold text-purple-600/80 uppercase tracking-wider">O seu plano atual</p>
                          <div className="flex items-center gap-3 mt-1">
                            {/* @ts-ignore */}
                            <h3 className="text-3xl font-black text-foreground capitalize">{profile?.plan || 'Starter'}</h3>
                            {/* @ts-ignore */}
                            {profile?.plan === 'PRO' && (
                               <span className="flex items-center gap-1.5 text-xs font-black bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
                                 <Sparkles className="h-3.5 w-3.5" /> Ilimitado
                               </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            type="button"
                            onClick={handleMudarPlano} 
                            className="rounded-xl font-bold shadow-sm bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Gerir Plano
                          </Button>
                        </div>
                      </div>

                      {/* ZONA DE PERIGO (Usando Tailwind puro para evitar dependência do shadcn Alert) */}
                      <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 flex gap-4">
                        <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                        <div className="w-full">
                          <h4 className="font-bold text-destructive text-lg">Zona de Perigo</h4>
                          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <span className="text-sm text-destructive/90 font-medium">
                              Ao cancelar a assinatura, você perderá acesso ao painel no final do ciclo de faturamento atual. A sua vitrine pública também será desativada.
                            </span>
                            <Button 
                              type="button"
                              variant="destructive" 
                              onClick={handleCancelarAssinatura}
                              className="rounded-xl font-bold whitespace-nowrap shadow-sm"
                            >
                              Cancelar Assinatura
                            </Button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

          </Tabs>
        </motion.div>

        {/* Barra de Salvar flutuante - Apenas para abas de configuração que exigem submissão */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:pt-8 flex justify-end z-40">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button type="submit" disabled={isSaving} className="h-12 w-full sm:w-auto rounded-2xl px-12 text-sm font-bold shadow-sm transition-all">
              {isSaving ? "A guardar..." : "Salvar Alterações"}
              {!isSaving && <CheckCircle2 className="ml-2 h-4 w-4" />}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}