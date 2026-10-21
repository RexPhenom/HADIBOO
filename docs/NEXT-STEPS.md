# What to do now (in order)

## 1. Create the database (2 minutes, you do this)
1. Open https://supabase.com/dashboard/project/pedjksnjyltbkjhstaqp/sql/new
2. Open `supabase/schema.sql` from this folder, copy everything, paste it into the editor, click **Run**.
   It only ADDS tables starting with `hadiboo_`. Your SLI_TECH tables (`smg_*`) are not touched.
3. You should see "Success. No rows returned".

## 2. Put the site online
1. github.com → New repository → `hadiboo` → Public → Create.
2. Upload everything in this folder (include the hidden `.github` folder), or push with git.
3. Repo → Settings → Pages → Deploy from branch → `main` / root → Save.
4. Settings → Actions → General → Workflow permissions → **Read and write**.
5. Supabase → Authentication → URL Configuration → add `https://<your-username>.github.io/hadiboo/admin/` to Redirect URLs (needed for "Forgot password").

## 2b. Gallery
The gallery tables and photo storage are already part of `supabase/schema.sql` (step 1). If you ran an older copy before, run `supabase/gallery.sql` once as well.

## 3. Turn on automatic jobs
Get a free key at https://jooble.org/api/about → repo Settings → Secrets and variables → Actions → New secret `JOOBLE_API_KEY`. Then Actions → "Refresh jobs board" → Run workflow.

## 4. Sign in
Go to `https://<your-username>.github.io/hadiboo/admin/` and sign in with saviourinyang743@gmail.com and the password you already use for SLI_TECH.
(Do not turn off sign-ups in this Supabase project — SLI_TECH customers need them. They can't enter the Hadiboo admin anyway: only emails in `hadiboo_admins` can.)

## 5. Tell Claude "database is ready"
I'll then test that the public cannot read enquiries, that enquiries from the site arrive, and run the security advisor.
