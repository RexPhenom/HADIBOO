// Talks to Supabase (read-only settings/jobs/testimonials, insert-only enquiries) using plain fetch.
// If Supabase isn't configured the site works exactly as before.
(function () {
  const S = window.HADIBOO_SB || {}, C = window.HADIBOO;
  const on = !!(S.url && S.anonKey);
  window.HADIBOO_SB_ON = on;

  window.hadibooApi = (path, opts = {}) => fetch(S.url.replace(/\/$/, "") + "/rest/v1/" + path, {
    ...opts,
    headers: { apikey: S.anonKey, Authorization: "Bearer " + S.anonKey, "Content-Type": "application/json", ...(opts.headers || {}) },
  });

  // Save an enquiry so it appears in the admin inbox (never blocks the visitor)
  window.hadibooLogEnquiry = (e) => {
    if (!on) return;
    try {
      hadibooApi("hadiboo_enquiries", { method: "POST", keepalive: true, headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ name: String(e.name || "").slice(0, 120) || "Visitor", email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e.email || "")) ? String(e.email).slice(0, 254) : null, org: String(e.org || "").slice(0, 160) || null,
          topic: String(e.topic || "").slice(0, 160) || null, message: String(e.message || "").slice(0, 3000) || null, channel: e.channel || "form" }) }).catch(() => {});
    } catch (_) {}
  };

  const okPath = /^[A-Za-z0-9._\/-]{1,200}$/;
  window.hbMediaUrl = (p) => (S.url && okPath.test(p || "") && !/\.\./.test(p) ? S.url.replace(/\/$/, "") + "/storage/v1/object/public/hadiboo-gallery/" + p.split("/").map(encodeURIComponent).join("/") : "");

  const getJson = async (path, ms = 1800) => {
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
    try { const r = await hadibooApi(path, { signal: ac.signal }); return r.ok ? await r.json() : null; } catch (_) { return null; } finally { clearTimeout(t); }
  };

  window.HADIBOO_READY = (async function () {
    if (!on) return;
    const rows = await getJson("hadiboo_settings?select=key,value");
    if (!rows) return;
    for (const r of rows) {
      if (r.key === "contact" && r.value) {
        const v = r.value;
        if (typeof v.phone === "string") C.phone = v.phone.slice(0, 30);
        if (typeof v.whatsapp === "string" && /^\d{8,15}$/.test(v.whatsapp)) C.whatsapp = v.whatsapp;
        if (typeof v.email === "string") C.email = /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(v.email) ? v.email : "";
        if (typeof v.linkedin === "string" && /^https:\/\//.test(v.linkedin)) C.social = { ...C.social, linkedin: v.linkedin };
      }
      if (r.key === "announcement" && r.value && r.value.enabled && r.value.text) {
        const bar = document.createElement("div");
        bar.className = "announce"; bar.setAttribute("role", "status");
        bar.textContent = String(r.value.text).slice(0, 300);
        document.body.insertAdjacentElement("afterbegin", bar);
      }
    }
  })().catch(() => {});

  // Latest gallery photos (home page): hidden until there is at least one
  window.addEventListener("DOMContentLoaded", async () => {
    const box = document.getElementById("gallery-preview-list"); if (!on || !box) return;
    const rows = await getJson("hadiboo_gallery?select=title,image_path&order=created_at.desc&limit=3");
    if (!rows || !rows.length) return;
    rows.forEach((g) => {
      const a = document.createElement("a"); a.href = "gallery.html"; a.setAttribute("aria-label", "Open gallery: " + g.title);
      const im = document.createElement("img"); im.alt = g.title; im.loading = "lazy";
      im.src = S.url.replace(/\/$/, "") + "/storage/v1/object/public/hadiboo-gallery/" + encodeURI(g.image_path);
      a.append(im); box.append(a);
    });
    document.getElementById("gallery-preview").hidden = false;
  });

  // Testimonials (home page): section stays hidden until there is at least one approved quote
  window.addEventListener("DOMContentLoaded", async () => {
    const box = document.getElementById("testimonials-list"); if (!on || !box) return;
    const rows = await getJson("hadiboo_testimonials?select=name,role,quote&order=created_at.desc&limit=6");
    if (!rows || !rows.length) return;
    rows.forEach((t) => {
      const f = document.createElement("figure"); f.className = "card quote";
      const q = document.createElement("blockquote"); q.textContent = "“" + t.quote + "”";
      const c = document.createElement("figcaption"); c.textContent = t.name + (t.role ? " · " + t.role : "");
      f.append(q, c); box.append(f);
    });
    document.getElementById("testimonials").hidden = false;
  });
})();
