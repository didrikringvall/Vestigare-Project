export const TYPES = [
  { id: 'Reading', color: '#D69A2D' },
  { id: 'Problem sets', color: '#2F6F63' },
  { id: 'Lecture review', color: '#B44B3D' },
  { id: 'Writing', color: '#5B7FB5' },
  { id: 'Group study', color: '#8A6BAE' },
  { id: 'Exam prep', color: '#6E7F5C' },
  { id: 'Other', color: '#48584C' },
]

export const typeColor = (t) => (TYPES.find((x) => x.id === t) || TYPES[TYPES.length - 1]).color

export const DURATION_CHIPS = [
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '1h', minutes: 60 },
  { label: '1.5h', minutes: 90 },
  { label: '2h', minutes: 120 },
  { label: '3h', minutes: 180 },
]
