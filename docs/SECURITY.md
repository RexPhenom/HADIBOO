# Security

## How the admin is protected
| Layer | What it does |
|---|---|
| **Supabase Auth** | Email + password sign-in checked on Supabase's servers. Passwords are hashed there; the site never sees or stores them. Built-in rate limiting on sign-in. |
| **Admin allowlist** | A signed-in user is only an admin if their confirmed email is in the `admins` table. Checked by the database function `is_admin()`. |
| **Row Level Security** | Every table is locked. Public visitors can only: read live jobs, approved testimonials, contact settings; and *insert* an enquiry. They can never read enquiries or change anything. Only admins can read/write the rest. Hacking or editing the page's JavaScript cannot bypass this. |
| **Input limits** | Database CHECK constraints cap lengths and require `https://` job links. |
| **Last-admin guard** | A trigger blocks deleting the last admin (no lock-out). |
| **Session safety** | 30-minute idle sign-out · "sign out on all devices" · 5 wrong passwords = 1-minute lockout · same error for wrong email/password (no account probing). |
| **XSS-safe UI** | Admin and public pages write data with `textContent` (never raw HTML); tested with an injected `<img onerror>` payload. |
| **CSP** | `Content-Security-Policy` on every page restricts which scripts/styles/connections are allowed; admin page forbids inline scripts and framing. |
| **Hidden from search** | `noindex`, `robots.txt` disallow, no links to `/admin/`. (Obscurity is only a bonus — real protection is the layers above.) |
| **CSV export** | Cells starting with `= + - @` are neutralised to prevent spreadsheet-formula injection. |

## What you must do (cannot be done from code)
1. **Disable public sign-ups** (only if the Supabase project is used for Hadiboo alone — do NOT do this on a shared project like SLI_TECH, it would stop that app's customers signing up): Supabase → Authentication → Sign In / Providers → Email → turn **off** "Allow new users to sign up". (Even if left on, strangers still can't enter the admin — they're not on the allowlist — but turn it off anyway.)
2. **Create the admin login yourself** in Supabase → Authentication → Users → *Add user* → email + a strong password (12+ chars, unique) → tick *Auto Confirm User*. Never share or send the password in chat.
3. Authentication → Policies/Password: set minimum length 12 and enable *leaked-password protection* (Pro plan feature).
4. **Turn on MFA** for the Supabase dashboard account that owns the project.
5. Keep the **service_role** key secret. Only the `anon` key belongs in `js/supabase-config.js`.
6. Authentication → URL Configuration: set *Site URL* to your live site and add `https://<site>/admin/` as a redirect URL (for password reset).
7. Never commit passwords/API keys to GitHub. GitHub Actions secrets are for the Jooble/ReliefWeb keys only.

## Known limits (honest notes)
- GitHub Pages cannot send HTTP security headers, so CSP is applied via `<meta>` (`frame-ancestors` can't be set that way, so the admin page refuses to run inside any frame via a script check instead). For stronger headers put the site behind Cloudflare (free) or host on Netlify/Vercel.
- The public enquiry form is open by design; spam is limited by field-length checks and a honeypot. If spam appears, add Cloudflare Turnstile.
- The jobs automatically imported by the GitHub Action live in `data/jobs.json` (public by nature). Jobs you add in the admin live in Supabase.
