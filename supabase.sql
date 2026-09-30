create table public.tracker (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.tracker enable row level security;
create policy "own select" on public.tracker for select using (auth.uid() = user_id);
create policy "own insert" on public.tracker for insert with check (auth.uid() = user_id);
create policy "own update" on public.tracker for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Сервер сам проставляет время изменения, поэтому часы телефона/ПК
-- не влияют на порядок синхронизации. Выполнить один раз в Supabase SQL Editor.
create or replace function public.set_tracker_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tracker_set_updated_at on public.tracker;
create trigger tracker_set_updated_at
before update on public.tracker
for each row
execute function public.set_tracker_updated_at();
