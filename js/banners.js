// Floating banner: five promotional banners about what Hadassah-Esther does. One shows at a time and the
// banner changes by itself every 4 days (the same one for every visitor). Visitors can close it; it stays
// closed for that visit only, so it is back on the next visit (always on the home page).
(function () {
  const DAYS = 4, KEY = "hb-banner-closed";
  const C = (t) => "contact.html?topic=" + encodeURIComponent(t) + "#book";
  const banners = [
    { tag: "Career clarity", title: "Not sure what's next in your career?", text: "Hadassah-Esther helps you find a clear direction, a plan and the confidence to act on it.", cta: "Book a clarity session", href: C("Career Clarity & Mentorship"), img: "assets/hadassah.jpg", pos: "50% 18%", tone: "maroon" },
    { tag: "CV & LinkedIn", title: "A CV and LinkedIn that get noticed", text: "ATS-friendly CVs and LinkedIn profiles that position you for the roles you want.", cta: "See career services", href: "career.html", img: "assets/portrait-closeup.jpg", pos: "50% 30%", tone: "gold" },
    { tag: "Mentorship", title: "Walk into your interview prepared", text: "One-to-one conversations, mock interviews and mentorship for students, graduates and young professionals.", cta: "Talk to Hadassah-Esther", href: C("Interview Preparation & Opportunity Readiness"), img: "assets/speaking-closeup.jpg", pos: "50% 40%", tone: "plum" },
    { tag: "Public health", title: "Public health that reaches people", text: "Programme planning, health promotion and capacity building for organisations, shared with clarity.", cta: "Explore public health support", href: C("Public Health & Development Programme Support"), img: "assets/hero-bg.jpg", pos: "50% 22%", tone: "sage" },
    { tag: "Training & speaking", title: "Invite her to speak or facilitate", text: "Workshops, trainings and talks on career growth, public health and development, live and practical.", cta: "Plan an event", href: C("Training, Facilitation & Public Speaking"), img: "assets/hero-bg.jpg", pos: "50% 38%", tone: "ink" },
  ];
  if (/\/admin\//i.test(location.pathname)) return;
  const cycle = Math.floor(Date.now() / (DAYS * 864e5)), i = cycle % banners.length, b = banners[i];
  const id = "c" + cycle;
  try { if (sessionStorage.getItem(KEY) === id) return; } catch (_) {}

  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const box = mk("aside", "fbanner fb-" + b.tone); box.setAttribute("aria-label", "Featured: " + b.tag);
  const logo = mk("img", "fb-logo"); logo.src = "assets/logo-mark.png"; logo.alt = "HADIBOO"; logo.width = 44; logo.height = 34;
  const close = mk("button", "fb-close", "×"); close.type = "button"; close.setAttribute("aria-label", "Close banner");
  const body = mk("div", "fb-body");
  const a = mk("a", "fb-cta", b.cta + " →"); a.href = b.href;
  body.append(mk("span", "fb-tag", b.tag), mk("strong", "fb-title", b.title), mk("p", "fb-text", b.text), a);
  const pic = mk("div", "fb-pic"); const im = mk("img"); im.src = b.img; im.alt = ""; im.style.objectPosition = b.pos; im.decoding = "async"; pic.append(im);
  const head = mk("div", "fb-head"); head.append(logo, mk("span", "fb-brand", "HADIBOO"), close);
  box.append(pic, head, body);
  close.addEventListener("click", () => { box.classList.remove("in"); setTimeout(() => box.remove(), 400); try { sessionStorage.setItem(KEY, id); } catch (_) {} });
  setTimeout(() => { document.body.appendChild(box); requestAnimationFrame(() => box.classList.add("in")); }, 800);
})();
