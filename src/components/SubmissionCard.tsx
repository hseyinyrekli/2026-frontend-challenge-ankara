import { useState } from 'react'
import type { JotformAnswer, JotformSubmission } from '../services/baseService'
import { SubmissionDetailModal } from './SubmissionDetailModal'

type SubmissionCardProps = {
  submission: JotformSubmission
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const answers = Object.entries(submission.answers ?? {})
  const title = getTitle(answers)
  const description = getDescription(answers)
  const createdAt = submission.created_at ?? 'Tarih yok'

  return (
    <>
      <article className="submission-card card h-100">
        <button
          type="button"
          className="submission-card-button"
          onClick={() => setIsModalOpen(true)}
          aria-label={`${title} detaylarini ac`}
        >
          <header className="submission-card-header card-header">
            <span>Record #{submission.id.slice(-4)}</span>
            <strong>Detay</strong>
          </header>

          <div className="card-body">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <dl className="submission-meta card-footer">
            <div>
              <dt>Created</dt>
              <dd>{createdAt}</dd>
            </div>
          </dl>
        </button>
      </article>

      {isModalOpen && (
        <SubmissionDetailModal
          submission={submission}
          title={title}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}

function getTitle(answers: [string, JotformAnswer][]) {
  const answer = answers.find(([, item]) => Boolean(formatAnswer(item) && formatAnswer(item) !== '-'))

  return answer ? String(formatAnswer(answer[1])).slice(0, 48) : 'Yeni kayit'
}

function getDescription(answers: [string, JotformAnswer][]) {
  const values = answers
    .map(([, answer]) => formatAnswer(answer))
    .filter((value) => value !== '-')
    .slice(1, 2)

  return values.length > 0
    ? values.join(' - ').slice(0, 96)
    : 'Bu kayit icin temel detaylar alindi.'
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
