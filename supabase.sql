create table public.tracker (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.tracker enable row level security;
create policy "own select" on public.tracker for select using (auth.uid() = user_id);
create policy "own insert" on public.tracker for insert with check (auth.uid() = user_id);
create policy "own update" on public.tracker for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
