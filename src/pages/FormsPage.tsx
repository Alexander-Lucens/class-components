import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/redux'
import { selectSubmissions, selectCountries, markRead } from '../features/formsSlice'
import type { FormSubmission } from '../features/formsSlice'
import Modal from '../components/Modal/Modal'
import Header from '../components/Header'
import UncontrolledForm from '../forms/UncontrolledForm'
import HookForm from '../forms/HookForm'

type ModalType = 'uncontrolled' | 'hookform' | null

export default function FormsPage() {
  const dispatch = useAppDispatch()
  const submissions = useSelector(selectSubmissions)
  const countries = useSelector(selectCountries)
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  useEffect(() => {
    const newItems = submissions.filter((s) => s.isNew)
    if (newItems.length === 0) return
    const timers = newItems.map((s) =>
      setTimeout(() => dispatch(markRead(s.id)), 3000)
    )
    return () => timers.forEach(clearTimeout)
  }, [submissions, dispatch])

  void countries

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />
      <main className="forms-page">
        <div className="forms-page__header">
          <h1 className="forms-page__title">Forms</h1>
          <a href="/" className="forms-page__back">← Back to Home</a>
        </div>

        <div className="forms-page__actions">
          <button className="forms-page__open-btn" onClick={() => setActiveModal('uncontrolled')}>
            Open Uncontrolled Form
          </button>
          <button className="forms-page__open-btn" onClick={() => setActiveModal('hookform')}>
            Open Hook Form
          </button>
        </div>

        <Modal
          isOpen={activeModal === 'uncontrolled'}
          title="Uncontrolled Form"
          onClose={() => setActiveModal(null)}
        >
          <UncontrolledForm onClose={() => setActiveModal(null)} />
        </Modal>

        <Modal
          isOpen={activeModal === 'hookform'}
          title="Hook Form"
          onClose={() => setActiveModal(null)}
        >
          <HookForm onClose={() => setActiveModal(null)} />
        </Modal>

        {submissions.length === 0 ? (
          <p className="forms-page__empty">No submissions yet</p>
        ) : (
          <ul className="submissions-list">
            {submissions.map((s) => (
              <SubmissionCard key={s.id} submission={s} />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

function SubmissionCard({ submission: s }: { submission: FormSubmission }) {
  return (
    <li className={`submission-card${s.isNew ? ' submission-card--new' : ''}`}>
      {s.image && (
        <img
          src={s.image}
          alt={`${s.name} avatar`}
          className="submission-card__image"
        />
      )}
      <div className="submission-card__info">
        {s.isNew && <span className="submission-card__badge">NEW</span>}
        <div className="submission-card__name">{s.name}</div>
        <div className="submission-card__meta">
          Age {s.age} · {s.email} · {s.gender} · {s.country}
        </div>
      </div>
    </li>
  )
}
