# Admin guide

**URL:** `https://<your-site>/admin/` (not linked anywhere on the public site).

## One-time setup
1. Create a Supabase project (free) — or reuse one you already have (all Hadiboo tables/functions are prefixed `hadiboo_`, so they won't clash with another app's).
2. SQL Editor → paste `supabase/schema.sql` → Run. (Edit the admin email at the bottom first if needed.)
3. Authentication → Users → **Add user** (your admin email + strong password, tick *Auto Confirm*).
4. Settings → API → copy **Project URL** and the **anon / publishable key** into `js/supabase-config.js`. (Never the service_role key.)
5. Follow the checklist in [SECURITY.md](SECURITY.md).
6. Commit/push. Open `/admin/` and sign in.

## What you can manage
| Tab | Does |
|---|---|
| Dashboard | Live jobs, new enquiries, pending testimonials, admins |
| Jobs | Add / hide / renew (+6 days) / delete. Each job auto-deletes 6 days after adding |
| Enquiries | Every contact-form and WhatsApp-widget lead; mark new/contacted/closed; export CSV |
| Gallery | Upload photos (auto-resized, GPS/EXIF data stripped), add title, caption and category, then edit, hide or delete. Shows instantly on the Gallery page; the 3 newest also appear on the home page |
| Testimonials | Add real quotes; approve/hide; shown on the home page only when approved |
| Site settings | Phone, WhatsApp number, email, LinkedIn, and a site-wide announcement banner — changes appear live without redeploying |
| Admins | Allow another email (then create their login in Supabase) |

Page wording (services, bio) stays in the HTML files; ask Claude to update them.

## How expiry works
Each job has `expires_at = added_at + 6 days`. The public site only sees jobs where `expires_at > now()` (enforced by the database, so it's exact). A cleanup (`purge_expired_jobs`) runs hourly via pg_cron when available, and whenever the admin page opens.
Jobs auto-imported from Jooble (GitHub Action) follow the same 6-day rule in `data/jobs.json`.

## Giving Hadassah-Esther her own admin login
1. In the admin → **Admins** tab → add her email (this allows it).
2. Supabase → Authentication → Users → **Invite user** → her email. She gets an email and sets her own password — nobody else ever sees it.
3. She signs in at `/admin/` and can post to the Gallery, jobs, etc.
(If you ran the base schema earlier, also run `supabase/gallery.sql` once. New installs get the gallery from `schema.sql`.)

## Adding Hadassah (hadiboocareerclinic@gmail.com) as admin
1. Run `supabase/updates-2.sql` in the Supabase SQL editor (it adds her email to the admin list, plus reviews, sponsors, awards).
2. Supabase → Authentication → Users → **Add user → Send invitation** (or "Create new user") for hadiboocareerclinic@gmail.com.
3. Authentication → URL Configuration: add `https://rexphenom.github.io/HADIBOO/admin/` to Redirect URLs.
4. She opens `/admin/`, clicks **Forgot password?**, and sets her own password from the email link. You never see it.

## New tabs
Awards & certificates, Sponsors (logo + write-up), Reviews (approve/hide, auto-publish switch).
Set the business email under **Site settings** to switch on the "Send by email" button.
