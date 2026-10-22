// Awards & certificates + sponsors/partners (managed from the admin).
(function () {
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  async function get(path) { if (!window.HADIBOO_SB_ON) return null; try { const r = await hadibooApi(path); return r.ok ? await r.json() : null; } catch (_) { return null; } }
  const safeLink = (u) => (/^https:\/\//i.test(u || "") ? u : "");
  const ICON = { award: "🏆", certificate: "📜", recognition: "⭐" };

  /* ---- awards ---- */
  const awardsBox = document.getElementById("awards-list");
  if (awardsBox) get("hadiboo_awards?select=id,kind,title,issuer,year,description,image_path&order=created_at.desc&limit=100").then((rows) => {
    awardsBox.setAttribute("aria-busy", "false");
    // If the database can't be reached, still show the award from the founder's profile
    if (rows === null) rows = [{ kind: "award", title: "Award of Commitment in the Cancer Space", issuer: "Only Believe Care Foundation (OBCare)", description: "Recognising dedication to supporting cancer-related interventions and community awareness." }];
    if (!rows.length) { awardsBox.replaceChildren(mk("p", "", "Awards and certificates will be shown here soon.")); return; }
    const withImg = rows.filter((r) => r.image_path && window.hbMediaUrl(r.image_path));
    awardsBox.replaceChildren(...rows.map((r) => {
      const c = mk("article", "card award-card reveal in"), body = mk("div");
      c.append(mk("div", "medal", ICON[r.kind] || "🏆"), body);
      body.append(mk("h3", "", r.title));
      const meta = [r.issuer, r.year].filter(Boolean).join(" · "); if (meta) body.append(mk("div", "meta", meta));
      if (r.description) body.append(mk("p", "", r.description));
      if (r.image_path && window.hbMediaUrl(r.image_path)) {
        const b = mk("button", "cert"); b.type = "button"; b.setAttribute("aria-label", "View certificate: " + r.title);
        const im = mk("img"); im.src = window.hbMediaUrl(r.image_path); im.alt = "Certificate: " + r.title; im.loading = "lazy"; b.append(im);
        b.addEventListener("click", () => { const list = withImg.map((x) => ({ src: window.hbMediaUrl(x.image_path), title: x.title, caption: [x.issuer, x.year].filter(Boolean).join(" · ") })); window.hbLightbox.open(list, withImg.indexOf(r), b); });
        c.append(b);
      }
      return c;
    }));
  });

  /* ---- sponsors (page) ---- */
  const spBox = document.getElementById("sponsors-list");
  if (spBox) get("hadiboo_sponsors?select=id,name,blurb,website,logo_path&order=sort_order.asc,created_at.desc&limit=100").then((rows) => {
    spBox.setAttribute("aria-busy", "false");
    if (!rows || !rows.length) { document.getElementById("sponsors-empty").hidden = false; spBox.hidden = true; return; }
    spBox.replaceChildren(...rows.map((s) => {
      const c = mk("article", "card sponsor reveal in"), logo = mk("div", "logo"), im = mk("img"); im.src = window.hbMediaUrl(s.logo_path); im.alt = s.name + " logo"; im.loading = "lazy"; logo.append(im);
      c.append(logo, mk("h3", "", s.name)); if (s.blurb) c.append(mk("p", "", s.blurb));
      const w = safeLink(s.website); if (w) { const a = mk("a", "more", "Visit website"); a.href = w; a.target = "_blank"; a.rel = "noopener noreferrer"; c.append(a); }
      return c;
    }));
  });

  /* ---- sponsors (home strip) ---- */
  const strip = document.getElementById("home-sponsors-strip");
  if (strip) get("hadiboo_sponsors?select=name,website,logo_path&order=sort_order.asc,created_at.desc&limit=12").then((rows) => {
    if (!rows || !rows.length) return;
    strip.replaceChildren(...rows.map((s) => { const a = mk("a"); a.href = safeLink(s.website) || "recognition.html#sponsors"; if (safeLink(s.website)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.setAttribute("aria-label", s.name); const im = mk("img"); im.src = window.hbMediaUrl(s.logo_path); im.alt = s.name; im.loading = "lazy"; a.append(im); return a; }));
    document.getElementById("home-sponsors").hidden = false;
  });
})();
