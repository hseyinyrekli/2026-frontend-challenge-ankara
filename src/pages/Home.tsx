import { useState } from 'react'
import { EmptyStateCard } from '../components/EmptyStateCard'
import { FormStatCard } from '../components/FormStatCard'
import { SearchInput } from '../components/SearchInput'
import { SubmissionCard } from '../components/SubmissionCard'
import { jotformForms, useJotformSubmissionGroups } from '../services/baseService'
import type { JotformFormKey } from '../types/jotform'

export function Home() {
  const [selectedForm, setSelectedForm] = useState<JotformFormKey>('checkins')
  const [searchTerm, setSearchTerm] = useState('')
  const groupedSubmissions = useJotformSubmissionGroups()
  const selectedQuery = groupedSubmissions[selectedForm]
  const submissions = Array.isArray(selectedQuery.data) ? selectedQuery.data : []
  const filteredSubmissions = submissions.filter((submission) =>
    JSON.stringify(submission).toLowerCase().includes(searchTerm.trim().toLowerCase()),
  )
  const selectedFormMeta = jotformForms[selectedForm]

  return (
    <>
        <section className="dashboard-toolbar">
          <div className="category-actions" aria-label="Data categories">
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
          <SearchInput value={searchTerm} onSearchChange={setSearchTerm} />
        </section>

        <section
          className="section-heading d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3"
          id="records"
        >
          <div>
            <p className="eyebrow">{selectedFormMeta.label}</p>
          </div>
          <p>{filteredSubmissions.length} records shown</p>
        </section>

        {selectedQuery.isLoading && <p className="status">Loading records...</p>}

        {selectedQuery.error && (
          <p className="status error">
            An error occurred while loading data:{' '}
            {selectedQuery.error instanceof Error ? selectedQuery.error.message : 'Unknown error'}
          </p>
        )}

        {!selectedQuery.isLoading && !selectedQuery.error && (
          filteredSubmissions.length > 0 ? (
            <section className="row g-4">
              {filteredSubmissions.map((submission) => (
                <div className="col-md-6 col-xl-4" key={submission.id}>
                  <SubmissionCard submission={submission} />
                </div>
              ))}
            </section>
          ) : (
            <EmptyStateCard />
          )
        )}
    </>
  )
}
