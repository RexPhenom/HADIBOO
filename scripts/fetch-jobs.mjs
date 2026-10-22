#!/usr/bin/env node
/**
 * Hadiboo jobs pipeline — run by GitHub Actions (and runnable locally).
 *
 *   1. PRUNE   delete every job older than TTL days (default 6) — automatic deletion
 *   2. FETCH   pull new public-health jobs (ReliefWeb API, optional RSS feeds, manual list)
 *   3. ADD     stamp new jobs with addedAt, de-duplicate, write data/jobs.json
 *
 * Env:  JOOBLE_API_KEY     (free: https://jooble.org/api/about)
 *       RELIEFWEB_APPNAME  (free: https://apidoc.reliefweb.int/ → request an appname)
 *       DRY_RUN=1          print result without writing
 *       NOW=<ISO date>     override "now" (testing)
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (f) => path.join(root, "data", f);
const DAY = 864e5;
const now = process.env.NOW ? new Date(process.env.NOW) : new Date();
const dry = !!process.env.DRY_RUN;

const readJson = async (f, fb) => { try { return JSON.parse(await readFile(P(f), "utf8")); } catch { return fb; } };
const cfg = await readJson("sources.json", {});
const TTL = cfg.ttlDays ?? 6;
const store = await readJson("jobs.json", { jobs: [] });
const seenDb = await readJson("seen.json", { seen: {} });

const hash = (s) => { let h = 5381; for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0; return h.toString(36); };
const clean = (s = "") => String(s).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const clip = (s, n = 220) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);
const isNg = (l = "") => /nigeria|lagos|abuja|\bfct\b|port harcourt|kano|ibadan|enugu|uyo|akwa ibom|rivers|kaduna|benin city|abeokuta|ogun|oyo|delta|\bedo\b|anambra|\bimo\b|abia|cross river|calabar|plateau|\bjos\b|borno|maiduguri|bauchi|kwara|ilorin|osun|ondo|ekiti|nasarawa|\bniger\b|kebbi|sokoto|zamfara|katsina|jigawa|yobe|gombe|adamawa|taraba|benue|kogi|ebonyi|bayelsa|warri|onitsha|owerri|akure|asaba|lokoja|makurdi|minna|yola|abakaliki|ikeja|lekki|victoria island|ikoyi|ajah/i.test(l);
const relevant = (j) => {
  const text = `${j.title} ${j.summary} ${j.organization}`.toLowerCase();
  return (cfg.keywords || []).length === 0 || cfg.keywords.some((k) => text.includes(k));
};

/* 1 — PRUNE (automatic deletion after TTL days) */
const before = store.jobs.length;
let jobs = store.jobs.filter((j) => now - new Date(j.addedAt) < TTL * DAY && (j.source !== "Jooble" || isNg(j.location)));
const removed = before - jobs.length;
// forget "seen" ids after 30 days so memory stays small (a job older than that is long gone from sources)
for (const [id, t] of Object.entries(seenDb.seen)) if (now - new Date(t) > 30 * DAY) delete seenDb.seen[id];

/* 2 — FETCH */
const incoming = [];
const status = { ranAt: now.toISOString(), sources: {} };

async function fromReliefWeb() {
  const r = cfg.reliefweb;
  const appname = process.env.RELIEFWEB_APPNAME;
  if (!r?.enabled) return;
  if (!appname) { status.sources.reliefweb = "SKIPPED: RELIEFWEB_APPNAME not set (optional)"; console.warn("• ReliefWeb skipped: set RELIEFWEB_APPNAME secret."); return; }
  const body = {
    limit: r.limit ?? 40,
    preset: "latest",
    profile: "full",
    filter: { operator: "AND", conditions: [
      { field: "country.iso3", value: r.countryIso3 || "NGA" },
      { field: "theme.name", value: r.themes || ["Health"], operator: "OR" },
    ] },
    fields: { include: ["title", "url", "source.name", "date.created", "date.closing", "city.name", "country.name", "type.name", "career_categories.name", "body"] },
  };
  const res = await fetch(`https://api.reliefweb.int/v2/jobs?appname=${encodeURIComponent(appname)}`, {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body),
  });
  if (!res.ok) { console.warn(`• ReliefWeb error ${res.status}: ${clip(await res.text(), 200)}`); return; }
  const data = await res.json();
  for (const it of data.data || []) {
    const f = it.fields || {};
    incoming.push({
      id: "rw-" + it.id, title: clean(f.title), organization: clean(f.source?.[0]?.name),
      location: [f.city?.[0]?.name, f.country?.[0]?.name].filter(Boolean).join(", "),
      type: f.type?.[0]?.name || f.career_categories?.[0]?.name || "",
      summary: clip(clean(f.body)), url: f.url, source: "ReliefWeb",
      closing: f.date?.closing ? new Date(f.date.closing).toDateString().slice(4) : "",
    });
  }
  console.log(`• ReliefWeb: ${data.data?.length ?? 0} fetched`); status.sources.reliefweb = `${data.data?.length ?? 0} fetched`;
}

async function fromJooble() {
  const j = cfg.jooble;
  const key = (process.env.JOOBLE_API_KEY || "").trim();
  if (!j?.enabled) { status.sources.jooble = "disabled in sources.json"; return; }
  if (!key) { status.sources.jooble = "SKIPPED: JOOBLE_API_KEY secret is missing or empty"; console.warn("• Jooble skipped: set JOOBLE_API_KEY secret."); return; }
  const base = process.env.JOOBLE_BASE || "https://jooble.org/api";
  const from = new Date(+now - TTL * DAY).toISOString().slice(0, 10);
  let total = 0; const notes = [];
  const post = async (b, url) => {
    const res = await fetch(`${url}/${encodeURIComponent(key)}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) });
    const text = await res.text();
    if (!res.ok) { notes.push(`HTTP ${res.status} ${text.slice(0, 100)}`); return null; }
    try { return JSON.parse(text); } catch { notes.push("Not JSON: " + text.slice(0, 100)); return null; }
  };
  const size = String(j.resultsPerKeyword ?? 20), loc = j.location || "Nigeria";
  // Try progressively wider searches until Jooble returns something
  const attempts = (kw) => [
    [{ keywords: kw, location: loc, page: "1", ResultOnPage: size, datecreatedfrom: from }, base],
    [{ keywords: kw, location: loc, page: "1", ResultOnPage: size }, base],
    ...["Lagos", "Abuja", "Port Harcourt", "Nigeria, Lagos", "Ibadan"].map((l) => [{ keywords: kw, location: l, page: "1", ResultOnPage: size }, base]),
    [{ keywords: kw + " Nigeria", page: "1", ResultOnPage: size }, base],
  ];
  let firstEmpty = ""; const tried = {};
  for (const kw of j.keywords || []) {
    let data = null;
    for (const [b, url] of attempts(kw)) {
      try { data = await post(b, url); } catch (e) { notes.push("Request failed: " + e.message); data = null; }
      const ngOnly = data ? (data.jobs || []).filter((x) => isNg(x.location)) : [];
      if (!tried[kw]) tried[kw] = [];
      tried[kw].push(`${b.location || "-"}=${data ? (data.jobs || []).length : "err"}/${ngOnly.length}`);
      if (data && ngOnly.length) { data = { ...data, jobs: ngOnly }; break; }
      if (data) data = { ...data, jobs: [] };
      if (data && !firstEmpty) firstEmpty = JSON.stringify(data).slice(0, 160);
    }
    if (!data) continue;
    for (const it of data.jobs || []) {
      if (!it.link || !it.title || !isNg(it.location)) continue;     // Nigeria only
      incoming.push({
        id: "jo-" + (it.id ? String(it.id) : hash(it.link)), title: clean(it.title), organization: clean(it.company),
        location: clean(it.location), type: clean(it.type), summary: clip(clean(it.snippet)), url: it.link, source: "Jooble",
      });
    }
    total += (data.jobs || []).length;
  }
  if (!total) notes.push("No Nigerian jobs found. Attempts (endpoint:location=returned/Nigerian): " + JSON.stringify(Object.values(tried)[0] || []) + " " + firstEmpty);
  status.sources.jooble = `${total} fetched` + (notes.length ? "; problems: " + notes.slice(0, 4).join(" | ") : "");
  console.log(`• Jooble: ${total} fetched`, notes.length ? notes : "");
}

async function fromRss(feed) {
  if (!feed.enabled || !feed.url) return;
  const res = await fetch(feed.url, { headers: { "User-Agent": "HadibooJobsBot/1.0" } });
  if (!res.ok) { console.warn(`• RSS ${feed.name} error ${res.status}`); return; }
  const xml = await res.text();
  const items = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  const tag = (s, t) => clean((s.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`, "i")) || [])[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "");
  for (const it of items) {
    const url = tag(it, "link");
    incoming.push({ id: "rss-" + hash(url), title: tag(it, "title"), organization: feed.name, location: "", type: "", summary: clip(tag(it, "description")), url, source: feed.name });
  }
  console.log(`• RSS ${feed.name}: ${items.length} fetched`);
}

async function fromManual() {
  const manual = await readJson("manual-jobs.json", []);
  for (const m of manual) if (m.title && m.url) incoming.push({ id: m.id || "man-" + hash(m.url), source: "Hadiboo", ...m });
  if (manual.length) console.log(`• Manual: ${manual.length} entries`);
}

try { await fromJooble(); } catch (e) { status.sources.jooble = "FAILED: " + e.message; console.warn("• Jooble failed:", e.message); }
try { await fromReliefWeb(); } catch (e) { status.sources.reliefweb = "FAILED: " + e.message; console.warn("• ReliefWeb failed:", e.message); }
for (const f of cfg.rss || []) { try { await fromRss(f); } catch (e) { console.warn(`• RSS ${f.name} failed:`, e.message); } }
await fromManual();

/* 3 — ADD (dedupe, filter, stamp) */
const live = new Set(jobs.map((j) => j.id));
const liveUrls = new Set(jobs.map((j) => j.url));
let added = 0;
for (const j of incoming) {
  if (added >= (cfg.maxNewPerRun ?? 40)) break;
  if (!j.title || !j.url) continue;
  if (live.has(j.id) || liveUrls.has(j.url)) continue;
  if (seenDb.seen[j.id]) continue;                // already shown once and expired → never re-add
  if (!["Hadiboo", "Jooble"].includes(j.source) && !relevant(j)) continue;   // Jooble results are already keyword-searched
  jobs.push({ ...j, addedAt: now.toISOString(), expiresAt: new Date(+now + TTL * DAY).toISOString() });
  seenDb.seen[j.id] = now.toISOString();
  live.add(j.id); liveUrls.add(j.url); added++;
}
jobs.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

const out = { updatedAt: now.toISOString(), ttlDays: TTL, jobs };
console.log(`Jobs: +${added} added, -${removed} expired, ${jobs.length} live.`);
if (dry) { console.log(JSON.stringify(out, null, 2).slice(0, 1500)); process.exit(0); }
status.summary = `+${added} added, -${removed} expired, ${jobs.length} live`;
await writeFile(P("run-log.json"), JSON.stringify(status, null, 2) + "\n");
await writeFile(P("jobs.json"), JSON.stringify(out, null, 2) + "\n");
await writeFile(P("seen.json"), JSON.stringify(seenDb, null, 2) + "\n");
// Manual list is a one-shot inbox: clear it once ingested so entries don't linger in the repo.
if ((await readJson("manual-jobs.json", [])).length) await writeFile(P("manual-jobs.json"), "[]\n");
