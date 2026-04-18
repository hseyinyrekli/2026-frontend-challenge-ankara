import type { FormStatCardProps } from '../types/components'

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
