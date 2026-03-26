"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, User, Mail, Shield, MoreVertical, Trash2 } from "lucide-react";

export default function TeamPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os profissionais e permissões da sua empresa.
          </p>
        </div>
        <Button onClick={() => setIsInviteModalOpen(true)} className="rounded-xl w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Profissional
        </Button>
      </div>

      {/* GRID DE MEMBROS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Exemplo de Card de Membro */}
        <Card className="rounded-3xl border-border bg-card shadow-sm transition-all hover:border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  JS
                </div>
                <div>
                  <p className="font-bold text-foreground">João Silva</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Admin
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                joao@email.com
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-xs font-medium text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                  Ativo
                </span>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4 mr-2" /> Remover
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}