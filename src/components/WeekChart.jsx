import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function WeekChart({ data, thisWeekTotal, lastWeekTotal, hasData }) {
  return (
    <div className="card">
      <h2>This week vs. last week</h2>
      {!hasData ? (
        <p className="empty">Nothing logged yet this week.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={4}>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, borderRadius: 6, borderColor: 'var(--line)' }} />
            <Bar dataKey="This week" fill="var(--amber)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Last week" fill="var(--teal)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
      <p className="log-meta" style={{ marginTop: 8 }}>
        {thisWeekTotal.toFixed(1)}h this week vs {lastWeekTotal.toFixed(1)}h last week
        {lastWeekTotal > 0 ? ` (${thisWeekTotal >= lastWeekTotal ? '+' : ''}${(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(0)}%)` : ''}
      </p>
    </div>
  )
}
