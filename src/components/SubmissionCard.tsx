import type { JotformAnswer, JotformSubmission } from '../services/baseService'

type SubmissionCardProps = {
  submission: JotformSubmission
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <article className="submission-card">
      <header>
        <strong>Submission #{submission.id}</strong>
        <time>{submission.created_at ?? 'Tarih yok'}</time>
      </header>

      <dl>
        {Object.entries(submission.answers ?? {}).map(([answerId, answer]) => (
          <div key={answerId}>
            <dt>{answer.text ?? answer.name ?? `Soru ${answerId}`}</dt>
            <dd>{formatAnswer(answer)}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
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
