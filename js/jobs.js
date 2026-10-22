// Renders the jobs board. Jobs live in data/jobs.json and are refreshed by a GitHub Action.
// Anything older than TTL days is hidden here too, so an expired job never shows even if the Action is delayed.
(async function () {
  const TTL = (window.HADIBOO && window.HADIBOO.jobsTtlDays) || 6;
  const DAY = 864e5;
  const list = document.getElementById("jobs-list");
  const count = document.getElementById("jobs-count");
  const q = document.getElementById("job-q"), type = document.getElementById("job-type"), sort = document.getElementById("job-sort");
  const demo = new URLSearchParams(location.search).has("demo");
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let jobs = [];
  try {
    const res = await fetch(demo ? "data/jobs.sample.json" : "data/jobs.json", { cache: "no-store" });
    const data = await res.json();
    jobs = (data.jobs || data || []);
  } catch (e) { list.innerHTML = `<div class="empty">We couldn't load jobs right now. Please refresh in a moment.</div>`; return; }

  if (!demo && window.HADIBOO_SB_ON) {
    try {
      const r = await hadibooApi("hadiboo_jobs?select=*&order=added_at.desc&limit=200");
      if (r.ok) (await r.json()).forEach((x) => jobs.push({ id: "sb-" + x.id, title: x.title, organization: x.organization, location: x.location, type: x.type, summary: x.summary, url: x.url, closing: x.closing, source: x.source, addedAt: x.added_at, expiresAt: x.expires_at }));
    } catch (_) {}
  }
  const now = Date.now();
  if (demo) jobs = jobs.map((j, i) => ({ ...j, addedAt: new Date(now - i * 0.9 * DAY).toISOString() }));
  jobs = jobs
    .map((j) => ({ ...j, _added: Date.parse(j.addedAt), _exp: j.expiresAt ? Date.parse(j.expiresAt) : Date.parse(j.addedAt) + TTL * DAY }))
    .filter((j) => j._exp > now);

  const types = [...new Set(jobs.map((j) => j.type).filter(Boolean))].sort();
  types.forEach((t) => type.insertAdjacentHTML("beforeend", `<option>${esc(t)}</option>`));

  function left(j) {
    const ms = j._exp - now, d = Math.floor(ms / DAY), h = Math.floor((ms % DAY) / 36e5);
    return d >= 1 ? `${d} day${d > 1 ? "s" : ""} ${h}h` : `${Math.max(h, 1)}h`;
  }

  function render() {
    const term = q.value.trim().toLowerCase();
    let out = jobs.filter((j) => (!type.value || j.type === type.value) && (!term || [j.title, j.organization, j.location, j.summary].join(" ").toLowerCase().includes(term)));
    out.sort((a, b) => sort.value === "expiring" ? a._exp - b._exp : b._added - a._added);
    count.textContent = `${out.length} open role${out.length === 1 ? "" : "s"}`;
    if (!out.length) {
      list.innerHTML = `<div class="empty"><img src="assets/logo-mark.png" alt=""><h3>No roles match right now</h3><p>New public-health jobs are added automatically. Check back soon, or clear your filters.</p></div>`;
      return;
    }
    list.innerHTML = out.map((j) => {
      const fresh = now - j._added < 1.5 * DAY, soon = j._exp - now < 1.5 * DAY;
      return `<article class="job">
        <div>
          <h3><a href="${esc(j.url)}" target="_blank" rel="noopener noreferrer">${esc(j.title)}</a></h3>
          <div class="meta"><span><b>${esc(j.organization || "Organisation not listed")}</b></span><span>📍 ${esc(j.location || "Nigeria")}</span>
            ${j.type ? `<span class="tag">${esc(j.type)}</span>` : ""}${fresh ? `<span class="tag tag--new">New</span>` : ""}${soon ? `<span class="tag tag--soon">Expiring soon</span>` : ""}</div>
          ${j.summary ? `<p style="margin:.6rem 0 0;color:var(--ink-soft);font-size:var(--fs-sm)">${esc(j.summary)}</p>` : ""}
          <div class="expiry">Listing disappears in <b>${left(j)}</b>${j.closing ? ` · Employer deadline: ${esc(j.closing)}` : ""} · via ${esc(j.source || "partner listing")}</div>
        </div>
        <a class="btn btn--primary" href="${esc(j.url)}" target="_blank" rel="noopener noreferrer">View &amp; apply</a>
      </article>`;
    }).join("");
  }
  [q, type, sort].forEach((el) => el.addEventListener("input", render));
  render();
})();
