import type { ReactNode } from 'react'
import type { JotformAnswer, JotformFormKey, JotformSubmission } from './jotform'

export type MainLayoutProps = {
  children: ReactNode
}

export type SearchInputProps = {
  onSearchChange: (value: string) => void
  value: string
}

export type FormStatCardProps = {
  count: number
  formKey: JotformFormKey
  isActive: boolean
  label: string
  onSelect: (formKey: JotformFormKey) => void
}

export type SubmissionCardProps = {
  submission: JotformSubmission
}

export type SubmissionDetailModalProps = {
  onClose: () => void
  submission: JotformSubmission
  title: string
}

export type TimelineRecord = {
  formKey: JotformFormKey
  formLabel: string
  submission: JotformSubmission
}

export type TimelineProps = {
  records: TimelineRecord[]
}

export type AnswerEntries = [string, JotformAnswer][]
