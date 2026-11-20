// Floating banner: five promotional banners about what Hadassah-Esther does. One shows at a time and the
// banner changes by itself every 4 days (the same one for every visitor). Visitors can close it; it stays
// closed until the next banner comes round.
(function () {
  const DAYS = 4, KEY = "hb-banner-closed";
  const C = (t) => "contact.html?topic=" + encodeURIComponent(t) + "#book";
  const banners = [
    { tag: "Career clarity", title: "Not sure what's next in your career?", text: "Get a clear direction, a plan and the confidence to act on it.", cta: "Book a clarity session", href: C("Career Clarity & Mentorship"), tone: "maroon" },
    { tag: "CV & LinkedIn", title: "A CV and LinkedIn that get noticed", text: "ATS-friendly CVs and LinkedIn profiles that position you for the roles you want.", cta: "See career services", href: "career.html", tone: "gold" },
    { tag: "Mentorship", title: "Walk into your interview prepared", text: "Mock interviews and one-to-one mentorship for students, graduates and young professionals.", cta: "Talk to Hadassah-Esther", href: C("Interview Preparation & Opportunity Readiness"), tone: "plum" },
    { tag: "Public health", title: "Programmes that work for communities", text: "Programme planning, health promotion and capacity building for your organisation.", cta: "Explore public health support", href: C("Public Health & Development Programme Support"), tone: "sage" },
    { tag: "Training & speaking", title: "Invite her to speak or facilitate", text: "Workshops, trainings and talks on career growth, public health and development.", cta: "Plan an event", href: C("Training, Facilitation & Public Speaking"), tone: "ink" },
  ];
  if (/\/admin\//i.test(location.pathname)) return;
  const cycle = Math.floor(Date.now() / (DAYS * 864e5)), i = cycle % banners.length, b = banners[i];
  const id = "c" + cycle;
  try { if (localStorage.getItem(KEY) === id) return; } catch (_) {}

  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const box = mk("aside", "fbanner fb-" + b.tone); box.setAttribute("aria-label", "Featured: " + b.tag);
  const logo = mk("img", "fb-logo"); logo.src = "assets/logo-mark.png"; logo.alt = "HADIBOO"; logo.width = 44; logo.height = 34;
  const close = mk("button", "fb-close", "×"); close.type = "button"; close.setAttribute("aria-label", "Close banner");
  const body = mk("div", "fb-body");
  const a = mk("a", "fb-cta", b.cta + " →"); a.href = b.href;
  body.append(mk("span", "fb-tag", b.tag), mk("strong", "fb-title", b.title), mk("p", "fb-text", b.text), a);
  const head = mk("div", "fb-head"); head.append(logo, mk("span", "fb-brand", "HADIBOO"), close);
  box.append(head, body);
  close.addEventListener("click", () => { box.classList.remove("in"); setTimeout(() => box.remove(), 400); try { localStorage.setItem(KEY, id); } catch (_) {} });
  setTimeout(() => { document.body.appendChild(box); requestAnimationFrame(() => box.classList.add("in")); }, 2500);
})();
