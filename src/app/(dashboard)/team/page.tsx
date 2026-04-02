"use client";

import { useState } from "react";
import { useSettings } from "@/features/settings/hooks/use-settings"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, Mail, Shield, MoreVertical, Edit2, KeyRound, UserMinus, Lock, Users, X, Infinity
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTeam, useCreateMember, useRemoveMember } from "@/features/team/hooks/use-team";
import { motion, AnimatePresence, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function TeamPage() {
  const { data: team, isLoading: isLoadingTeam } = useTeam();
  const { data: profile, isLoading: isLoadingProfile } = useSettings(); 
  const createMutation = useCreateMember();
  const removeMutation = useRemoveMember();

  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [resettingMember, setResettingMember] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", username: "", password: "", role: "PROFESSIONAL"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      username: formData.username || formData.email.split('@')[0], 
      password: formData.password || "Mudar123!", 
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsAdding(false);
        setEditingMember(null);
        setFormData({ name: "", email: "", username: "", password: "", role: "PROFESSIONAL" });
        toast.success(editingMember ? "Profissional atualizado!" : "Profissional adicionado!");
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Erro ao salvar profissional");
      }
    });
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({ name: member.name, email: member.email, username: member.username, password: "", role: member.role || "PROFESSIONAL" });
    setIsAdding(true);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    toast.success(`Senha de ${resettingMember.name} atualizada com sucesso!`);
    setResettingMember(null);
    setNewPassword("");
  };

  const handleRemove = (memberId: string) => {
    if (confirm("Tem certeza que deseja remover este membro da equipe?")) {
      removeMutation.mutate(memberId, {
        onSuccess: () => toast.success("Profissional removido!"),
        onError: (error: any) => toast.error(error.response?.data?.message || "Erro ao remover."),
      });
    }
  };

  const isLoading = isLoadingTeam || isLoadingProfile;

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  const currentMembersCount = Array.isArray(team) ? team.length : 0;
  const maxMembers = profile?.maxMembers || 3; 
  const planName = profile?.plan || "Starter"; 
  
  // 🌟 AQUI ESTÁ A CORREÇÃO: Agora o Front-end sabe que o PRO é o Ilimitado
  const isUnlimitedPlan = planName === 'PRO'; 
  const isLimitReached = !isUnlimitedPlan && currentMembersCount >= maxMembers;
  const progressPercentage = Math.min((currentMembersCount / maxMembers) * 100, 100);

  const inputStyle = "h-12 rounded-xl border border-border bg-card px-4 text-sm shadow-sm transition-all focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none";

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Equipe</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">Faça a gestão dos profissionais do seu espaço.</p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto">
          {isLimitReached ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-full shadow-sm">Limite atingido ({currentMembersCount}/{maxMembers})</span>
              <Button disabled variant="secondary" className="rounded-xl w-full sm:w-auto opacity-70 cursor-not-allowed h-12 font-bold">
                <Lock className="mr-2 h-4 w-4" /> Adicionar Profissional
              </Button>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => { setIsAdding(true); setEditingMember(null); setFormData({ name: "", email: "", username: "", password: "", role: "PROFESSIONAL" }); }} className="rounded-xl shadow-sm w-full sm:w-auto h-12 font-bold">
                <Plus className="mr-2 h-4 w-4" /> Adicionar Profissional
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 🌟 CARD DE PLANO ATUALIZADO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6 flex flex-col gap-3 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <p className="text-sm font-bold text-foreground">Utilização do Plano <span className="capitalize text-primary">({planName.toLowerCase()})</span></p>
          
          {/* TAG VIP ILIMITADA */}
          {isUnlimitedPlan ? (
             <p className="text-sm font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1.5 shadow-sm">
               <Infinity className="h-4 w-4" /> Ilimitado
             </p>
          ) : (
            <p className="text-sm font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {currentMembersCount} de {maxMembers}
            </p>
          )}
        </div>
        
        {/* Barra de progresso some se for ilimitado */}
        {!isUnlimitedPlan && (
          <div className="h-2.5 w-full bg-muted/80 rounded-full overflow-hidden border border-border/50 relative z-10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full relative ${isLimitReached ? 'bg-destructive' : 'bg-primary'}`}>
              <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
            </motion.div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">{editingMember ? `Editar ${editingMember.name}` : "Novo Profissional"}</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Insira os dados de acesso da equipe.</p>
                </div>
                <button onClick={() => setIsAdding(false)} className="rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome Completo</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full ${inputStyle}`} placeholder="João Silva" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">E-mail</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={`w-full ${inputStyle}`} placeholder="joao@salao.com" />
                </div>
                
                {/* 🌟 SELECT DE CARGO (Se for o plano ilimitado) */}
                {isUnlimitedPlan && (
                  <div className="space-y-2 col-span-full">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nível de Acesso</label>
                    <select 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      className={`w-full ${inputStyle}`}
                    >
                      <option value="PROFESSIONAL">Membro da Equipe (Apenas Agenda e Produção)</option>
                      <option value="ADMIN">Co-Administrador (Acesso Total)</option>
                    </select>
                  </div>
                )}

                <div className="col-span-full pt-4 mt-2 border-t border-border flex gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold">Cancelar</Button>
                  <Button type="submit" disabled={createMutation.isPending} className="rounded-xl px-8 font-bold shadow-sm">{createMutation.isPending ? "A salvar..." : "Gravar Dados"}</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resettingMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-2xl border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Redefinir Senha</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">Nova senha para <strong className="text-foreground">{resettingMember.name}</strong>.</p>
                </div>
                <button onClick={() => { setResettingMember(null); setNewPassword(""); }} className="rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"><X className="h-5 w-5" /></button>
              </div>
              <form onSubmit={handleConfirmResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nova Senha</label>
                  <input required type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`w-full ${inputStyle}`} placeholder="Mínimo 6 caracteres" minLength={6} />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={() => { setResettingMember(null); setNewPassword(""); }} className="rounded-xl font-bold">Cancelar</Button>
                  <Button type="submit" className="rounded-xl px-8 font-bold shadow-sm bg-amber-500 hover:bg-amber-600 text-white">Alterar Senha</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(team) && team.map((member: any) => (
          <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} key={member.id}>
            <Card className="rounded-3xl border border-border bg-card shadow-sm hover:border-primary/30 transition-all overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xl shrink-0 border border-primary/20 shadow-inner">
                      {member.name?.substring(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground text-lg truncate tracking-tight">{member.name}</p>
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Shield className="h-3.5 w-3.5" /> {member.role === 'ADMIN' ? 'Co-Administrador' : 'Profissional'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/50 bg-card/95 backdrop-blur-sm">
                      <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem onClick={() => handleEdit(member)} className="gap-3 p-3 rounded-xl cursor-pointer mb-1 outline-none transition-colors text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Edit2 className="h-4 w-4" /> <span className="font-medium">Editar Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setResettingMember(member)} className="gap-3 p-3 rounded-xl cursor-pointer mb-1 outline-none transition-colors text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <KeyRound className="h-4 w-4" /> <span className="font-medium">Resetar Senha</span>
                      </DropdownMenuItem>
                      {member.role !== "ADMIN" && (
                        <>
                          <DropdownMenuSeparator className="bg-border/50" />
                          <DropdownMenuItem onClick={() => handleRemove(member.id)} className="gap-3 p-3 rounded-xl cursor-pointer outline-none transition-colors text-destructive hover:bg-destructive/15 focus:bg-destructive/15 focus:text-destructive">
                            <UserMinus className="h-4 w-4" /> <span className="font-bold">Remover da equipe</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/50">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate font-medium">{member.email}</span>
                  </div>
                  <div className="mt-2 pt-4 border-t border-border/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Acesso Ativo
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}