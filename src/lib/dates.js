export const pad = (n) => String(n).padStart(2, '0')
export const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const mondayIndex = (d) => (d.getDay() + 6) % 7 // Mon=0 ... Sun=6

export const startOfWeek = (d) => {
  const c = new Date(d)
  c.setDate(c.getDate() - mondayIndex(c))
  c.setHours(0, 0, 0, 0)
  return c
}

export const addDays = (d, n) => {
  const c = new Date(d)
  c.setDate(c.getDate() + n)
  return c
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
