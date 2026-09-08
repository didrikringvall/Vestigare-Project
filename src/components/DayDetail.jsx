import { Flag, Trash2, X } from 'lucide-react'
import { typeColor } from '../lib/constants'

export default function DayDetail({ date, sessions, onClose, onDelete, onToggleFlag }) {
  const displayDate = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0)

  return (
    <section className="card day-detail">
      <div className="day-detail-header">
        <div>
          <h2>{displayDate}</h2>
          <span className="log-meta">{(totalMinutes / 60).toFixed(1)}h logged</span>
        </div>
        <button className="del-btn" onClick={onClose} aria-label="close day detail"><X size={18} /></button>
      </div>
      {sessions.length === 0 ? (
        <p className="empty">Nothing logged this day yet.</p>
      ) : (
        <ul className="log-list">
          {sessions.map((s) => (
            <li className={`log-row ${s.flagged ? 'log-row-flagged' : ''}`} key={s.id}>
              <div className="log-left">
                <span className="log-course">
                  <span className="type-dot" style={{ background: typeColor(s.type) }} />
                  {s.course}
                </span>
                <span className="log-meta">{s.type}{s.notes ? ` · ${s.notes}` : ''}</span>
              </div>
              <div className="log-actions">
                <span className="log-mins">{(s.minutes / 60).toFixed(1)}h</span>
                <button
                  className={`flag-btn ${s.flagged ? 'flag-btn-active' : ''}`}
                  onClick={() => onToggleFlag(s.id, s.flagged)}
                  aria-label="flag for review"
                  title="Flag to go back and review this"
                >
                  <Flag size={15} />
                </button>
                <button className="del-btn" onClick={() => onDelete(s.id)} aria-label="delete entry">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
