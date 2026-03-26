"use client";

import React from "react";

type TimelineRowProps = {
  time: string;
  isCurrentHour?: boolean;
  children: React.ReactNode;
};

export function TimelineRow({
  time,
  isCurrentHour,
  children,
}: TimelineRowProps) {
  return (
    <div className="flex gap-4">
      {/* Coluna do Horário */}
      <div className="relative flex w-12 flex-col items-center">
        <span
          className={`text-xs font-bold transition-colors ${
            isCurrentHour
              ? "rounded-full bg-primary px-2 py-1 text-primary-foreground shadow-sm"
              : "text-muted-foreground"
          }`}
        >
          {time}
        </span>
        
        {/* Linha vertical conectora */}
        <div className="mt-2 w-px flex-1 bg-border" />
      </div>

      {/* Coluna do Conteúdo (Cards) */}
      <div
        className={`flex-1 pb-6 transition-all ${
          isCurrentHour 
            ? "relative before:absolute before:-left-[21px] before:top-3 before:h-2 before:w-2 before:rounded-full before:bg-primary before:ring-4 before:ring-primary/20" 
            : ""
        }`}
      >
        <div className={isCurrentHour ? "rounded-3xl bg-primary/5 p-1 ring-1 ring-primary/20" : ""}>
          {children}
        </div>
      </div>
    </div>
  );
}