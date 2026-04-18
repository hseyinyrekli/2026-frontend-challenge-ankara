import type { SubmissionDetailModalProps } from '../types/components'
import type { JotformAnswer } from '../types/jotform'

export function SubmissionDetailModal({ onClose, submission, title }: SubmissionDetailModalProps) {
  const answers = Object.entries(submission.answers ?? {})
  const createdAt = submission.created_at ?? 'No date'

  return (
    <div className="detail-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`submission-${submission.id}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="detail-modal-header">
          <div>
            <span>Record #{submission.id}</span>
            <h2 id={`submission-${submission.id}-title`}>{title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close detail modal">
            X
          </button>
        </header>

        <dl className="detail-summary">
          <div>
            <dt>Form ID</dt>
            <dd>{submission.form_id}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{submission.status ?? '-'}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{createdAt}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{submission.updated_at ?? '-'}</dd>
          </div>
        </dl>

        <div className="detail-answer-list">
          {answers.map(([answerId, answer]) => (
            <article key={answerId}>
              <span>{answer.text ?? answer.name ?? `Question ${answerId}`}</span>
              <p>{formatAnswer(answer)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
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
