import { useState } from 'react'
import { SubmissionCard } from '../components/SubmissionCard'
import {
  jotformForms,
  type JotformFormKey,
  useJotformSubmissions,
} from '../services/baseService'

export function Home() {
  const [selectedForm, setSelectedForm] = useState<JotformFormKey>('checkins')
  const { data, error, isLoading } = useJotformSubmissions(selectedForm)
  const submissions = Array.isArray(data) ? data : []
  const selectedFormMeta = jotformForms[selectedForm]

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <p className="eyebrow">Jotform Data</p>
          <h1>{selectedFormMeta.label}</h1>
        </div>
        <select
          aria-label="Form seç"
          value={selectedForm}
          onChange={(event) => setSelectedForm(event.target.value as JotformFormKey)}
        >
          {Object.entries(jotformForms).map(([key, form]) => (
            <option key={key} value={key}>
              {form.label}
            </option>
          ))}
        </select>
      </section>

      {isLoading && <p className="status">Veriler yükleniyor...</p>}

      {error && (
        <p className="status error">
          Veri çekilirken hata oluştu: {error instanceof Error ? error.message : 'Bilinmeyen hata'}
        </p>
      )}

      {!isLoading && !error && (
        <section className="submissions">
          <div className="summary">
            <span>{submissions.length}</span>
            <p>kayıt bulundu</p>
          </div>

          {submissions.map((submission) => (
            <SubmissionCard key={submission.id} submission={submission} />
          ))}
        </section>
      )}
    </main>
  )
}
