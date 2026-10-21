# Go-live steps (about 20 minutes)

1. **GitHub** — github.com → New repository → name `hadiboo` → Public → Create (leave it empty).
2. **Upload** — unzip `hadiboo.zip`. On the empty repo page click *uploading an existing file*, drag in everything inside the `hadiboo` folder (include the hidden `.github` folder), then *Commit changes*.
   Or from a terminal inside the folder: `git init -b main && git add -A && git commit -m "Hadiboo" && git remote add origin https://github.com/<you>/hadiboo.git && git push -u origin main`
3. **Publish the site** — repo → Settings → Pages → *Deploy from a branch* → `main` / `/ (root)` → Save. Your link appears in ~1 minute: `https://<you>.github.io/hadiboo/`.
4. **Turn on automatic jobs** — get a free key at https://jooble.org/api/about → repo → Settings → Secrets and variables → Actions → *New repository secret* → name `JOOBLE_API_KEY`, paste the key. Then Actions tab → *Refresh jobs board* → *Run workflow*. (Also enable Actions → "Read and write permissions" in Settings → Actions → General → Workflow permissions.)
5. **Custom domain (optional)** — buy e.g. hadiboo.com/.org, then Settings → Pages → Custom domain.
6. **Add a business email (optional)** — edit `js/config.js` → `email`.
7. **Check** — open the live site on a phone: tap the green Chat button, pick a service, confirm WhatsApp opens with the message.

Later: replace placeholder copy, add real testimonials (with permission), add a privacy page.
