import { useState, useEffect, useMemo } from 'react'
import { supabase } from './lib/supabaseClient'
import { fmt, addDays, startOfWeek, pad, WEEKDAY_LABELS, MONTH_LABELS } from './lib/dates'
import StatsHeader from './components/StatsHeader'
import QuickAddForm from './components/QuickAddForm'
import MonthCalendar from './components/MonthCalendar'
import DayDetail from './components/DayDetail'
import Distribution from './components/Distribution'
import Heatmap from './components/Heatmap'
import WeekChart from './components/WeekChart'
import CourseBreakdown from './components/CourseBreakdown'
import RecentLog from './components/RecentLog'

export default function Dashboard({ session }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(fmt(today))
  const [showDayDetail, setShowDayDetail] = useState(false)
  const [visibleCount, setVisibleCount] = useState(12)

  const [username, setUsername] = useState(session.user.user_metadata?.username || '')
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(username)
  const displayName = username || session.user.email.split('@')[0]

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

  async function toggleFlag(id, current) {
    setError('')
    const { error } = await supabase.from('sessions').update({ flagged: !current }).eq('id', id)
    if (error) { setError(error.message); return }
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, flagged: !current } : s)))
  }

  async function saveUsername() {
    const trimmed = nameDraft.trim()
    setEditingName(false)
    if (!trimmed || trimmed === username) return
    const { error } = await supabase.auth.updateUser({ data: { username: trimmed } })
    if (error) { setError(error.message); return }
    setUsername(trimmed)
  }

  const dayTotals = useMemo(() => {
    const map = {}
    for (const s of sessions) map[s.date] = (map[s.date] || 0) + s.minutes
    return map
  }, [sessions])

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

  const monthKey = `${viewYear}-${pad(viewMonth + 1)}`
  const monthSessions = useMemo(
    () => sessions.filter((s) => s.date.startsWith(monthKey)),
    [sessions, monthKey]
  )
  const monthTypeBreakdown = useMemo(() => {
    const map = {}
    for (const s of monthSessions) map[s.type] = (map[s.type] || 0) + s.minutes
    return Object.entries(map)
      .map(([name, mins]) => ({ name, hours: +(mins / 60).toFixed(1) }))
      .sort((a, b) => b.hours - a.hours)
  }, [monthSessions])

  const allTypeBreakdown = useMemo(() => {
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

  const daySessions = useMemo(
    () => sessions.filter((s) => s.date === selectedDate),
    [sessions, selectedDate]
  )

  const sortedAll = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [sessions]
  )
  const recent = sortedAll.slice(0, visibleCount)
  const hasMoreRecent = sortedAll.length > visibleCount

  return (
    <div className="ledger-app">
      <header className="hero">
        <div className="hero-top">
          <div>
            <h1 className="brand-title">Vestigare</h1>
            <p className="greeting">
              Welcome back,{' '}
              {editingName ? (
                <input
                  className="name-input"
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveUsername()}
                  onBlur={saveUsername}
                />
              ) : (
                <button
                  type="button"
                  className="name-btn"
                  onClick={() => { setNameDraft(username); setEditingName(true) }}
                  title="Click to edit your name"
                >
                  {displayName}
                </button>
              )}
            </p>
          </div>
          <button className="link-btn signout" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
        <StatsHeader
          todayMinutes={todayMinutes}
          thisWeekTotal={thisWeekTotal}
          streak={streak}
          yearTotalMinutes={yearTotalMinutes}
          year={year}
        />
      </header>

      <MonthCalendar
        viewYear={viewYear}
        viewMonth={viewMonth}
        setViewYear={setViewYear}
        setViewMonth={setViewMonth}
        dayTotals={dayTotals}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onViewDay={() => setShowDayDetail(true)}
      />

      <QuickAddForm date={selectedDate} onAdd={addSession} />
      {error && <p className="save-error">{error}</p>}

      {showDayDetail && (
        <DayDetail
          date={selectedDate}
          sessions={daySessions}
          onClose={() => setShowDayDetail(false)}
          onDelete={deleteSession}
          onToggleFlag={toggleFlag}
        />
      )}

      <Distribution
        monthData={monthTypeBreakdown}
        allData={allTypeBreakdown}
        monthLabel={`${MONTH_LABELS[viewMonth]} ${viewYear}`}
      />

      <section className="grid-2col">
        <WeekChart data={weekChartData} thisWeekTotal={thisWeekTotal} lastWeekTotal={lastWeekTotal} hasData={sessions.length > 0} />
        <CourseBreakdown data={courseBreakdown} />
      </section>

      <Heatmap year={year} setYear={setYear} dayTotals={dayTotals} />

      <RecentLog
        sessions={recent}
        loading={loading}
        onDelete={deleteSession}
        onToggleFlag={toggleFlag}
        hasMore={hasMoreRecent}
        onShowMore={() => setVisibleCount((v) => v + 12)}
      />
    </div>
  )
}
