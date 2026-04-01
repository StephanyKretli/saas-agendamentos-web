import React from "react";

interface MagicButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function MagicButton({ children, className = "", ...props }: MagicButtonProps) {
  return (
    // O botão principal que esconde o que vazar para fora (overflow-hidden)
    <button
      className={`relative inline-flex h-12 overflow-hidden rounded-2xl p-[1px] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-95 transition-transform ${className}`}
      {...props}
    >
      {/* 🌟 A MÁGICA: O feixe de luz dourado girando no fundo */}
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f59e0b_0%,#fef3c7_50%,#f59e0b_100%)]" />
      
      {/* O fundo real do botão (preto/escuro) que fica por cima da luz, deixando apenas a borda visível */}
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-zinc-950 px-8 py-1 text-sm font-bold text-amber-500 backdrop-blur-3xl hover:bg-zinc-900 transition-colors gap-2">
        {children}
      </span>
    </button>
  );
}