# Hadiboo

Career development · public health · capacity building — by Hadassah Esther Nsibietabasi.

A fast, accessible, zero-build website with an **auto-updating jobs board**: new public-health jobs are added automatically, and every job is **deleted automatically 6 days after it appears**.

```
hadiboo/
├── index.html · about.html · gallery.html · services.html · career.html · jobs.html · contact.html
├── css/styles.css          design system (tokens → components)
├── js/                     config, shared layout, jobs board, contact form
├── data/                   jobs.json (live) · sources.json · manual-jobs.json · seen.json
├── admin/                  secure admin dashboard (Supabase Auth + RLS)
├── supabase/schema.sql     database, security policies
├── scripts/fetch-jobs.mjs  add + prune pipeline
├── .github/workflows/jobs.yml   runs every 6 hours
├── assets/                 logo variants (original + transparent PNGs)
└── docs/                   DESIGN.md · UX.md · JOBS.md · LAUNCH.md
```

## Quick start
```bash
python3 -m http.server 8080     # or: npx serve
# open http://localhost:8080  — add ?demo=1 to /jobs.html to preview sample jobs
```

## Settings you must edit
`js/config.js` → business **email** (optional), phone/WhatsApp, social links, and an optional Formspree endpoint for the contact form.

## Jobs: how automatic add + delete works
See [docs/JOBS.md](docs/JOBS.md). In short: a GitHub Action runs every 6 hours → `scripts/fetch-jobs.mjs` prunes anything older than 6 days, fetches new roles (Jooble API + ReliefWeb + optional RSS + your manual list), stamps each with `addedAt`, and commits `data/jobs.json`. The browser also hides anything past 6 days, so expired jobs never show even if a run is delayed.

## Deploy
GitHub Pages: *Settings → Pages → Deploy from branch → `main` / root*. Full checklist in [docs/LAUNCH.md](docs/LAUNCH.md).

## Docs
- [Design system](docs/DESIGN.md) · [UX research & flows](docs/UX.md) · [Jobs pipeline](docs/JOBS.md) · [Launch checklist](docs/LAUNCH.md) · [Admin guide](docs/ADMIN.md) · [Security](docs/SECURITY.md)
