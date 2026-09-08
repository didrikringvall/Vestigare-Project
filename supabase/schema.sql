-- Run this once in your Supabase project's SQL editor (Project -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  course text not null,
  type text not null,
  minutes integer not null check (minutes > 0),
  notes text default '',
  flagged boolean not null default false,
  created_at timestamptz not null default now()
);

-- Row Level Security: each user can only ever see or touch their own rows.
alter table public.sessions enable row level security;

create policy "Users can view their own sessions"
  on public.sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
  on public.sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sessions"
  on public.sessions for delete
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────
-- MIGRATION: if your `sessions` table already exists (you ran the
-- block above previously), the CREATE TABLE line above won't touch
-- it. Run just this one line instead, once, to add the new column:
--
--   alter table public.sessions add column if not exists flagged boolean not null default false;
-- ─────────────────────────────────────────────────────────────────
