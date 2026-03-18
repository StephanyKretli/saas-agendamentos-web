"use client";

import * as React from "react";

type TimelineRowProps = {
  time: string;
  children: React.ReactNode;
};

export function TimelineRow({ time, children }: TimelineRowProps) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 items-start">
      <div className="pt-3 text-sm font-medium text-muted-foreground">
        {time}
      </div>

      <div>{children}</div>
    </div>
  );
}