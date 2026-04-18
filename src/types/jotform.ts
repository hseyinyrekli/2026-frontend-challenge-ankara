import type { jotformForms } from '../services/baseService'

export type JotformFormKey = keyof typeof jotformForms

export type JotformAnswer = {
  name?: string
  order?: string
  text?: string
  type?: string
  answer?: unknown
  prettyFormat?: string
}

export type JotformSubmission = {
  id: string
  form_id: string
  ip?: string
  created_at?: string
  updated_at?: string
  status?: string
  answers?: Record<string, JotformAnswer>
}

export type JotformResponse<T> = {
  responseCode: number
  message: string
  content: T
}

export type JotformSubmissionsContent =
  | JotformSubmission[]
  | { submissions?: JotformSubmission[] }
  | Record<string, JotformSubmission>
  | string
  | null
