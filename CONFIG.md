# Backend setup (Supabase)

## 1. Create tables and RLS

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project **Fitness Tracker**.
2. Go to **SQL Editor** → **New query**.
3. Copy the contents of **`supabase_schema.sql`** and paste into the editor, then click **Run**.
4. You should see “Success. No rows returned.” Tables `users`, `workouts`, and `exercises` and their RLS policies are created. A trigger creates a `users` row when someone signs up (with name from the form).

## 2. Auth: optional – no email confirmation (for development)

If sign up does not log the user in immediately:

1. In the dashboard go to **Authentication** → **Providers** → **Email**.
2. Turn **off** “Confirm email” if you want users to use the app right after sign up without verifying email.
3. Save.

## 3. API keys (if something still fails)

1. Go to **Project Settings** (gear) → **API**.
2. Copy **Project URL** and **anon public** key.
3. In the app, open **`src/config/supabase.ts`** and set:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_ANON_KEY` = your anon public key (long JWT or `sb_publishable_...`)

Session is stored with AsyncStorage so sign in persists after app restart.
