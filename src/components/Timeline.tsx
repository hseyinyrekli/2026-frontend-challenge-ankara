import { useState } from 'react'
import type { TimelineProps, TimelineRecord } from '../types/components'
import type { JotformFormKey, JotformSubmission } from '../types/jotform'

export function Timeline({ records }: TimelineProps) {
  const sources = getSources(records)
  const [selectedSource, setSelectedSource] = useState<JotformFormKey | undefined>(
    sources[0]?.formKey,
  )
  const activeSource = sources.some((source) => source.formKey === selectedSource)
    ? selectedSource
    : sources[0]?.formKey
  const filteredRecords = records.filter((record) => record.formKey === activeSource)
  const timelineItems = filteredRecords
    .toSorted((first, second) => getTime(first.submission.created_at) - getTime(second.submission.created_at))
    .slice(0, 6)

  if (records.length === 0) {
    return null
  }

  return (
    <section className="timeline-panel" aria-labelledby="timeline-title">
      <div className="timeline-heading">
        <p className="eyebrow">Timeline</p>
      </div>

      <div className="timeline-content">
        <div className="timeline-source-list" aria-label="Timeline source filter">
          {sources.map((source) => (
            <button
              type="button"
              className={activeSource === source.formKey ? 'active' : ''}
              key={source.formKey}
              onClick={() => setSelectedSource(source.formKey)}
            >
              <span>{source.formLabel}</span>
              <strong>{source.count}</strong>
            </button>
          ))}
        </div>

        {timelineItems.length > 0 ? (
          <ol className="timeline-list">
            {timelineItems.map((record, index) => (
              <li key={`${record.formKey}-${record.submission.id}`}>
                <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{formatDate(record.submission.created_at)}</strong>
                  <em>{record.formLabel}</em>
                  <p>{getTimelineLabel(record.submission)}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="timeline-empty">
            No timeline entries were found for this source.
          </div>
        )}
      </div>
    </section>
  )
}

function getSources(records: TimelineRecord[]) {
  return records.reduce(
    (sources, record) => {
      const existingSource = sources.find((source) => source.formKey === record.formKey)

      if (existingSource) {
        existingSource.count += 1
        return sources
      }

      return [
        ...sources,
        {
          count: 1,
          formKey: record.formKey,
          formLabel: record.formLabel,
        },
      ]
    },
    [] as Array<{ count: number; formKey: JotformFormKey; formLabel: string }>,
  )
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
    second: '2-digit',
  }).format(new Date(date))
}

function getTimelineLabel(submission: JotformSubmission) {
  const firstAnswer = Object.values(submission.answers ?? {}).find((answer) => {
    const value = answer.prettyFormat ?? answer.answer

    return Boolean(value)
  })

  if (!firstAnswer) {
    return `Record #${submission.id.slice(-4)} was captured.`
  }

  const value = firstAnswer.prettyFormat ?? firstAnswer.answer

  return String(Array.isArray(value) ? value.join(', ') : value).slice(0, 96)
}
