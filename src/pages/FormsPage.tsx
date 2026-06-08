import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/redux'
import { selectSubmissions, selectCountries, markRead } from '../features/formsSlice'
import type { FormSubmission } from '../features/formsSlice'
import Modal from '../components/Modal/Modal'
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
    <div style={{ padding: 24 }}>
      <h1>Forms</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button onClick={() => setActiveModal('uncontrolled')}>Open Uncontrolled Form</button>
        <button onClick={() => setActiveModal('hookform')}>Open Hook Form</button>
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
        <p>No submissions yet</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {submissions.map((s) => (
            <SubmissionCard key={s.id} submission={s} />
          ))}
        </ul>
      )}
    </div>
  )
}

function SubmissionCard({ submission: s }: { submission: FormSubmission }) {
  return (
    <li
      className={s.isNew ? 'submission-card submission-card--new' : 'submission-card'}
      style={{
        border: '1px solid',
        borderColor: s.isNew ? '#4CAF50' : '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      {s.image && (
        <img
          src={s.image}
          alt={`${s.name} avatar`}
          style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4 }}
        />
      )}
      <div>
        {s.isNew && <span style={{ color: '#4CAF50', fontWeight: 'bold', marginRight: 8 }}>NEW</span>}
        <strong>{s.name}</strong>, age {s.age}
        <br />
        {s.email} · {s.gender} · {s.country}
      </div>
    </li>
  )
}
