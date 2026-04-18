import type { JotformAnswer, JotformSubmission } from '../services/baseService'

type SubmissionCardProps = {
  submission: JotformSubmission
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const answers = Object.entries(submission.answers ?? {})
  const title = getTitle(answers)
  const description = getDescription(answers)
  const statusLabel = getStatusLabel(submission)

  return (
    <article className="submission-card card h-100">
      <header className="submission-card-header card-header">
        <span>Todo #{submission.id.slice(-4)}</span>
        <strong className={`status-pill ${statusLabel === 'Tamamlandi' ? 'done' : ''}`}>
          {statusLabel}
        </strong>
      </header>

      <div className="card-body">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <dl className="submission-meta card-footer">
        {answers.slice(0, 3).map(([answerId, answer]) => (
          <div key={answerId}>
            <dt>{answer.text ?? answer.name ?? `Soru ${answerId}`}</dt>
            <dd>{formatAnswer(answer)}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function getTitle(answers: [string, JotformAnswer][]) {
  const answer = answers.find(([, item]) => Boolean(formatAnswer(item) && formatAnswer(item) !== '-'))

  return answer ? String(formatAnswer(answer[1])).slice(0, 72) : 'Yeni kayit'
}

function getDescription(answers: [string, JotformAnswer][]) {
  const values = answers
    .map(([, answer]) => formatAnswer(answer))
    .filter((value) => value !== '-')
    .slice(1, 3)

  return values.length > 0
    ? values.join(' - ').slice(0, 150)
    : 'Bu kayit icin detaylar alindi. Daha fazla baglam ve ilerleme durumu icin detaya gidebilirsiniz.'
}

function getStatusLabel(submission: JotformSubmission) {
  return submission.status === 'ACTIVE' ? 'Devam Ediyor' : 'Tamamlandi'
}

function formatAnswer(answer: JotformAnswer) {
  if (answer.prettyFormat) {
    return answer.prettyFormat
  }

  if (typeof answer.answer === 'string' || typeof answer.answer === 'number') {
    return answer.answer
  }

  if (Array.isArray(answer.answer)) {
    return answer.answer.join(', ')
  }

  if (answer.answer && typeof answer.answer === 'object') {
    return JSON.stringify(answer.answer)
  }

  return '-'
}
