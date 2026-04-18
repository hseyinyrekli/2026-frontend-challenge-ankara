import type { SearchInputProps } from '../types/components'

export function SearchInput({ onSearchChange, value }: SearchInputProps) {
  return (
    <label className="search-input">
      <span className="visually-hidden">Search records</span>
      <input
        className="form-control"
        type="search"
        placeholder="Search records..."
        value={value}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>
  )
}
