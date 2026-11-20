// Public gallery: reads photos added in the admin (Supabase) and shows them with filters + lightbox.
(function () {
  const S = window.HADIBOO_SB || {};
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;
  const base = S.url ? S.url.replace(/\/$/, "") + "/storage/v1/object/public/hadiboo-gallery/" : "";
  const okPath = /^[A-Za-z0-9/_.-]{3,200}$/;
  const urlOf = (p) => (okPath.test(p) ? base + p.split("/").map(encodeURIComponent).join("/") : "");
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

  // Photos that always show (stored with the site); photos added in the admin appear after them.
  const FEATURED = [
    { local: true, src: "assets/hadassah.jpg", pos: "50% 18%", category: "Portraits", title: "Hadassah-Esther Nsibietabasi", caption: "Career development specialist and public health consultant, the person behind HADIBOO." },
    { local: true, src: "assets/hero-bg.jpg", pos: "50% 25%", category: "Speaking", title: "In conversation, on stage", caption: "Facilitating a session with participants: practical insight on career growth and public health, not just theory." },
    { local: true, src: "assets/portrait-closeup.jpg", pos: "50% 30%", category: "Portraits", title: "Warm, practical, personal", caption: "Every session starts with listening, then a clear plan you can act on." },
    { local: true, src: "assets/speaking-closeup.jpg", pos: "50% 40%", category: "Speaking", title: "Mic in hand", caption: "Workshops, trainings and talks on career development, public health and capacity building." },
    { local: true, src: "assets/logo-original.jpg", pos: "50% 50%", category: "Brand", title: "The HADIBOO mark", caption: "Career development, public health and capacity building under one name." },
  ];
  async function load(limit) {
    if (!window.HADIBOO_SB_ON) return null;
    try {
      const r = await hadibooApi("hadiboo_gallery?select=id,title,caption,category,image_path,created_at&order=created_at.desc&limit=" + limit);
      return r.ok ? await r.json() : null;
    } catch (_) { return null; }
  }

  function tile(it, list, i) {
    const b = mk("button", "g-item"); b.type = "button"; b.setAttribute("aria-label", "Open photo: " + (it.title || "gallery photo"));
    const im = mk("img"); im.src = it.local ? it.src : urlOf(it.image_path); if (it.local) { b.classList.add("local"); if (it.sq) b.classList.add("sq"); b.style.setProperty("--pos", it.pos); } b.style.setProperty("--i", i); im.alt = it.title || "Hadiboo gallery photo"; im.loading = "lazy"; im.decoding = "async";
    b.append(im); if (it.title) { const c = mk("span", "g-cap", it.title); if (it.caption) c.append(mk("span", "g-note", it.caption)); b.append(c); }
    b.addEventListener("click", () => hbLightbox.open(list.map((x) => ({ src: x.local ? x.src : urlOf(x.image_path), title: x.title, caption: x.caption })), i, b)); return b;
  }

  /* ---------- gallery page ---------- */
  async function page() {
    const status = document.getElementById("gallery-status"), filters = document.getElementById("gallery-filters");
    const data = [...FEATURED, ...((await load(200)) || [])];
    grid.setAttribute("aria-busy", "false");
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
