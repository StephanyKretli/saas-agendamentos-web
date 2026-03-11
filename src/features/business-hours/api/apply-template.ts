import { apiFetch } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"

export type ApplyBusinessHoursTemplateInput = {
  sourceWeekday: number
  targetWeekdays: number[]
  replace?: boolean
}

export async function applyBusinessHoursTemplate(
  data: ApplyBusinessHoursTemplateInput,
) {
  return apiFetch("/business-hours/apply-template", {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
}