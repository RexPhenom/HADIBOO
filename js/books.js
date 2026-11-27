// Books page: ebooks managed from the admin.
(function () {
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const list = document.getElementById("books-list"); if (!list) return;
  const empty = document.getElementById("books-empty");
  (async () => {
    let rows = [];
    if (window.HADIBOO_SB_ON) { try { const r = await hadibooApi("hadiboo_books?select=id,title,author,category,price,description,url&published=eq.true&order=created_at.desc&limit=200"); if (r.ok) rows = await r.json(); } catch (_) {} }
    list.setAttribute("aria-busy", "false");
    list.replaceChildren(...rows.map((b) => {
      const card = mk("article", "card course"), body = mk("div", "course-body"), tags = mk("div", "meta");
      if (b.price) tags.append(mk("span", "tag", b.price)); if (b.category) tags.append(mk("span", "tag", b.category)); tags.append(mk("span", "tag tag--new", "Ebook"));
      body.append(tags, mk("h3", "", b.title)); if (b.author) body.append(mk("div", "meta", "By " + b.author)); if (b.description) body.append(mk("p", "", b.description));
      if (/^https:\/\//i.test(b.url || "")) { const a = mk("a", "btn btn--primary btn--sm", "Get the book"); a.href = b.url; a.target = "_blank"; a.rel = "noopener noreferrer"; body.append(a); }
      card.append(body); return card;
    }));
    empty.hidden = rows.length > 0;
  })();
})();
