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
  CreditCard, AlertCircle, Sparkles, MessageCircle, Store, Lock
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion"; 
import { api } from "@/lib/api";

import { WhatsappConnect } from "@/components/whatsapp/whatsapp-connect";

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24, duration: 0.4 } }
};

export default function SettingsPage() {
  const { data: profile, isLoading } = useSettings();
  const isSalonOwner = !(profile as any)?.ownerId;
  const isAdmin = isSalonOwner || (profile as any)?.role === 'ADMIN'; 
  const adminCentralizedPayments = (profile as any)?.owner?.centralizePayments ?? false;
  const isProPlan = (profile as any)?.plan === 'PRO';
  
  const salonId = profile ? (isSalonOwner ? (profile as any).id : (profile as any).ownerId) : "";
  
  const updateMutation = useUpdateSettings();
  const updateFinancialMutation = useUpdateFinancial();
  const [isBillingActionLoading, setIsBillingActionLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    document: "", // 👈 NOVO ESTADO AQUI
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
        document: profile.document || "", // 👈 CARREGA O DOCUMENTO DO BANCO
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, avatarUrl: previewUrl }));

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      toast.loading("A carregar foto...", { id: "upload-avatar" });
      const response = await api.patch('/settings/avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Foto de perfil atualizada!", { id: "upload-avatar" });
      if ((response as any).data?.avatarUrl) {
        setFormData(prev => ({ ...prev, avatarUrl: (response as any).data.avatarUrl }));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "A imagem é muito grande. Tente até 2MB.", { id: "upload-avatar" });
      setFormData(prev => ({ ...prev, avatarUrl: profile?.avatarUrl || "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const settingsPayload = {
      name: formData.name,
      username: formData.username,
      phone: formData.phone,
      document: formData.document, // 👈 ENVIANDO PARA A API
      bio: formData.bio,            
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

  const handleGerirPagamento = async () => {
    try {
      setIsBillingActionLoading(true);
      const response = await api.get('/billing/manage');
      const responseData = response as any;
      const url = responseData.manageUrl || responseData.data?.manageUrl;
      
      if (url) {
        toast.success("Redirecionando para o portal seguro...");
        window.open(url, '_blank'); 
      } else {
        throw new Error("Link do Asaas não encontrado.");
      }
    } catch (error: any) {
      console.error("Erro no botão de Configurações:", error);
      toast.error(error.response?.data?.message || "Erro ao acessar portal de pagamento. Preencha seu CPF nos dados pessoais primeiro.");
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
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">A carregar configurações...</p>
        </div>
      </div>
    );
  }

  const inputStyle = "rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm shadow-sm transition-all focus:border-primary/50 focus:bg-card focus:ring-1 focus:ring-primary/20 outline-none hover:border-border";

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-12 max-w-6xl mx-auto px-4 sm:px-0">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 shadow-sm">
            <SettingsIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Configurações</h1>
            <p className="mt-1 text-base text-muted-foreground font-medium">Faça a gestão da sua identidade, vitrine pública e integrações.</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          
          <Tabs defaultValue="perfil" className="space-y-8 w-full">
            
            <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
              <div className="w-max sm:w-fit rounded-2xl bg-muted/40 p-1.5 border border-border/50 shadow-sm">
                <TabsList className="bg-transparent p-0 h-auto gap-1.5 w-full flex">
                  
                  <TabsTrigger value="perfil" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                    <User className="h-4 w-4" /> Perfil
                  </TabsTrigger>
                  
                  <TabsTrigger value="vitrine" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                    <Store className="h-4 w-4" /> Vitrine
                  </TabsTrigger>

                  <TabsTrigger value="whatsapp" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-green-600 text-muted-foreground flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </TabsTrigger>
                  
                  <TabsTrigger value="pagamentos" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-amber-600/70 data-[state=active]:text-amber-600 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Financeiro
                  </TabsTrigger>

                  <TabsTrigger value="seguranca" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all data-[state=active]:text-primary flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Segurança
                  </TabsTrigger>
                  
                  {isAdmin && (
                    <TabsTrigger value="assinatura" onClick={handleTabClick} className="flex-1 sm:flex-none sm:min-w-30 rounded-xl py-2.5 px-5 text-sm font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all text-purple-600/70 data-[state=active]:text-purple-600 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Assinatura
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>

            {/* CONTEÚDO: PERFIL */}
            <TabsContent value="perfil" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="grid gap-6 lg:grid-cols-[300px_1fr]">
                
                <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 flex flex-col items-center justify-center text-center gap-4 transition-all hover:shadow-md hover:border-primary/20">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="h-32 w-32 rounded-full border-4 border-muted overflow-hidden bg-muted flex items-center justify-center transition-all group-hover:border-primary/30 group-hover:shadow-md">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Preview" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <User className="h-14 w-14 text-muted-foreground/40" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 p-3 bg-primary text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-110">
                      <Camera className="h-4 w-4" />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  </div>
                  <div className="mt-2">
                    <h4 className="text-base font-bold text-foreground">Foto de Perfil</h4>
                    <p className="text-xs text-muted-foreground mt-1 font-medium">Recomendado: 400x400px</p>
                  </div>
                  {formData.avatarUrl && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive text-xs hover:bg-destructive/10 font-bold mt-1" onClick={() => setFormData(prev => ({ ...prev, avatarUrl: "" }))}>
                      <Trash2 className="h-3 w-3 mr-2" /> Remover Foto
                    </Button>
                  )}
                </Card>

                {/* Cartão de Dados Pessoais COM O NOVO CAMPO */}
                <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 transition-all hover:shadow-md">
                  <div className="space-y-6 sm:space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome da Empresa</label>
                        <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyle} placeholder="Ex: Studio Beauty" />
                      </div>
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">WhatsApp</label>
                        <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={inputStyle} placeholder="(11) 99999-9999" />
                      </div>
                    </div>
                    
                    {/* 👈 O NOVO CAMPO DE DOCUMENTO 👈 */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CPF ou CNPJ</label>
                        <input 
                          value={formData.document} 
                          onChange={(e) => setFormData({...formData, document: e.target.value.replace(/\D/g, '')})} 
                          className={inputStyle} 
                          placeholder="Apenas números (Ex: 12345678909)" 
                          maxLength={14} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio / Descrição</label>
                      <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className={`w-full min-h-[120px] resize-none ${inputStyle}`} placeholder="Conte para os seus clientes o que o seu espaço oferece de melhor..." />
                    </div>
                  </div>
                </Card>

              </motion.div>
            </TabsContent>

            <TabsContent value="vitrine" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
                <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="bg-primary/10 p-3 rounded-2xl text-primary"><Store className="h-6 w-6" /></div>
                    <div>
                      <h2 className="text-xl font-black text-foreground">A sua Vitrine Online</h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">Personalize o link que os seus clientes usam para agendar.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Link de Agendamento Público</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-3.5 text-sm text-muted-foreground opacity-60 font-medium">app.com/book/</span>
                        <input value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '-')})} className={`w-full pl-[110px] ${inputStyle} font-semibold text-primary`} />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                        <Button type="button" variant="outline" onClick={handleCopyLink} className="rounded-xl gap-2 h-[46px] w-full sm:w-auto px-8 font-bold shadow-sm border-border hover:bg-muted">
                          <Copy className="h-4 w-4" /> Copiar
                        </Button>
                      </motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground ml-1 mt-2">Dica: Coloque este link na bio do seu Instagram ou TikTok para facilitar as marcações.</p>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="whatsapp" className="outline-none">
               <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
                  <div className="flex justify-center sm:justify-start">
                    <WhatsappConnect salonId={salonId} />
                  </div>
               </motion.div>
            </TabsContent>

            <TabsContent value="seguranca" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
                <Card className="rounded-3xl border border-border/50 bg-card shadow-sm p-6 sm:p-8 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 mb-6 pb-6 border-b border-border/50">
                    <div className="bg-muted p-3 rounded-2xl text-foreground"><Lock className="h-6 w-6" /></div>
                    <div>
                      <h2 className="text-xl font-black text-foreground">Segurança da Conta</h2>
                      <p className="text-sm text-muted-foreground mt-1 font-medium">Atualize a sua senha de acesso ao painel.</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Senha Atual</label>
                      <input type="password" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} className={inputStyle} placeholder="••••••••" />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                      <input type="password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} className={inputStyle} placeholder="Mínimo 6 caracteres" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="pagamentos" className="outline-none">
              <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="space-y-6 max-w-3xl">
                
                {!isSalonOwner && adminCentralizedPayments && (
                  <Card className="rounded-3xl border border-border/50 bg-muted/20 shadow-sm p-10 flex flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-5 shadow-inner">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-black text-foreground">Gestão Centralizada</h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md font-medium leading-relaxed">
                      As regras financeiras e a cobrança de PIX são geridas exclusivamente pela administração do salão. As suas comissões serão repassadas pela gerência.
                    </p>
                  </Card>
                )}

                {(isSalonOwner || (!isSalonOwner && !adminCentralizedPayments)) && (
                  <Card className={`rounded-3xl border shadow-lg overflow-hidden transition-all mt-8 ${isProPlan ? 'border-amber-500/20 ring-1 ring-amber-500/10 hover:shadow-xl' : 'border-border/50'}`}>
                    <div className={`p-6 border-b flex items-start gap-4 ${isProPlan ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/10' : 'bg-muted/30 border-border/50'}`}>
                      <div className={`p-3 rounded-2xl shrink-0 shadow-inner ${isProPlan ? 'bg-amber-500/20 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                        <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className={`text-xl font-black ${isProPlan ? 'text-foreground' : 'text-muted-foreground'}`}>Proteção Contra Faltas</h2>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Configure a cobrança de um sinal via PIX para garantir o comparecimento dos clientes.</p>
                        </div>
                        {!isProPlan && (
                          <span className="flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                            <Lock className="h-3 w-3" /> PRO
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`p-6 sm:p-8 space-y-6 bg-card transition-all ${!isProPlan ? 'opacity-50 pointer-events-none select-none grayscale-[50%]' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
                        <div className="max-w-md">
                          <label className="text-base font-bold text-foreground">Cobrar PIX Antecipado (Sinal)</label>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Exija um pagamento parcial no momento do agendamento online. Se o cliente não pagar em 15 minutos, a vaga é libertada.</p>
                        </div>
                        <label className="relative inline-flex items-center shrink-0 cursor-pointer">
                          <input type="checkbox" className="peer sr-only" checked={formData.requirePixDeposit} onChange={(e) => setFormData({...formData, requirePixDeposit: e.target.checked})} />
                          <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <AnimatePresence>
                        {formData.requirePixDeposit && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="space-y-8 p-6 mt-2 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-inner">
                              <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-bold text-foreground">Percentagem do Sinal</label>
                                  <span className="text-4xl font-black text-amber-600">{formData.pixDepositPercentage}%</span>
                                </div>
                                <input type="range" min="5" max="100" step="5" value={formData.pixDepositPercentage} onChange={(e) => setFormData({...formData, pixDepositPercentage: Number(e.target.value)})} className="w-full h-3 bg-amber-500/20 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                                <div className="flex justify-between text-xs font-bold text-muted-foreground/60 px-1">
                                  <span>5%</span><span>50%</span><span>100%</span>
                                </div>
                              </div>
                              <hr className="border-amber-500/10" />
                              <div className="space-y-4">
                                <label className="text-sm font-bold text-foreground">Mercado Pago Access Token</label>
                                <input type="password" placeholder="Cole a sua chave APP_USR-... aqui" value={formData.mercadoPagoAccessToken} onChange={(e) => setFormData({...formData, mercadoPagoAccessToken: e.target.value})} className={`w-full ${inputStyle} font-mono text-sm h-12 border-amber-500/30 focus:border-amber-500 focus:ring-amber-500/20`} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                )}

                {isSalonOwner && (
                  <Card className={`rounded-3xl border shadow-lg overflow-hidden transition-all mt-8 ${isProPlan ? 'border-primary/20 ring-1 ring-primary/10 hover:shadow-xl' : 'border-border/50'}`}>
                    <div className={`p-6 border-b flex items-start gap-4 ${isProPlan ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/10' : 'bg-muted/30 border-border/50'}`}>
                      <div className={`p-3 rounded-2xl shrink-0 shadow-inner ${isProPlan ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className={`text-xl font-black ${isProPlan ? 'text-foreground' : 'text-muted-foreground'}`}>Repasses e Comissões</h2>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Defina as regras financeiras da sua equipe.</p>
                        </div>
                        {!isProPlan && (
                          <span className="flex items-center gap-1 text-[10px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                            <Lock className="h-3 w-3" /> PRO
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={`p-6 sm:p-8 space-y-8 bg-card transition-all ${!isProPlan ? 'opacity-50 pointer-events-none select-none grayscale-[50%]' : ''}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border/50">
                        <div className="max-w-md">
                          <label className="text-base font-bold text-foreground">Centralizar Pagamentos</label>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Se ativo, todo o valor dos agendamentos entra na conta do salão (Mercado Pago acima) para posterior repasse aos profissionais.</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={formData.centralizePayments} onChange={(e) => setFormData({...formData, centralizePayments: e.target.checked})} />
                          <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-border/50">
                        <div className="max-w-md">
                          <label className="text-base font-bold text-foreground">Absorver Taxa do PIX</label>
                          <p className="text-sm text-muted-foreground mt-1 font-medium">Se desativado, a taxa de 0.99% cobrada pelo Mercado Pago é descontada do total antes de calcular a comissão da equipe.</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={formData.absorbPixFee} onChange={(e) => setFormData({...formData, absorbPixFee: e.target.checked})} />
                          <div className="peer h-7 w-14 rounded-full bg-muted/60 border border-border after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow-sm after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:border-primary peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Tipo de Comissão</label>
                          <div className="flex gap-4 p-1 bg-muted/30 rounded-xl">
                            <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg cursor-pointer transition-all ${formData.commissionType === "PERCENTAGE" ? "bg-card shadow-sm ring-1 ring-border text-foreground font-bold" : "text-muted-foreground hover:bg-muted/50 font-medium"}`}>
                              <input type="radio" name="commissionType" value="PERCENTAGE" checked={formData.commissionType === "PERCENTAGE"} onChange={() => setFormData({...formData, commissionType: "PERCENTAGE"})} className="hidden" />
                              <Percent className="h-4 w-4" /> Porcentagem
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg cursor-pointer transition-all ${formData.commissionType === "FIXED" ? "bg-card shadow-sm ring-1 ring-border text-foreground font-bold" : "text-muted-foreground hover:bg-muted/50 font-medium"}`}>
                              <input type="radio" name="commissionType" value="FIXED" checked={formData.commissionType === "FIXED"} onChange={() => setFormData({...formData, commissionType: "FIXED"})} className="hidden" />
                              <DollarSign className="h-4 w-4" /> Fixo (R$)
                            </label>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                            {formData.commissionType === "PERCENTAGE" ? "Taxa Base Padrão" : "Valor Base Padrão"}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              {formData.commissionType === "PERCENTAGE" ? <Percent className="h-4 w-4 text-muted-foreground" /> : <span className="text-muted-foreground text-sm font-bold">R$</span>}
                            </div>
                            <input type="number" min="0" step={formData.commissionType === "PERCENTAGE" ? "1" : "0.01"} placeholder="Ex: 50" value={formData.defaultCommissionRate} onChange={(e) => setFormData({...formData, defaultCommissionRate: e.target.value ? Number(e.target.value) : ""})} className={`w-full pl-12 h-[52px] text-lg font-semibold ${inputStyle}`} />
                          </div>
                          <p className="text-xs text-muted-foreground ml-1">Regra base. Pode ser sobrescrita em cada serviço individualmente.</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="assinatura" className="outline-none">
                <motion.div variants={tabContentVariants} initial="hidden" animate="visible" className="max-w-3xl">
                  <Card className="rounded-3xl border border-purple-500/20 shadow-lg overflow-hidden ring-1 ring-purple-500/10">
                    <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 p-6 border-b border-purple-500/10 flex items-start gap-4">
                      <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-600 shrink-0 shadow-inner">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-foreground">Gestão da Assinatura</h2>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Controle o seu plano e os dados de faturação.</p>
                      </div>
                    </div>
                    
                    <div className="p-6 sm:p-8 space-y-8 bg-card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 gap-6 shadow-sm">
                        <div>
                          <p className="text-xs font-bold text-purple-600/80 uppercase tracking-wider">O seu plano atual</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            {/* @ts-ignore */}
                            <h3 className="text-3xl font-black text-foreground capitalize tracking-tight">{profile?.plan || 'Starter'}</h3>
                            {/* @ts-ignore */}
                            {profile?.plan === 'PRO' && (
                               <span className="flex items-center gap-1.5 text-xs font-black bg-amber-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                                 <Sparkles className="h-3.5 w-3.5" /> Ilimitado
                               </span>
                            )}
                          </div>
                        </div>
                        
                        <Button type="button" onClick={handleGerirPagamento} disabled={isBillingActionLoading} className="rounded-xl font-bold shadow-md bg-purple-600 hover:bg-purple-700 text-white h-12 px-6">
                          {isBillingActionLoading ? "A redirecionar..." : "Portal de Pagamentos"}
                        </Button>
                      </div>

                      <div className="mt-8 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 flex flex-col sm:flex-row gap-5">
                        <div className="bg-destructive/10 p-3 rounded-full shrink-0 h-fit">
                          <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="w-full space-y-4">
                          <div>
                            <h4 className="font-black text-destructive text-lg">Cancelar Assinatura</h4>
                            <p className="text-sm text-destructive/80 font-medium mt-1 leading-relaxed">
                              Ao cancelar a assinatura, você perderá o acesso ao painel de gestão no final do ciclo de faturação atual. A sua vitrine pública também será desativada.
                            </p>
                          </div>
                          <Button type="button" variant="destructive" onClick={handleCancelarAssinatura} className="rounded-xl font-bold shadow-sm w-full sm:w-auto h-11 px-6">
                            Cancelar Assinatura
                          </Button>
                        </div>
                      </div>

                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            )}

          </Tabs>
        </motion.div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 sm:static sm:bg-transparent sm:border-0 sm:p-0 sm:pt-10 flex justify-end z-40">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto shadow-xl sm:shadow-none rounded-2xl">
            <Button type="submit" disabled={isSaving} className="h-14 w-full sm:w-auto rounded-2xl px-12 text-base font-bold shadow-md transition-all">
              {isSaving ? "A guardar as alterações..." : "Salvar Configurações"}
              {!isSaving && <CheckCircle2 className="ml-2 h-5 w-5" />}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
}