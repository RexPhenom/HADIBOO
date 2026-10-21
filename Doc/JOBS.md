# Jobs pipeline

**Automatic add:** `.github/workflows/jobs.yml` runs every 6 h (and on demand) → `scripts/fetch-jobs.mjs`.
**Automatic delete:** every run first removes jobs whose `addedAt` is > 6 days old. The browser (`js/jobs.js`) also filters on `addedAt`, so expiry is exact to the hour.

## Sources
1. **Jooble API** (above). 2. **ReliefWeb API** (health / WASH / nutrition roles in Nigeria). Get a free appname at https://apidoc.reliefweb.int/ then add repo secret **`RELIEFWEB_APPNAME`** (Settings → Secrets and variables → Actions).
3. **RSS feeds** — add to `data/sources.json` → `rss` (set `enabled: true`).
4. **Manual** — add objects to `data/manual-jobs.json` and push; the Action ingests them and clears the file.
   ```json
   [{"title":"Public Health Officer","organization":"Org","location":"Uyo","type":"Full-time","url":"https://…","summary":"…"}]
   ```

## Rules
- De-duplicated by id and URL. `data/seen.json` stops an expired job re-appearing (kept 30 days).
- Non-manual jobs must match `keywords` in `sources.json` (edit to widen/narrow).
- Change the lifetime in **both** `data/sources.json` (`ttlDays`) and `js/config.js` (`jobsTtlDays`).
- Test locally: `RELIEFWEB_APPNAME=… DRY_RUN=1 node scripts/fetch-jobs.mjs` · simulate time: `NOW=2026-11-01T00:00:00Z`.
- Respect each source's terms; link back to the original listing (the board never copies full posts).

## Jooble (main source)
Jooble offers a free official API. Get a key at https://jooble.org/api/about, then add it as repo secret **`JOOBLE_API_KEY`** (Settings → Secrets and variables → Actions). The Action searches Jooble for each keyword in `data/sources.json → jooble.keywords` (location: Nigeria, only jobs from the last 6 days), adds new ones, and they expire after 6 days. Edit the keyword list any time.
`jobs.html` also has a "Search more on Jooble" panel of deep links.
