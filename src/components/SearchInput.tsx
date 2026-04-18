type SearchInputProps = {
  onSearchChange: (value: string) => void
  value: string
}

export function SearchInput({ onSearchChange, value }: SearchInputProps) {
  return (
    <label className="search-input">
      <span className="visually-hidden">Kayitlarda ara</span>
      <input
        className="form-control"
        type="search"
        placeholder="Kayitlarda ara..."
        value={value}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </label>
  )
}
