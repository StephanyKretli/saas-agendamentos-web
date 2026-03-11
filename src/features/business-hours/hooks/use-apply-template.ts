"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  applyBusinessHoursTemplate,
  ApplyBusinessHoursTemplateInput,
} from "../api/apply-template"

export function useApplyBusinessHoursTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ApplyBusinessHoursTemplateInput) =>
      applyBusinessHoursTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-hours"],
      })
    },
  })
}