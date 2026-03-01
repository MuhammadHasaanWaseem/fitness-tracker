-- Run this entire script in Supabase Dashboard → SQL Editor → New query, then Run.

-- User profiles (id matches auth.users.id)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users for select using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Create profile row when a new auth user is created (name from raw_user_meta_data)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Workouts (one per session)
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds int,
  created_at timestamptz not null default now()
);

-- Exercises (many per workout)
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  name text not null,
  sets int not null default 0,
  reps int not null default 0,
  weight text not null default '0',
  created_at timestamptz not null default now()
);

-- RLS
alter table public.workouts enable row level security;
alter table public.exercises enable row level security;

drop policy if exists "Users can manage own workouts" on public.workouts;
create policy "Users can manage own workouts"
  on public.workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage exercises of own workouts" on public.exercises;
create policy "Users can manage exercises of own workouts"
  on public.exercises for all
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

-- User analytics: login, logout, workout_completed (work history + counts)
create table if not exists public.user_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('login', 'logout', 'workout_completed')),
  created_at timestamptz not null default now(),
  metadata jsonb default '{}'
);

create index if not exists idx_user_analytics_user_event on public.user_analytics (user_id, event_type);
create index if not exists idx_user_analytics_created on public.user_analytics (user_id, created_at desc);

alter table public.user_analytics enable row level security;
drop policy if exists "Users can manage own analytics" on public.user_analytics;
create policy "Users can manage own analytics"
  on public.user_analytics for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
