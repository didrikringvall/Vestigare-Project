// Stockholm School of Economics — BSc in Business & Economics (BE), the
// mandatory foundation courses from semesters 1-3. Edit this list freely
// if your actual schedule looks different.
export const COURSES = [
  "BE101 Management I: Organizing",
  "BE102 Management II: Leadership",
  "BE201 Marketing",
  "BE202 Strategy",
  "BE301 Accounting I: Understanding Financial Reports",
  "BE302 Accounting II: Analyzing Performance",
  "BE401 Finance I",
  "BE402 Finance II",
  "BE501 Economics I: Microeconomics",
  "BE502 Economics II: Macroeconomics",
  "BE601 Data Analytics I",
  "BE602 Data Analytics II",
  "BE603 Data Analytics III",
  "BE671 Business Law I",
  "BE672 Business Law II",
  "BE701 Innovation",
  "BE801 Global Challenges I",
  "BE802 Global Challenges II",
  "BE003 B&E Reflection Series",
];

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
