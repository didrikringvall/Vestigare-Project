import { useState } from 'react'
import { Plus } from 'lucide-react'
import { fmt } from '../lib/dates'
import { TYPES, DURATION_CHIPS } from '../lib/constants'

export default function QuickAddForm({ courses, onAdd }) {
  const [date, setDate] = useState(fmt(new Date()))
  const [course, setCourse] = useState('')
  const [type, setType] = useState(TYPES[0].id)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(30)
  const [notes, setNotes] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const total = Number(hours) * 60 + Number(minutes)
    if (!course.trim() || total <= 0) return
    onAdd({ date, course: course.trim(), type, minutes: total, notes: notes.trim() })
    setNotes('')
  }

  return (
    <section className="quick-add card">
      <h2>Log a session</h2>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Course</label>
          <input list="course-list" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Linear Algebra" required />
          <datalist id="course-list">
            {courses.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.id}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={fmt(new Date())} />
        </div>
        <button type="submit" className="add-btn"><Plus size={16} />Add entry</button>

        <div className="field">
          <label>Duration</label>
          <div className="duration-row">
            <input type="number" min="0" max="12" value={hours} onChange={(e) => setHours(e.target.value)} />
            <span className="mono unit">h</span>
            <input type="number" min="0" max="59" step="5" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            <span className="mono unit">m</span>
          </div>
        </div>
        <div className="notes-field field">
          <label>Notes (optional)</label>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="what did you cover?" />
        </div>

        <div className="chips">
          {DURATION_CHIPS.map((c) => (
            <button
              type="button"
              key={c.label}
              className="chip"
              onClick={() => { setHours(Math.floor(c.minutes / 60)); setMinutes(c.minutes % 60) }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </form>
    </section>
  )
}
