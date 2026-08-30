# Study Ledger

A study-session tracker: log hours outside lectures/seminars, see a year-by-year
"training log" heatmap, compare week-over-week, and break hours down by course
and study type. Real accounts, real database — each person only ever sees their
own data.

Stack: **React + Vite** (frontend) and **Supabase** (auth + Postgres database).

---

## 1. Create your Supabase project

1. Go to https://supabase.com and sign up (free tier is enough).
2. Create a new project. Pick any name/region; set a database password (save it somewhere).
3. Once it's ready, go to **Project Settings -> API**. You'll need two values:
   - **Project URL**
   - **anon public** key

## 2. Set up the database table

1. In your Supabase project, open **SQL Editor -> New query**.
2. Paste the contents of `supabase/schema.sql` (in this project) and run it.
   This creates a `sessions` table and turns on **Row Level Security**, so each
   signed-in user can only read or write their own rows — the database enforces
   this, not just the frontend code.

## 3. (Optional but recommended for testing) Turn off email confirmation

By default Supabase requires clicking a confirmation link before you can sign
in. For quick local testing, go to **Authentication -> Providers -> Email** and
turn off "Confirm email". You can turn it back on before sharing the site with
real users.

## 4. Configure the app

1. In this project folder, copy `.env.example` to `.env`:
   ```
   cp .env.example .env
   ```
2. Fill in the two values from step 1:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   The anon key is safe to expose in frontend code — Row Level Security is what
   actually protects the data, not keeping this key secret.

## 5. Run it locally

```
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). Create an account,
sign in, and start logging sessions.

## 6. Deploy it as a real website

The easiest free option is **Vercel**:

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, sign in with GitHub, and "Import" the repo.
3. Vercel auto-detects Vite. Before deploying, add your two environment
   variables (same as your `.env`) under **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy. You'll get a live URL like `study-ledger.vercel.app` — free,
   and you can attach a custom domain later if you want one.

(Netlify works the same way if you'd rather use that.)

## Project structure

```
src/
  lib/
    supabaseClient.js   # connects to your Supabase project
    dates.js            # date/week/heatmap-grid helpers
    constants.js         # study types, colors, duration presets
  components/
    Auth.jsx             # sign in / sign up
    StatsHeader.jsx       # today / week / streak / year stat cards
    QuickAddForm.jsx      # the log-a-session form
    Heatmap.jsx            # year calendar heatmap
    WeekChart.jsx           # this week vs last week bar chart
    TypeBreakdown.jsx        # pie chart by study type
    CourseBreakdown.jsx       # bar chart by course
    RecentLog.jsx              # recent entries list, with delete
  Dashboard.jsx           # wires it all together, talks to Supabase
  App.jsx                  # decides Auth vs Dashboard based on session
  styles.css
supabase/
  schema.sql              # run this once in the Supabase SQL editor
```

## Ideas if you want to keep building

- Add a "target hours per week" goal and show progress against it
- Export your log as CSV
- Add a settings page to rename/merge courses
- Add tags instead of a single "type" per session
