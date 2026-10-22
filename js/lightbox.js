// Shared photo viewer: hbLightbox.open([{src, alt, title, caption}], index, openerElement)
(function () {
  let items = [], idx = 0, box, img, cap, opener;
  const mk = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  function ensure() {
    if (box) return;
    box = mk("dialog", "lb"); box.setAttribute("aria-label", "Photo viewer");
    const close = mk("button", "lb-x", "×"); close.type = "button"; close.setAttribute("aria-label", "Close");
    const prev = mk("button", "lb-nav lb-prev", "‹"); prev.type = "button"; prev.setAttribute("aria-label", "Previous");
    const next = mk("button", "lb-nav lb-next", "›"); next.type = "button"; next.setAttribute("aria-label", "Next");
    img = mk("img", "lb-img"); cap = mk("p", "lb-cap");
    box.append(close, prev, img, next, cap); document.body.append(box);
    close.addEventListener("click", () => box.close());
    prev.addEventListener("click", () => show(idx - 1)); next.addEventListener("click", () => show(idx + 1));
    box.addEventListener("click", (e) => { if (e.target === box) box.close(); });
    box.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") show(idx - 1); if (e.key === "ArrowRight") show(idx + 1); });
    box.addEventListener("close", () => { if (opener && opener.focus) opener.focus(); });
  }
  function show(i) {
    if (!items.length) return; idx = (i + items.length) % items.length; const it = items[idx];
    img.src = it.src; img.alt = it.alt || it.title || "Photo"; cap.replaceChildren();
    if (it.title) cap.append(mk("strong", "", it.title)); if (it.caption) cap.append(mk("span", "", it.caption));
    box.classList.toggle("single", items.length < 2);
  }
  window.hbLightbox = { open(list, i, from) { items = list; opener = from; ensure(); show(i || 0); if (!box.open) box.showModal(); } };
})();
