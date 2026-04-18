import type { JotformFormKey, JotformSubmission } from './jotform'

export type DataCategory = 'locations' | 'notes' | 'times'

export type FilterKey = 'personName' | 'authorName' | 'seenWith'

export type SearchRecord = {
  formKey: JotformFormKey
  formLabel: string
  submission: JotformSubmission
}

export type MatchedFilterValue = {
  label: string
  value: string
}

export type InsightRecord = SearchRecord & {
  category: DataCategory
  value: string
  label: string
  matchedFilterValues: MatchedFilterValue[]
  time: number
}
