import { Skeleton } from "@/components/ui/skeleton";

export function ClientsSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Geramos 5 cards de "esqueleto" para preencher a tela enquanto carrega */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Bloco de Informações (Esquerda) */}
            <div className="space-y-3 flex-1">
              {/* Nome do Cliente */}
              <Skeleton className="h-6 w-48 rounded-md" />
              
              <div className="space-y-2">
                {/* Telefone */}
                <Skeleton className="h-4 w-32 rounded-md opacity-70" />
                {/* Email */}
                <Skeleton className="h-4 w-40 rounded-md opacity-70" />
              </div>
            </div>

            {/* Bloco do Botão (Direita) */}
            <div className="flex-none">
              <Skeleton className="h-10 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}