import { Trash2 } from 'lucide-react'
import { typeColor } from '../lib/constants'

export default function RecentLog({ sessions, loading, onDelete }) {
  return (
    <section className="card">
      <h2>Recent entries</h2>
      {loading ? (
        <p className="empty">Loading your ledger…</p>
      ) : sessions.length === 0 ? (
        <p className="empty">No entries yet. Log your first session above — the ledger starts empty, like a new season.</p>
      ) : (
        <ul className="log-list">
          {sessions.map((s) => (
            <li className="log-row" key={s.id}>
              <div className="log-left">
                <span className="log-course">
                  <span className="type-dot" style={{ background: typeColor(s.type) }} />
                  {s.course}
                </span>
                <span className="log-meta">{s.date} · {s.type}{s.notes ? ` · ${s.notes}` : ''}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="log-mins">{(s.minutes / 60).toFixed(1)}h</span>
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
