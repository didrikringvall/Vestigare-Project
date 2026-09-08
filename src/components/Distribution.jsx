import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { typeColor } from '../lib/constants'

export default function Distribution({ monthData, allData, monthLabel }) {
  const [view, setView] = useState('month') // 'month' | 'all'
  const data = view === 'month' ? monthData : allData

  return (
    <div className="card">
      <div className="dist-header">
        <h2>Where the hours go</h2>
        <div className="seg-toggle">
          <button className={view === 'month' ? 'seg-active' : ''} onClick={() => setView('month')}>{monthLabel}</button>
          <button className={view === 'all' ? 'seg-active' : ''} onClick={() => setView('all')}>All time</button>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="empty">No sessions logged {view === 'month' ? 'this month' : 'yet'}.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="hours" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
              {data.map((entry, i) => <Cell key={i} fill={typeColor(entry.name)} />)}
            </Pie>
            <Tooltip contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, borderRadius: 6, borderColor: 'var(--line)' }} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Sans' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
