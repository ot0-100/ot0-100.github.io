ЛИЧНЫЙ РОСТ: сайт с синхронизацией через Supabase

1. supabase.com -> New project (бесплатный тариф).
2. SQL Editor -> вставь содержимое supabase.sql -> Run.
3. Authentication -> Providers -> Email: для простоты выключи "Confirm email".
4. Project Settings -> API: скопируй Project URL и публичный ключ (anon key или publishable key).
   Секретный ключ (service_role / secret) НЕ использовать.
5. Открой config.js и вставь url и key.
6. Выложи все файлы папки в корень сайта (Cloudflare Pages / Netlify / GitHub Pages), нужен HTTPS.
7. Открой сайт, нажми "Создать аккаунт" (почта + пароль от 6 символов).
8. После создания своего аккаунта: Authentication -> Sign In / Providers -> выключи "Allow new users to sign up",
   чтобы никто больше не мог зарегистрироваться.
9. На втором устройстве просто войди тем же аккаунтом.

iPhone: Safari -> Поделиться -> На экран "Домой".
Правило синхронизации: побеждает более свежее изменение (по времени). Редактируй на одном устройстве за раз.
