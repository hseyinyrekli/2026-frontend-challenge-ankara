import { useQueries, useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const jotformForms = {
  checkins: {
    label: 'Checkins',
    formId: import.meta.env.VITE_JOTFORM_CHECKINS_FORM_ID,
  },
  messages: {
    label: 'Messages',
    formId: import.meta.env.VITE_JOTFORM_MESSAGES_FORM_ID,
  },
  sightings: {
    label: 'Sightings',
    formId: import.meta.env.VITE_JOTFORM_SIGHTINGS_FORM_ID,
  },
  personalNotes: {
    label: 'Personal Notes',
    formId: import.meta.env.VITE_JOTFORM_PERSONAL_NOTES_FORM_ID,
  },
  anonymousTips: {
    label: 'Anonymous Tips',
    formId: import.meta.env.VITE_JOTFORM_ANONYMOUS_TIPS_FORM_ID,
  },
} as const

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

type JotformResponse<T> = {
  responseCode: number
  message: string
  content: T
}

type JotformSubmissionsContent =
  | JotformSubmission[]
  | { submissions?: JotformSubmission[] }
  | Record<string, JotformSubmission>
  | string
  | null

const apiKey = import.meta.env.VITE_JOTFORM_API_KEY?.trim()

const jotformApi = axios.create({
  baseURL: import.meta.env.VITE_JOTFORM_API_BASE_URL ?? 'https://api.jotform.com',
})

export async function getJotformSubmissions(
  formKey: JotformFormKey,
): Promise<JotformSubmission[]> {
  const form = jotformForms[formKey]

  if (!form.formId) {
    throw new Error(`${form.label} form ID is missing.`)
  }

  if (!apiKey) {
    throw new Error('Jotform API key is missing.')
  }

  const { data } = await jotformApi.get<JotformResponse<JotformSubmissionsContent>>(
    `/form/${form.formId}/submissions`,
    {
      params: {
        apiKey,
      },
    },
  )

  if (data.responseCode !== 200) {
    throw new Error(data.message || `${form.label} submissions could not be loaded.`)
  }

  return normalizeSubmissions(data.content, form.label, data.message)
}

function normalizeSubmissions(
  content: JotformSubmissionsContent,
  formLabel: string,
  responseMessage: string,
) {
  if (Array.isArray(content)) {
    return content
  }

  if (!content || typeof content !== 'object') {
    throw new Error(
      responseMessage && responseMessage !== 'success'
        ? responseMessage
        : `${formLabel} submissions response is empty or invalid.`,
    )
  }

  if ('submissions' in content && Array.isArray(content.submissions)) {
    return content.submissions
  }

  const submissions = Object.values(content).filter(isSubmission)

  if (submissions.length === 0 && Object.keys(content).length > 0) {
    throw new Error(`${formLabel} submissions response has an unexpected format.`)
  }

  return submissions
}

function isSubmission(value: unknown): value is JotformSubmission {
  return Boolean(value && typeof value === 'object' && 'id' in value)
}

export function useJotformSubmissions(formKey: JotformFormKey) {
  return useQuery({
    queryKey: ['jotform', 'submissions', formKey],
    queryFn: () => getJotformSubmissions(formKey),
  })
}

export function useJotformSubmissionGroups() {
  const formKeys = Object.keys(jotformForms) as JotformFormKey[]

  return useQueries({
    queries: formKeys.map((formKey) => ({
      queryKey: ['jotform', 'submissions', formKey],
      queryFn: () => getJotformSubmissions(formKey),
    })),
    combine: (results) =>
      formKeys.reduce(
        (acc, formKey, index) => ({
          ...acc,
          [formKey]: results[index],
        }),
        {} as Record<JotformFormKey, (typeof results)[number]>,
      ),
  })
}
