import { useMemo, useState } from 'react'
import { jotformForms, useJotformSubmissionGroups } from '../services/baseService'
import { Timeline } from '../components/Timeline'
import type { JotformAnswer, JotformFormKey } from '../types/jotform'
import type { DataCategory, FilterKey, InsightRecord, SearchRecord } from '../types/findPodo'

const categoryOptions: Array<{ key: DataCategory; label: string; description: string }> = [
  {
    key: 'locations',
    label: 'Locations',
    description: 'Location and address fields',
  },
  {
    key: 'notes',
    label: 'Notes',
    description: 'Notes, messages, and description fields',
  },
  {
    key: 'times',
    label: 'Times',
    description: 'Date and time details',
  },
]

const filterOptions: Array<{ key: FilterKey; label: string; placeholder: string }> = [
  {
    key: 'personName',
    label: 'Person Name',
    placeholder: 'Type a person name...',
  },
  {
    key: 'authorName',
    label: 'Author Name',
    placeholder: 'Type an author name...',
  },
  {
    key: 'seenWith',
    label: 'Seen With',
    placeholder: 'E.g. Asli',
  },
]

export function FindPodo() {
  const [selectedCategory, setSelectedCategory] = useState<DataCategory>('locations')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('seenWith')
  const [filterValue, setFilterValue] = useState('')
  const groupedSubmissions = useJotformSubmissionGroups()
  const allRecords = useMemo<SearchRecord[]>(
    () =>
      (Object.keys(jotformForms) as JotformFormKey[]).flatMap((formKey) => {
        const query = groupedSubmissions[formKey]
        const submissions = Array.isArray(query.data) ? query.data : []

        return submissions.map((submission) => ({
          formKey,
          formLabel: jotformForms[formKey].label,
          submission,
        }))
      }),
    [groupedSubmissions],
  )
  const filteredRecords = useMemo(
    () => filterRecords(allRecords, activeFilter, filterValue),
    [activeFilter, allRecords, filterValue],
  )
  const insightRecords = useMemo(
    () => filteredRecords.flatMap((record) => getInsightRecords(record)),
    [filteredRecords],
  )
  const visibleInsights = useMemo(
    () => insightRecords
      .filter((record) => record.category === selectedCategory)
      .map((record) => ({
        ...record,
        matchedFilterValues: getMatchedFilterValues(record, activeFilter, filterValue),
      }))
      .toSorted((first, second) => first.time - second.time),
    [activeFilter, filterValue, insightRecords, selectedCategory],
  )
  const categoryCounts = useMemo(
    () =>
      categoryOptions.reduce(
        (counts, option) => ({
          ...counts,
          [option.key]: insightRecords.filter((record) => record.category === option.key).length,
        }),
        {} as Record<DataCategory, number>,
      ),
    [insightRecords],
  )
  const activeCategory = categoryOptions.find((option) => option.key === selectedCategory)
  const activeFilterOption = filterOptions.find((option) => option.key === activeFilter)
    ?? filterOptions[0]
  const hasFilterValue = filterValue.trim().length > 0
  const summaryText = hasFilterValue
    ? `${filteredRecords.length} records filtered`
    : `${allRecords.length} records scanned`
  const isLoading = Object.values(groupedSubmissions).some((query) => query.isLoading)
  const firstError = Object.values(groupedSubmissions).find((query) => query.error)?.error

  return (
    <>
      <section className="find-hero">
        <div>
          <p className="eyebrow">Find Podo</p>
          <h1 id="timeline-title">Podo Route Flow</h1>

          <p>
            Search across every data source at once to quickly uncover links between
            people, locations, messages, and notes.
          </p>
        </div>

        <div className="find-panel">
          <dl>
            <div>
              <dt>Sources</dt>
              <dd>{Object.keys(jotformForms).length}</dd>
            </div>
            <div>
              <dt>Records</dt>
              <dd>{allRecords.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      {isLoading && <p className="status">Loading records...</p>}

      {firstError && (
        <p className="status error">
          An error occurred while loading data:{' '}
          {firstError instanceof Error ? firstError.message : 'Unknown error'}
        </p>
      )}

      {!isLoading && !firstError && (
        <>
          <Timeline records={allRecords} />

          <section className="data-explorer" aria-labelledby="data-explorer-title">
            <div className="data-explorer-controls">
              <div className="insight-picker" aria-label="Data type">
                {categoryOptions.map((option) => (
                  <button
                    type="button"
                    className={selectedCategory === option.key ? 'active' : ''}
                    key={option.key}
                    onClick={() => setSelectedCategory(option.key)}
                  >
                    <span>{option.label}</span>
                    <strong>{categoryCounts[option.key]}</strong>
                    <em>{option.description}</em>
                  </button>
                ))}
              </div>

              <div className="insight-filter-panel">
                <div className="insight-filter-grid" aria-label="Filter type">
                  {filterOptions.map((option) => (
                    <button
                      type="button"
                      className={activeFilter === option.key ? 'active' : ''}
                      key={option.key}
                      onClick={() => {
                        setActiveFilter(option.key)
                        setFilterValue('')
                      }}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>

                <label className="insight-filter-input">
                  <span>{activeFilterOption.label}</span>
                  <input
                    type="search"
                    value={filterValue}
                    placeholder={activeFilterOption.placeholder}
                    onChange={(event) => setFilterValue(event.target.value)}
                  />
                </label>
              </div>
            </div>

            {visibleInsights.length > 0 ? (
              <>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">{activeCategory?.label}</p>
                    <h2 id="data-explorer-title">Data stream by category</h2>
                  </div>
                  <p>{visibleInsights.length} results, {summaryText}</p>
                </div>

                <ol className="row g-4 location-card-list">
                  {visibleInsights.map((record, index) => (
                    <li
                      className="col-md-6 col-xl-4"
                      key={`${record.formKey}-${record.submission.id}-${record.label}-${index}`}
                    >
                      <article className="location-card h-100">
                        <header className="location-card-header">
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          <strong>{formatDate(record.submission.created_at)}</strong>
                        </header>

                        <div className="location-card-body">
                          <p>{record.formLabel}</p>
                          <h3>{record.value}</h3>
                          {record.matchedFilterValues.length > 0 && (
                            <div className="location-card-match">
                              {record.matchedFilterValues.slice(0, 2).map((item) => (
                                <div key={`${item.label}-${item.value}`}>
                                  <span>{item.label}</span>
                                  <strong>{item.value}</strong>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <dl className="location-card-meta">
                          <div>
                            <dt>Field</dt>
                            <dd>{record.label}</dd>
                          </div>
                          <div>
                            <dt>Record</dt>
                            <dd>#{record.submission.id.slice(-4)}</dd>
                          </div>
                        </dl>
                      </article>
                    </li>
                  ))}
                </ol>
              </>
            ) : (
              <section className="empty-state-card">
                <h2 id="data-explorer-title">No {activeCategory?.label?.toLowerCase()} records found.</h2>
                <p>No data is available for the selected category and filter combination.</p>
              </section>
            )}
          </section>
        </>
      )}
    </>
  )
}

function getInsightRecords(record: SearchRecord): InsightRecord[] {
  const answerInsights = Object.entries(record.submission.answers ?? {}).flatMap(([, answer]) => {
    const category = getAnswerCategory(answer)

    if (!category) {
      return []
    }

    const value = formatAnswer(answer)

    if (value === '-') {
      return []
    }

    return {
      ...record,
      category,
      label: answer.text ?? answer.name ?? 'Location',
      matchedFilterValues: [],
      value,
      time: getTime(record.submission.created_at),
    }
  })

  return [
    ...answerInsights,
    {
      ...record,
      category: 'times',
      label: 'Created',
      matchedFilterValues: [],
      value: formatDate(record.submission.created_at),
      time: getTime(record.submission.created_at),
    },
  ]
}

function filterRecords(records: SearchRecord[], filterKey: FilterKey, value: string) {
  const normalizedValue = normalizeText(value)

  if (!normalizedValue) {
    return records
  }

  return records.filter((record) =>
    Object.values(record.submission.answers ?? {}).some((answer) => (
      isFilterAnswer(answer, filterKey)
      && normalizeText(formatAnswer(answer)).includes(normalizedValue)
    )),
  )
}

function getMatchedFilterValues(record: SearchRecord, filterKey: FilterKey, value: string) {
  const normalizedValue = normalizeText(value)

  if (!normalizedValue) {
    return []
  }

  return Object.values(record.submission.answers ?? {})
    .filter((answer) => isFilterAnswer(answer, filterKey))
    .map((answer) => ({
      label: answer.text ?? answer.name ?? getFilterLabel(filterKey),
      value: formatAnswer(answer),
    }))
    .filter((item) =>
      item.value !== '-'
      && normalizeText(item.value).includes(normalizedValue),
    )
}

function getAnswerCategory(answer: JotformAnswer): DataCategory | null {
  if (hasAnswerLabel(answer, /\b(location|konum|address|adres|place|venue|where)\b/)) {
    return 'locations'
  }

  if (hasAnswerLabel(answer, /\b(note|notes|not|message|mesaj|description|aciklama|comment|yorum)\b/)) {
    return 'notes'
  }

  if (hasAnswerLabel(answer, /\b(time|date|tarih|saat|when|created|updated)\b/)) {
    return 'times'
  }

  return null
}

function isFilterAnswer(answer: JotformAnswer, filterKey: FilterKey) {
  const filters: Record<FilterKey, RegExp> = {
    authorName: /\b(author|yazar|created by|submitted by|sender|gonderen)\b/,
    personName: /\b(person|name|kisi|ad soyad|full name|isim)\b/,
    seenWith: /\b(seen with|with|birlikte|yaninda|goren|gordu)\b/,
  }

  return hasAnswerLabel(answer, filters[filterKey])
}

function getFilterLabel(filterKey: FilterKey) {
  const labels: Record<FilterKey, string> = {
    authorName: 'Author Name',
    personName: 'Person Name',
    seenWith: 'Seen With',
  }

  return labels[filterKey]
}

function hasAnswerLabel(answer: JotformAnswer, pattern: RegExp) {
  const searchableLabel = [answer.name, answer.text, answer.type]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return pattern.test(searchableLabel)
}

function formatAnswer(answer: JotformAnswer) {
  if (answer.prettyFormat) {
    return answer.prettyFormat
  }

  if (typeof answer.answer === 'string' || typeof answer.answer === 'number') {
    return String(answer.answer)
  }

  if (Array.isArray(answer.answer)) {
    return answer.answer.map(String).join(', ')
  }

  if (answer.answer && typeof answer.answer === 'object') {
    return Object.values(answer.answer)
      .filter(Boolean)
      .map(String)
      .join(', ')
  }

  return '-'
}

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function getTime(date?: string) {
  return date ? new Date(date).getTime() : 0
}

function formatDate(date?: string) {
  if (!date) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
