// Public gallery: reads photos added in the admin (Supabase) and shows them with filters + lightbox.
(function () {
  const S = window.HADIBOO_SB || {};
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const base = S.url ? S.url.replace(/\/$/, "") + "/storage/v1/object/public/hadiboo-gallery/" : "";
  const okPath = /^[A-Za-z0-9/_.-]{3,200}$/;
  const urlOf = (p) => (okPath.test(p) ? base + p.split("/").map(encodeURIComponent).join("/") : "");
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  async function load(limit) {
    if (!window.HADIBOO_SB_ON) return null;
    try {
      const r = await hadibooApi("hadiboo_gallery?select=id,title,caption,category,image_path,created_at&order=created_at.desc&limit=" + limit);
      return r.ok ? await r.json() : null;
    } catch (_) { return null; }
  }

  function tile(it, list, i) {
    const b = mk("button", "g-item"); b.type = "button"; b.setAttribute("aria-label", "Open photo: " + (it.title || "gallery photo"));
    const im = mk("img"); im.src = urlOf(it.image_path); im.alt = it.title || "Hadiboo gallery photo"; im.loading = "lazy"; im.decoding = "async";
    b.append(im); if (it.title) b.append(mk("span", "g-cap", it.title));
    b.addEventListener("click", () => hbLightbox.open(list.map((x) => ({ src: urlOf(x.image_path), title: x.title, caption: x.caption })), i, b)); return b;
  }

  /* ---------- gallery page ---------- */
  async function page() {
    const status = document.getElementById("gallery-status"), filters = document.getElementById("gallery-filters");
    const data = await load(200);
    grid.setAttribute("aria-busy", "false");
    if (!data || !data.length) { grid.replaceChildren(); status.hidden = false; return; }
    status.hidden = true;
    const cats = [...new Set(data.map((d) => d.category).filter(Boolean))].sort();
    let cur = "";
    function render() {
      const list = data.filter((d) => !cur || d.category === cur);
      grid.replaceChildren(...list.map((d, i) => tile(d, list, i)));
    }
    if (cats.length) {
      const chip = (label, v) => { const b = mk("button", "wa-chip" + (v === cur ? " on" : ""), label); b.type = "button"; b.setAttribute("aria-pressed", v === cur);
        b.addEventListener("click", () => { cur = v; [...filters.children].forEach((c) => { const on = c === b; c.classList.toggle("on", on); c.setAttribute("aria-pressed", on); }); render(); }); return b; };
      filters.replaceChildren(chip("All", ""), ...cats.map((c) => chip(c, c))); filters.hidden = false;
    }
    render();
  }

  page();
})();
