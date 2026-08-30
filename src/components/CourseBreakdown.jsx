import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function CourseBreakdown({ data }) {
  return (
    <section className="card">
      <h2>By course</h2>
      {data.length === 0 ? (
        <p className="empty">No sessions logged yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(120, data.length * 34)}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid stroke="var(--line)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} axisLine={{ stroke: 'var(--line)' }} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={140} />
            <Tooltip contentStyle={{ fontFamily: 'IBM Plex Mono', fontSize: 12, borderRadius: 6, borderColor: 'var(--line)' }} />
            <Bar dataKey="hours" fill="var(--amber-deep)" radius={[0, 3, 3, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
