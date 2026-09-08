import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fmt, addDays, mondayIndex, MONTH_LABELS, WEEKDAY_LABELS } from '../lib/dates'

function level(mins) {
  if (mins <= 0) return 0
  if (mins < 30) return 1
  if (mins < 60) return 2
  if (mins < 120) return 3
  return 4
}

export default function MonthCalendar({ viewYear, viewMonth, setViewYear, setViewMonth, dayTotals, selectedDate, onSelectDate, onViewDay }) {
  const todayStr = fmt(new Date())

  const weeks = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1)
    const last = new Date(viewYear, viewMonth + 1, 0)
    const gridStart = addDays(first, -mondayIndex(first))
    const gridEnd = addDays(last, 6 - mondayIndex(last))
    const out = []
    let cur = new Date(gridStart)
    while (cur <= gridEnd) {
      const week = []
      for (let d = 0; d < 7; d++) {
        week.push({ date: new Date(cur), ds: fmt(cur), inMonth: cur.getMonth() === viewMonth })
        cur = addDays(cur, 1)
      }
      out.push(week)
    }
    return out
  }, [viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) } else setViewMonth(viewMonth - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) } else setViewMonth(viewMonth + 1)
  }

  return (
    <section className="card">
      <div className="cal-header">
        <button onClick={prevMonth} aria-label="previous month"><ChevronLeft size={16} /></button>
        <h2>{MONTH_LABELS[viewMonth]} {viewYear}</h2>
        <button onClick={nextMonth} aria-label="next month"><ChevronRight size={16} /></button>
      </div>

      <div className="cal-weekdays">
        {WEEKDAY_LABELS.map((d) => <span key={d}>{d}</span>)}
      </div>

      {weeks.map((week, wi) => (
        <div className="cal-week" key={wi}>
          {week.map((d) => {
            const mins = dayTotals[d.ds] || 0
            const isToday = d.ds === todayStr
            const isSelected = d.ds === selectedDate
            const cls = [
              'cal-day',
              !d.inMonth && 'cal-day-out',
              isToday && 'cal-day-today',
              isSelected && 'cal-day-selected',
            ].filter(Boolean).join(' ')
            return (
              <button
                type="button"
                key={d.ds}
                className={cls}
                style={mins > 0 && !isSelected ? { background: `var(--lvl${level(mins)})` } : undefined}
                onClick={() => d.inMonth && onSelectDate(d.ds)}
                disabled={!d.inMonth}
              >
                <span className="cal-day-num">{d.date.getDate()}</span>
                {mins > 0 && <span className="cal-day-dot" />}
              </button>
            )
          })}
        </div>
      ))}

      <div className="cal-footer">
        <div className="legend">
          <span className="legend-swatch legend-today" />Today
          <span className="legend-swatch legend-selected" />Selected
          <span className="legend-swatch legend-logged" />Session logged
        </div>
        <button type="button" className="view-day-btn" onClick={onViewDay}>
          View sessions for this day
        </button>
      </div>
    </section>
  )
}
