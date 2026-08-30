import { useState, useEffect, useMemo } from 'react'
import { supabase } from './lib/supabaseClient'
import { fmt, addDays, startOfWeek, WEEKDAY_LABELS } from './lib/dates'
import StatsHeader from './components/StatsHeader'
import QuickAddForm from './components/QuickAddForm'
import Heatmap from './components/Heatmap'
import WeekChart from './components/WeekChart'
import TypeBreakdown from './components/TypeBreakdown'
import CourseBreakdown from './components/CourseBreakdown'
import RecentLog from './components/RecentLog'

export default function Dashboard({ session }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    loadSessions()
  }, [])

  async function loadSessions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false })
    if (error) setError(error.message)
    else setSessions(data)
    setLoading(false)
  }

  async function addSession(entry) {
    setError('')
    const { data, error } = await supabase.from('sessions').insert([entry]).select()
    if (error) { setError(error.message); return }
    setSessions((prev) => [data[0], ...prev])
  }

  async function deleteSession(id) {
    setError('')
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) { setError(error.message); return }
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  const dayTotals = useMemo(() => {
    const map = {}
    for (const s of sessions) map[s.date] = (map[s.date] || 0) + s.minutes
    return map
  }, [sessions])

  const courses = useMemo(() => [...new Set(sessions.map((s) => s.course))].sort(), [sessions])

  const todayStr = fmt(new Date())
  const todayMinutes = dayTotals[todayStr] || 0

  const thisWeekStart = startOfWeek(new Date())
  const lastWeekStart = addDays(thisWeekStart, -7)

  const weekChartData = useMemo(() => WEEKDAY_LABELS.map((label, i) => {
    const thisD = fmt(addDays(thisWeekStart, i))
    const lastD = fmt(addDays(lastWeekStart, i))
    return {
      day: label,
      'This week': +((dayTotals[thisD] || 0) / 60).toFixed(2),
      'Last week': +((dayTotals[lastD] || 0) / 60).toFixed(2),
    }
  }), [dayTotals, thisWeekStart, lastWeekStart])

  const thisWeekTotal = weekChartData.reduce((a, b) => a + b['This week'], 0)
  const lastWeekTotal = weekChartData.reduce((a, b) => a + b['Last week'], 0)

  const streak = useMemo(() => {
    let count = 0
    let cursor = new Date()
    if (!(dayTotals[fmt(cursor)] > 0)) cursor = addDays(cursor, -1)
    while (dayTotals[fmt(cursor)] > 0) {
      count++
      cursor = addDays(cursor, -1)
    }
    return count
  }, [dayTotals])

  const yearTotalMinutes = useMemo(
    () => sessions.filter((s) => s.date.startsWith(String(year))).reduce((a, s) => a + s.minutes, 0),
    [sessions, year]
  )

  const typeBreakdown = useMemo(() => {
    const map = {}
    for (const s of sessions) map[s.type] = (map[s.type] || 0) + s.minutes
    return Object.entries(map)
      .map(([name, mins]) => ({ name, hours: +(mins / 60).toFixed(1) }))
      .sort((a, b) => b.hours - a.hours)
  }, [sessions])

  const courseBreakdown = useMemo(() => {
    const map = {}
    for (const s of sessions) map[s.course] = (map[s.course] || 0) + s.minutes
    return Object.entries(map)
      .map(([name, mins]) => ({ name, hours: +(mins / 60).toFixed(1) }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8)
  }, [sessions])

  const recent = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 12),
    [sessions]
  )

  return (
    <div className="ledger-app">
      <header className="hero">
        <div className="hero-top">
          <span className="eyebrow">Study Ledger</span>
          <button className="link-btn signout" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
        <h1>Track the hours nobody sees.</h1>
        <p className="sub">Signed in as {session.user.email}</p>
        <StatsHeader
          todayMinutes={todayMinutes}
          thisWeekTotal={thisWeekTotal}
          streak={streak}
          yearTotalMinutes={yearTotalMinutes}
          year={year}
        />
      </header>

      <QuickAddForm courses={courses} onAdd={addSession} />
      {error && <p className="save-error">{error}</p>}

      <Heatmap year={year} setYear={setYear} dayTotals={dayTotals} />

      <section className="grid-2col">
        <WeekChart data={weekChartData} thisWeekTotal={thisWeekTotal} lastWeekTotal={lastWeekTotal} hasData={sessions.length > 0} />
        <TypeBreakdown data={typeBreakdown} />
      </section>

      <CourseBreakdown data={courseBreakdown} />

      <RecentLog sessions={recent} loading={loading} onDelete={deleteSession} />
    </div>
  )
}
