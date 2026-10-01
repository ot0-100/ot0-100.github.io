-- Life Tracker: простая личная библиотека файлов.
-- Новых таблиц БД не нужно: используем только Supabase Storage.
-- Один приватный bucket, доступ по JWT только к своей папке <user_id>/...

insert into storage.buckets (id, name, public, file_size_limit)
values ('library', 'library', false, 52428800)
on conflict (id) do update
set public=false, file_size_limit=52428800;

drop policy if exists "library select own" on storage.objects;
drop policy if exists "library insert own" on storage.objects;
drop policy if exists "library update own" on storage.objects;
drop policy if exists "library delete own" on storage.objects;

create policy "library select own"
on storage.objects for select to authenticated
using (
  bucket_id='library'
  and owner_id=(select auth.uid()::text)
);

create policy "library insert own"
on storage.objects for insert to authenticated
with check (
  bucket_id='library'
  and (storage.foldername(name))[1]=(select auth.uid()::text)
);

create policy "library update own"
on storage.objects for update to authenticated
using (
  bucket_id='library'
  and owner_id=(select auth.uid()::text)
)
with check (
  bucket_id='library'
  and owner_id=(select auth.uid()::text)
);

create policy "library delete own"
on storage.objects for delete to authenticated
using (
  bucket_id='library'
  and owner_id=(select auth.uid()::text)
);
