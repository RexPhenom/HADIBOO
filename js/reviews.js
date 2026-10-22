// Public ratings & reviews. Submissions are saved to the database; they show here once approved
// (or instantly if the admin switched on auto-publish). The database decides — visitors cannot self-approve.
(function () {
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const stars = (n) => { const s = mk("span", "stars"); s.setAttribute("role", "img"); s.setAttribute("aria-label", n + " out of 5 stars");
    for (let i = 1; i <= 5; i++) { const x = mk("span", i <= n ? "" : "off", "★"); x.setAttribute("aria-hidden", "true"); s.append(x); } return s; };
  const when = (d) => { try { return new Date(d).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }); } catch (_) { return ""; } };
  async function fetchReviews(limit) {
    if (!window.HADIBOO_SB_ON) return null;
    try { const r = await hadibooApi("hadiboo_reviews?select=name,role,rating,comment,created_at&order=created_at.desc&limit=" + limit); return r.ok ? await r.json() : null; } catch (_) { return null; }
  }
  const avg = (rows) => rows.reduce((a, r) => a + r.rating, 0) / rows.length;
  const card = (r) => { const c = mk("article", "card review"); c.append(stars(r.rating), mk("p", "", r.comment),
    mk("div", "by", r.name + (r.role ? " · " + r.role : "") + (r.created_at ? " · " + when(r.created_at) : ""))); return c; };

  /* ---- home highlight ---- */
  const home = document.getElementById("home-reviews");
  if (home) fetchReviews(50).then((rows) => {
    if (!rows || !rows.length) return;
    const top = document.getElementById("home-reviews-top"), list = document.getElementById("home-reviews-list");
    const a = avg(rows); top.replaceChildren(stars(Math.round(a)), mk("strong", "", " " + a.toFixed(1) + " / 5"), mk("span", "", " from " + rows.length + " review" + (rows.length > 1 ? "s" : "")));
    list.replaceChildren(...rows.slice(0, 3).map(card)); home.hidden = false;
  });

  /* ---- reviews page ---- */
  const list = document.getElementById("reviews-list"); if (!list) return;
  const sum = document.getElementById("reviews-summary"), more = document.getElementById("reviews-more");
  let rows = [], shown = 0; const PAGE = 8;
  function draw() {
    list.replaceChildren(...rows.slice(0, shown).map(card)); more.hidden = shown >= rows.length;
  }
  fetchReviews(500).then((data) => {
    list.setAttribute("aria-busy", "false");
    if (!data) { sum.replaceChildren(mk("p", "", "Reviews are loading slowly right now. Please try again shortly.")); return; }
    rows = data;
    if (!rows.length) { sum.replaceChildren(mk("p", "lead", "No reviews yet — be the first to share your experience.")); return; }
    const a = avg(rows), big = mk("div", "rating-big"); big.append(mk("b", "", a.toFixed(1)), stars(Math.round(a)), mk("span", "", rows.length + " review" + (rows.length > 1 ? "s" : "")));
    const bars = mk("div", "bars"); bars.setAttribute("aria-label", "Rating breakdown");
    for (let n = 5; n >= 1; n--) { const c = rows.filter((r) => r.rating === n).length, row = mk("div", "bar"), i = mk("i"), b = mk("b"); b.style.width = (c / rows.length * 100) + "%"; i.append(b); row.append(mk("span", "", n + " ★"), i, mk("span", "", String(c))); bars.append(row); }
    sum.replaceChildren(big, bars); shown = PAGE; draw();
  });
  more.addEventListener("click", () => { shown += PAGE; draw(); });

  /* ---- submit form ---- */
  const form = document.getElementById("review-form"), msg = document.getElementById("review-msg");
  const say = (t, ok) => { msg.textContent = t; msg.style.color = ok ? "var(--sage)" : "#d0453c"; };
  if (!window.HADIBOO_SB_ON) { form.querySelectorAll("input,textarea,button").forEach((x) => (x.disabled = true)); say("Reviews will open very soon.", false); return; }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return;                    // honeypot
    const d = new FormData(form), rating = parseInt(d.get("rating"), 10), name = String(d.get("name") || "").trim(), role = String(d.get("role") || "").trim(), comment = String(d.get("comment") || "").trim();
    if (!(rating >= 1 && rating <= 5)) return say("Please choose a star rating.", false);
    if (!name) return say("Please enter your name.", false);
    if (comment.length < 5) return say("Please write a few words about your experience.", false);
    let last = 0; try { last = +localStorage.getItem("hb-review-ts") || 0; } catch (_) {}
    if (Date.now() - last < 60 * 60 * 1000) return say("Thanks — you've already sent a review recently. Please try again later.", false);
    const btn = form.querySelector("button[type=submit]"); btn.disabled = true; say("Sending…", true);
    try {
      const r = await hadibooApi("hadiboo_reviews", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ name: name.slice(0, 80), role: role.slice(0, 80) || null, rating, comment: comment.slice(0, 600) }) });
      if (!r.ok) throw new Error();
      try { localStorage.setItem("hb-review-ts", String(Date.now())); } catch (_) {}
      form.reset(); say("Thank you! Your review has been received and will appear once it has been checked.", true);
    } catch (_) { say("Sorry, we couldn't send your review. Please try again.", false); }
    btn.disabled = false;
  });
})();
