"use client";

import * as React from "react";

type TimelineRowProps = {
  time: string;
  children: React.ReactNode;
  isCurrentHour?: boolean;
};

export function TimelineRow({
  time,
  children,
  isCurrentHour = false,
}: TimelineRowProps) {
  return (
    <div
      className={`grid grid-cols-[72px_1fr] gap-3 items-start rounded-2xl transition-colors ${
        isCurrentHour ? "bg-yellow-50/70" : ""
      }`}
    >
      <div className="pt-3 text-sm font-medium text-muted-foreground">
        <span
          className={`inline-flex rounded-full px-2 py-1 ${
            isCurrentHour ? "bg-yellow-100 text-yellow-800" : ""
          }`}
        >
          {time}
        </span>
      </div>

      <div>{children}</div>
    </div>
  );
}