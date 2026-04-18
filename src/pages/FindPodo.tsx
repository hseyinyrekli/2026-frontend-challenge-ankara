import { useMemo, useState } from 'react'
import { EmptyStateCard } from '../components/EmptyStateCard'
import { SearchInput } from '../components/SearchInput'
import { SubmissionCard } from '../components/SubmissionCard'
import {
  jotformForms,
  type JotformFormKey,
  type JotformSubmission,
  useJotformSubmissionGroups,
} from '../services/baseService'

type SearchRecord = {
  formKey: JotformFormKey
  formLabel: string
  submission: JotformSubmission
}

export function FindPodo() {
  const [searchTerm, setSearchTerm] = useState('')
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
  const trimmedSearch = searchTerm.trim().toLowerCase()
  const filteredRecords = trimmedSearch
    ? allRecords.filter((record) =>
        JSON.stringify(record.submission).toLowerCase().includes(trimmedSearch),
      )
    : allRecords
  const isLoading = Object.values(groupedSubmissions).some((query) => query.isLoading)
  const firstError = Object.values(groupedSubmissions).find((query) => query.error)?.error

  return (
    <>
      <section className="find-hero">
        <div>
          <p className="eyebrow">Find Podo</p>
          <h1>Kayitlar arasinda Podo izini ara.</h1>
          <p>
            Tum veri kaynaklarini birlikte tarayarak kisi, konum, mesaj ve notlar
            arasindaki ipuclarini hizlica bul.
          </p>
        </div>

        <div className="find-panel">
          <SearchInput value={searchTerm} onSearchChange={setSearchTerm} />
          <dl>
            <div>
              <dt>Kaynak</dt>
              <dd>{Object.keys(jotformForms).length}</dd>
            </div>
            <div>
              <dt>Sonuc</dt>
              <dd>{filteredRecords.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      {isLoading && <p className="status">Veriler yukleniyor...</p>}

      {firstError && (
        <p className="status error">
          Veri cekilirken hata olustu:{' '}
          {firstError instanceof Error ? firstError.message : 'Bilinmeyen hata'}
        </p>
      )}

      {!isLoading && !firstError && (
        filteredRecords.length > 0 ? (
          <section className="row g-4">
            {filteredRecords.map((record) => (
              <div
                className="col-md-6 col-xl-4"
                key={`${record.formKey}-${record.submission.id}`}
              >
                <p className="record-source">{record.formLabel}</p>
                <SubmissionCard submission={record.submission} />
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
