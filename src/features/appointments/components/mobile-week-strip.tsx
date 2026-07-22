"use client";

import * as React from "react";
import { addDays, isSameDay } from "date-fns";
import { CalendarSearch } from "lucide-react";

function toInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type Props = {
  selectedDate: string; // "YYYY-MM-DD"
  onSelectDate: (value: string) => void;
  onOpenCalendar: () => void; // salto maior via modal de calendário já existente
};

// Faixa de dias horizontal e rolável — o padrão mobile para trocar de dia com o
// polegar, em vez de avançar um a um. Substitui a pílula prev/próximo no mobile;
// o desktop continua com o calendário lateral.
export function MobileWeekStrip({ selectedDate, onSelectDate, onOpenCalendar }: Props) {
  const selected = new Date(`${selectedDate}T12:00:00`);
  const today = new Date();
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const activeRef = React.useRef<HTMLButtonElement>(null);

  // Janela de 21 dias começando 7 dias antes de hoje (permite ver a semana
  // passada e ~2 semanas à frente). Saltos maiores usam o calendário.
  const start = addDays(today, -7);
  const days = React.useMemo(
    () => Array.from({ length: 21 }, (_, i) => addDays(start, i)),
    [selectedDate],
  );

  // Centraliza o dia selecionado ao montar / trocar de data.
  React.useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [selectedDate]);

  return (
    <div className="lg:hidden -mx-4 px-4">
      <div className="flex items-stretch gap-2">
        <div
          ref={scrollerRef}
          className="flex flex-1 gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {days.map((day) => {
            const isSelected = isSameDay(day, selected);
            const isToday = isSameDay(day, today);
            const weekday = day
              .toLocaleDateString("pt-BR", { weekday: "short" })
              .replace(".", "")
              .toUpperCase();

            return (
              <button
                key={day.toISOString()}
                ref={isSelected ? activeRef : undefined}
                onClick={() => onSelectDate(toInput(day))}
                aria-pressed={isSelected}
                className={`flex min-w-13 shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wide ${
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {weekday}
                </span>
                <span className="text-base font-black leading-none">{day.getDate()}</span>
                <span
                  className={`mt-0.5 h-1 w-1 rounded-full ${
                    isToday ? (isSelected ? "bg-primary-foreground" : "bg-primary") : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenCalendar}
          aria-label="Escolher outra data"
          className="flex w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground hover:bg-muted"
        >
          <CalendarSearch className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
