// Floating banner: five banners about what Hadassah-Esther does, each with a photo from the gallery and a
// write-up that fits it. They rotate by themselves every 6 seconds (dots let visitors jump to one). Closing
// hides it for that visit only; it is back on the next visit.
(function () {
  const KEY = "hb-banner-closed", EVERY = 6000;
  const C = (t) => "contact.html?topic=" + encodeURIComponent(t) + "#book";
  const banners = [
    { tag: "Meet Hadassah-Esther", title: "Career clarity, with a real plan", text: "Career development specialist and public health consultant: clear direction, a plan and the confidence to act.", cta: "Book a clarity session", href: C("Career Clarity & Mentorship"), img: "assets/hadassah.jpg", pos: "50% 18%", tone: "maroon" },
    { tag: "Warm, practical, personal", title: "Every session starts with listening", text: "Then comes a clear plan you can act on: ATS-friendly CVs and LinkedIn profiles that get you noticed.", cta: "See career services", href: "career.html", img: "assets/portrait-closeup.jpg", pos: "50% 30%", tone: "gold" },
    { tag: "In conversation", title: "Public health that reaches people", text: "Facilitating real sessions with participants: programme planning, health promotion and capacity building.", cta: "Explore public health support", href: C("Public Health & Development Programme Support"), img: "assets/hero-bg.jpg", pos: "50% 25%", tone: "sage" },
    { tag: "Mic in hand", title: "Invite her to speak or facilitate", text: "Workshops, trainings and talks on career growth, public health and development, live and practical.", cta: "Plan an event", href: C("Training, Speaking & Workshops"), img: "assets/speaking-closeup.jpg", pos: "50% 40%", tone: "plum" },
    { tag: "Mentorship", title: "Walk into your interview prepared", text: "One-to-one conversations, mock interviews and mentorship for students, graduates and young professionals.", cta: "Talk to Hadassah-Esther", href: C("Interview Preparation & Opportunity Readiness"), img: "assets/hadassah.jpg", pos: "50% 62%", tone: "ink" },
  ];
  if (/\/admin\//i.test(location.pathname) || window.__hbBanner) return;
  window.__hbBanner = true;
  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (_) {}

  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };
  const box = mk("aside", "fbanner");
  const logo = mk("img", "fb-logo"); logo.src = "assets/logo-mark.png"; logo.alt = "HADIBOO"; logo.width = 44; logo.height = 34;
  const close = mk("button", "fb-close", "×"); close.type = "button"; close.setAttribute("aria-label", "Close banner");
  const pic = mk("div", "fb-pic"), im = mk("img"); im.alt = ""; im.decoding = "async"; pic.append(im);
  const head = mk("div", "fb-head"); head.append(logo, mk("span", "fb-brand", "HADIBOO"), close);
  const tag = mk("span", "fb-tag"), title = mk("strong", "fb-title"), text = mk("p", "fb-text"), cta = mk("a", "fb-cta");
  const body = mk("div", "fb-body"); body.append(tag, title, text, cta);
  const dots = mk("div", "fb-dots"), ds = banners.map((_, i) => { const d = mk("button", "fb-dot"); d.type = "button"; d.setAttribute("aria-label", "Banner " + (i + 1)); d.addEventListener("click", () => { show(i); restart(); }); dots.append(d); return d; });
  box.append(pic, head, body, dots);

  let cur = -1, timer = null;
  function show(i) {
    cur = i; const b = banners[i];
    box.setAttribute("aria-label", "Featured: " + b.tag);
    box.className = "fbanner in fb-" + b.tone;
    im.src = b.img; im.style.objectPosition = b.pos;
    tag.textContent = b.tag; title.textContent = b.title; text.textContent = b.text; cta.textContent = b.cta + " →"; cta.href = b.href;
    ds.forEach((d, k) => d.classList.toggle("on", k === i));
    [pic, body].forEach((n) => { n.classList.remove("fb-swap"); void n.offsetWidth; n.classList.add("fb-swap"); });
  }
  function restart() { clearInterval(timer); timer = setInterval(() => show((cur + 1) % banners.length), EVERY); }
  close.addEventListener("click", () => { clearInterval(timer); box.classList.remove("in"); setTimeout(() => box.remove(), 400); try { sessionStorage.setItem(KEY, "1"); } catch (_) {} });
  setTimeout(() => { show(Math.floor(Date.now() / 864e5) % banners.length); document.body.appendChild(box); box.classList.remove("in"); requestAnimationFrame(() => box.classList.add("in")); restart(); }, 800);
})();
