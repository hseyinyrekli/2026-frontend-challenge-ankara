import type { JotformFormKey } from '../services/baseService'

type FormStatCardProps = {
  count: number
  formKey: JotformFormKey
  isActive: boolean
  label: string
  onSelect: (formKey: JotformFormKey) => void
}

export function FormStatCard({ count, formKey, isActive, label, onSelect }: FormStatCardProps) {
  return (
    <button
      type="button"
      className={`category-button category-${formKey} btn ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(formKey)}
    >
      <span>{label}</span>
      <strong>{count}</strong>
    </button>
  )
}
