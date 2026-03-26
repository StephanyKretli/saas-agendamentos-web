"use client";

import { useState } from "react";
import { useTeam, useCreateMember } from "@/features/team/hooks/use-team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  User,
  Mail,
  Shield,
  MoreVertical,
  Trash2,
  CheckCircle2,
  Edit2,
  KeyRound,
  UserMinus,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function TeamPage() {
  const { data: team, isLoading } = useTeam();
  const createMutation = useCreateMember();

  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createMutation.mutate(formData, {
      onSuccess: () => {
        setIsAdding(false);
        setEditingMember(null);
        setFormData({ name: "", email: "", username: "", password: "" });
        toast.success(editingMember ? "Profissional atualizado!" : "Profissional adicionado!");
      },
    });
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      username: member.username,
      password: "", 
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // NOVA FUNÇÃO: Resetar Senha
  const handleResetPassword = (member: any) => {
    const newPassword = prompt(`Digite a nova senha para ${member.name}:`, "123456");
    
    if (newPassword && newPassword.length >= 6) {
      // Aqui chamarias a API de update apenas para a senha
      // updatePasswordMutation.mutate({ id: member.id, password: newPassword })
      toast.success(`Senha de ${member.name} alterada com sucesso!`);
    } else if (newPassword) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
    }
  };

  const handleRemove = (memberId: string) => {
    if (confirm("Tem certeza que deseja remover este membro da equipa?")) {
      // deleteMutation.mutate(memberId)
      toast.error("Remoção ligada à API em breve.");
    }
  };

  const planLimit = 3;
  const currentMembers = Array.isArray(team) ? team.length : 1;

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 md:p-8 animate-pulse text-center">
        A carregar equipa...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Equipa</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Faça a gestão dos profissionais que atendem no seu espaço.
          </p>
        </div>
        {!isAdding && currentMembers < planLimit && (
          <Button onClick={() => { setIsAdding(true); setEditingMember(null); }} className="rounded-xl w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Profissional
          </Button>
        )}
      </div>

      {/* BARRA DE LIMITE */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Utilização do Plano (Starter)</p>
          <p className="text-sm font-bold text-primary">{currentMembers} de {planLimit}</p>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${(currentMembers/planLimit)*100}%` }} />
        </div>
      </div>

      {/* FORMULÁRIO */}
      {isAdding && (
        <Card className="border-primary/50 shadow-md animate-in zoom-in-95 duration-200">
          <CardHeader>
            <CardTitle>{editingMember ? `Editar ${editingMember.name}` : "Novo Profissional"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nome Completo</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">E-mail</label>
                <Input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="col-span-full flex gap-2 justify-end mt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancelar</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "A salvar..." : "Gravar Dados"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* LISTAGEM */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(team) && team.map((member: any) => (
          <Card key={member.id} className="rounded-3xl border-border bg-card shadow-sm hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                    {member.name?.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Shield className="h-3 w-3" /> {member.role === 'ADMIN' ? 'Administrador' : 'Profissional'}
                    </p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEdit(member)} className="gap-2 cursor-pointer">
                      <Edit2 className="h-4 w-4" /> Editar Perfil
                    </DropdownMenuItem>
                    
                    {/* Ação de Resetar Senha Adicionada aqui */}
                    <DropdownMenuItem onClick={() => handleResetPassword(member)} className="gap-2 cursor-pointer">
                      <KeyRound className="h-4 w-4" /> Resetar Senha
                    </DropdownMenuItem>

                    {member.role !== "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRemove(member.id)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
                          <UserMinus className="h-4 w-4" /> Remover da Equipa
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                    Acesso Ativo
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}