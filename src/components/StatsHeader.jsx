import { Clock, Flame } from 'lucide-react'

export default function StatsHeader({ todayMinutes, thisWeekTotal, streak, yearTotalMinutes, year }) {
  return (
    <div className="stat-row">
      <div className="stat-card">
        <div className="num mono"><Clock size={16} />{(todayMinutes / 60).toFixed(1)}h</div>
        <div className="label">Today</div>
      </div>
      <div className="stat-card">
        <div className="num mono">{thisWeekTotal.toFixed(1)}h</div>
        <div className="label">This week</div>
      </div>
      <div className="stat-card">
        <div className="num mono"><Flame size={16} />{streak}</div>
        <div className="label">Day streak</div>
      </div>
      <div className="stat-card">
        <div className="num mono">{(yearTotalMinutes / 60).toFixed(0)}h</div>
        <div className="label">{year} total</div>
      </div>
    </div>
  )
}
