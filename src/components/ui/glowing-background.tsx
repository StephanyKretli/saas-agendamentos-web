"use client";

import React from "react";
import { motion } from "framer-motion";

export function GlowingBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950 transition-colors duration-500">
      
      {/* 🌟 Orbe 1: Roxo/Rosa (Canto Superior Esquerdo) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 dark:bg-fuchsia-600/20 blur-[100px] pointer-events-none"
      />
      
      {/* 🌟 Orbe 2: Âmbar/Dourado (Canto Superior Direito) */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -50, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/20 dark:bg-amber-600/20 blur-[100px] pointer-events-none"
      />
      
      {/* 🌟 Orbe 3: Azul/Verde (Na parte de baixo) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-blue-500/20 dark:bg-emerald-600/20 blur-[100px] pointer-events-none"
      />
      
      {/* 🌟 Efeito de vidro por cima de tudo para suavizar (Opcional, mas fica lindo) */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-[2px] pointer-events-none" />

      {/* 🌟 Onde o formulário vai aparecer, subindo suavemente */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full flex justify-center p-4"
      >
        {children}
      </motion.div>
    </div>
  );
}