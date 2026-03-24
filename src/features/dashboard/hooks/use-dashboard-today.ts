"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardToday } from "../services/dashboard.api";

export function useDashboardToday() {
  return useQuery({
    queryKey: ["dashboard", "today"],
    queryFn: getDashboardToday,
  });
}