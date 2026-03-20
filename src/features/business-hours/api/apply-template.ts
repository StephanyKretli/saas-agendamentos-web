import { api } from "@/lib/api"
import { getAuthHeaders } from "@/lib/auth-headers"

export type ApplyBusinessHoursTemplateInput = {
  sourceWeekday: number
  targetWeekdays: number[]
  replace?: boolean
}

export async function applyBusinessHoursTemplate(
  data: ApplyBusinessHoursTemplateInput,
) {
  return api.post("/business-hours/apply-template", {
    headers: getAuthHeaders(),
  })
}