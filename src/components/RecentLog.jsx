import { Trash2, Flag } from 'lucide-react'
import { typeColor } from '../lib/constants'

export default function RecentLog({ sessions, loading, onDelete, onToggleFlag, hasMore, onShowMore }) {
  return (
    <section className="card">
      <h2>Recent entries</h2>
      {loading ? (
        <p className="empty">Loading your ledger…</p>
      ) : sessions.length === 0 ? (
        <p className="empty">No entries yet. Log your first session above — the ledger starts empty, like a new season.</p>
      ) : (
        <>
          <ul className="log-list">
            {sessions.map((s) => (
              <li className={`log-row ${s.flagged ? 'log-row-flagged' : ''}`} key={s.id}>
                <div className="log-left">
                  <span className="log-course">
                    <span className="type-dot" style={{ background: typeColor(s.type) }} />
                    {s.course}
                  </span>
                  <span className="log-meta">{s.date} · {s.type}{s.notes ? ` · ${s.notes}` : ''}</span>
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
          {hasMore && (
            <button className="show-more-btn" onClick={onShowMore}>Show more</button>
          )}
        </>
      )}
    </section>
  )
}
