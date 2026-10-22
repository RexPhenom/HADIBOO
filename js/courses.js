// Courses page: links to courses recommended by Hadiboo, managed from the admin.
(function () {
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const list = document.getElementById("courses-list"); if (!list) return;
  const sel = document.getElementById("course-cat"), q = document.getElementById("course-q"), empty = document.getElementById("courses-empty");
  const safe = (u) => (/^https:\/\//i.test(u || "") ? u : "");
  let rows = [], cat = "";
  function draw() {
    const term = q.value.trim().toLowerCase();
    const out = rows.filter((c) => (!cat || c.category === cat) && (!term || [c.title, c.provider, c.description, c.category].join(" ").toLowerCase().includes(term)));
    list.replaceChildren(...out.map((c) => {
      const card = mk("article", "card course"), body = mk("div", "course-body");
      const tags = mk("div", "meta"); if (c.cost) tags.append(mk("span", "tag" + (/free/i.test(c.cost) ? " tag--new" : ""), c.cost)); if (c.category) tags.append(mk("span", "tag", c.category));
      body.append(tags, mk("h3", "", c.title)); if (c.provider) body.append(mk("div", "meta", "By " + c.provider)); if (c.description) body.append(mk("p", "", c.description));
      const u = safe(c.url); if (u) { const a = mk("a", "btn btn--primary btn--sm", "Go to course"); a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer"; body.append(a); }
      card.append(body); return card;
    }));
    empty.hidden = out.length > 0;
  }
  (async () => {
    let data = null;
    if (window.HADIBOO_SB_ON) { try { const r = await hadibooApi("hadiboo_courses?select=*&order=created_at.desc&limit=200"); if (r.ok) data = await r.json(); } catch (_) {} }
    list.setAttribute("aria-busy", "false"); rows = data || [];
    const cats = [...new Set(rows.map((c) => c.category).filter(Boolean))].sort();
    cats.forEach((c) => { const o = mk("option", "", c); o.value = c; sel.append(o); });
    draw();
  })();
  q.addEventListener("input", draw); sel.addEventListener("change", () => { cat = sel.value; draw(); });
})();
