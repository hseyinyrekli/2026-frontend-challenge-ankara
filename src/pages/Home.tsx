import { useState } from 'react'
import { FormStatCard } from '../components/FormStatCard'
import { SubmissionCard } from '../components/SubmissionCard'
import { MainLayout } from '../layouts/MainLayout'
import {
  jotformForms,
  type JotformFormKey,
  useJotformSubmissionGroups,
} from '../services/baseService'

export function Home() {
  const [selectedForm, setSelectedForm] = useState<JotformFormKey>('checkins')
  const groupedSubmissions = useJotformSubmissionGroups()
  const selectedQuery = groupedSubmissions[selectedForm]
  const submissions = Array.isArray(selectedQuery.data) ? selectedQuery.data : []
  const selectedFormMeta = jotformForms[selectedForm]

  return (
    <MainLayout>
        <section className="dashboard-toolbar">
          <div className="category-actions" aria-label="Veri kategorileri">
            {(Object.entries(jotformForms) as [JotformFormKey, (typeof jotformForms)[JotformFormKey]][]).map(
              ([key, form]) => (
                <FormStatCard
                  key={key}
                  count={Array.isArray(groupedSubmissions[key].data) ? groupedSubmissions[key].data.length : 0}
                  formKey={key}
                  isActive={selectedForm === key}
                  label={form.label}
                  onSelect={setSelectedForm}
                />
              ),
            )}
          </div>
        </section>

        <section
          className="section-heading d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3"
          id="records"
        >
          <div>
            <p className="eyebrow">{selectedFormMeta.label}</p>
          </div>
          <p>{submissions.length} kayit goruntuleniyor</p>
        </section>

        {selectedQuery.isLoading && <p className="status">Veriler yukleniyor...</p>}

        {selectedQuery.error && (
          <p className="status error">
            Veri cekilirken hata olustu:{' '}
            {selectedQuery.error instanceof Error ? selectedQuery.error.message : 'Bilinmeyen hata'}
          </p>
        )}

        {!selectedQuery.isLoading && !selectedQuery.error && (
          <section className="row g-4">
            {submissions.map((submission) => (
              <div className="col-md-6 col-xl-4" key={submission.id}>
                <SubmissionCard submission={submission} />
              </div>
            ))}
          </section>
        )}
    </MainLayout>
  )
}
