import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fmt, addDays, mondayIndex, MONTH_LABELS } from '../lib/dates'

function level(mins) {
  if (mins === null) return -1
  if (mins <= 0) return 0
  if (mins < 30) return 1
  if (mins < 60) return 2
  if (mins < 120) return 3
  return 4
}

export default function Heatmap({ year, setYear, dayTotals }) {
  const weeks = useMemo(() => {
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    const gridStart = addDays(start, -mondayIndex(start))
    const out = []
    let cur = new Date(gridStart)
    while (cur <= end) {
      const col = []
      for (let i = 0; i < 7; i++) {
        const inYear = cur.getFullYear() === year
        const ds = fmt(cur)
        col.push({ date: new Date(cur), ds, minutes: inYear ? (dayTotals[ds] || 0) : null })
        cur = addDays(cur, 1)
      }
      out.push(col)
    }
    return out
  }, [year, dayTotals])

  return (
    <section className="card">
      <div className="heatmap-header">
        <h2>{year} training log</h2>
        <div className="year-nav">
          <button onClick={() => setYear((y) => y - 1)} aria-label="previous year"><ChevronLeft size={14} /></button>
          <span>{year}</span>
          <button onClick={() => setYear((y) => y + 1)} aria-label="next year" disabled={year >= new Date().getFullYear()}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="heatmap-scroll">
        <div className="heatmap-grid">
          {weeks.map((week, wi) => {
            const first = week[0]
            const showLabel = first.date.getDate() <= 7 && first.date.getFullYear() === year
            return (
              <div className="heatmap-week" key={wi}>
                {showLabel && <span className="month-label">{MONTH_LABELS[first.date.getMonth()]}</span>}
                {week.map((d, di) => (
                  <div
                    key={di}
                    className="heatmap-cell"
                    title={d.minutes === null ? '' : `${d.ds}: ${(d.minutes / 60).toFixed(1)}h`}
                    style={{ background: d.minutes === null ? 'transparent' : `var(--lvl${level(d.minutes)})` }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>
      <div className="legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => <div key={l} className="heatmap-cell" style={{ background: `var(--lvl${l})` }} />)}
        <span>More</span>
      </div>
    </section>
  )
}
