import type { JotformSubmission } from '../services/baseService'

type TimelineProps = {
  submissions: JotformSubmission[]
}

export function Timeline({ submissions }: TimelineProps) {
  const timelineItems = submissions
    .toSorted((first, second) => getTime(first.created_at) - getTime(second.created_at))
    .slice(0, 6)

  if (timelineItems.length === 0) {
    return null
  }

  return (
    <section className="timeline-panel" aria-labelledby="timeline-title">
      <div className="timeline-heading">
        <p className="eyebrow">Timeline</p>
        <h2 id="timeline-title">Podo route flow</h2>
      </div>

      <ol className="timeline-list">
        {timelineItems.map((submission, index) => (
          <li key={submission.id}>
            <span className="timeline-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <strong>{formatDate(submission.created_at)}</strong>
              <p>{getTimelineLabel(submission)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function getTime(date?: string) {
  return date ? new Date(date).getTime() : 0
}

function formatDate(date?: string) {
  if (!date) {
    return 'Tarih yok'
  }

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(new Date(date))
}

function getTimelineLabel(submission: JotformSubmission) {
  const firstAnswer = Object.values(submission.answers ?? {}).find((answer) => {
    const value = answer.prettyFormat ?? answer.answer

    return Boolean(value)
  })

  if (!firstAnswer) {
    return `Record #${submission.id.slice(-4)} kaydi alindi.`
  }

  const value = firstAnswer.prettyFormat ?? firstAnswer.answer

  return String(Array.isArray(value) ? value.join(', ') : value).slice(0, 96)
}
