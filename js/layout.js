// Injects the shared header + footer so every page stays in sync.
(window.HADIBOO_READY || Promise.resolve()).then(function () {
  const C = window.HADIBOO;
  const page = document.body.dataset.page || "";
  const main = [
    ["index.html", "Home", "home"], ["about.html", "About", "about"], ["services.html", "Services", "services"],
    ["career.html", "Career", "career"], ["jobs.html", "Jobs", "jobs"], ["contact.html", "Contact", "contact"],
  ];
  const more = [["courses.html", "Courses", "courses"], ["gallery.html", "Gallery", "gallery"], ["recognition.html", "Awards & Partners", "recognition"], ["reviews.html", "Reviews", "reviews"]];
  const li = ([h, t, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t.replace("&", "&amp;")}</a></li>`;
  const moreActive = more.some((m) => m[2] === page);
  const nav = main.map(li).join("");
  const navAll = [...main.slice(0, 5), ...more, main[5]].map(li).join("");

  document.body.insertAdjacentHTML("afterbegin", `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="Hadiboo home">
        <img src="assets/logo-mark.png" alt="" width="60" height="46"><span>HADIBOO</span>
      </a>
      <ul class="nav-links" id="menu">${main.slice(0, 5).map(li).join("")}
        <li class="has-sub${moreActive ? " active" : ""}"><button type="button" aria-expanded="false" aria-haspopup="true">More</button><ul class="sub">${more.map(li).join("")}</ul></li>
        ${li(main[5])}
        <li><a class="btn btn--primary" href="contact.html#book">Book a consult</a></li>
      </ul>
      <div class="nav-right" id="nav-right"><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu">Menu</button></div>
    </div>
  </header>`);

  const soc = Object.entries(C.social).filter(([, v]) => v).map(([k, v]) => `<li><a href="${v}" rel="noopener">${k === "linkedin" ? "LinkedIn" : k[0].toUpperCase() + k.slice(1)}</a></li>`).join("");
  document.body.insertAdjacentHTML("beforeend", `
  <footer class="site-footer">
    <div class="container">
      <div class="foot-grid">
        <div>
          <img class="foot-logo" src="assets/logo-full.png" alt="Hadiboo">
          <p>Career development for students and professionals; public health, development and capacity building for organizations.</p>
        </div>
        <div><h4>Explore</h4><ul>${navAll}</ul></div>
        <div><h4>Work with us</h4><ul>
          <li><a href="career.html">Career development</a></li>
          <li><a href="courses.html">Courses</a></li>
          <li><a href="services.html#s5">Public health support</a></li>
          <li><a href="services.html#s4">Training &amp; speaking</a></li>
          <li><a href="recognition.html#sponsors">Become a sponsor</a></li>
          <li><a href="reviews.html">Rate &amp; review us</a></li></ul></div>
        <div><h4>Reach us</h4><ul>
          ${C.email ? `<li><a href="mailto:${C.email}">${C.email}</a></li>` : `<li><a href="contact.html#book">Send us an email</a></li>`}
          ${C.phone ? `<li><a href="tel:${C.phone.replace(/\s/g, "")}">${C.phone}</a></li>` : ""}
          ${C.whatsapp ? `<li><a href="https://wa.me/${C.whatsapp}" rel="noopener">WhatsApp</a></li>` : ""}
          ${soc}<li>${C.location}</li></ul></div>
      </div>
      <div class="foot-bottom"><span>© ${new Date().getFullYear()} Hadiboo. All rights reserved.</span>
        <span>Led by ${C.owner}.</span></div>
    </div>
  </footer>`);

  // theme toggle (day / night)
  const right = document.getElementById("nav-right");
  if (window.hbTheme) right.insertBefore(window.hbTheme.button(), right.firstChild);

  const btn = document.querySelector(".nav-toggle"), menu = document.getElementById("menu");
  btn.addEventListener("click", () => { const o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });
  const sub = document.querySelector(".has-sub"), subBtn = sub.querySelector("button");
  subBtn.addEventListener("click", (e) => { e.stopPropagation(); const o = sub.classList.toggle("open"); subBtn.setAttribute("aria-expanded", o); });
  document.addEventListener("click", (e) => { if (!sub.contains(e.target)) { sub.classList.remove("open"); subBtn.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sub.classList.contains("open")) { sub.classList.remove("open"); subBtn.setAttribute("aria-expanded", "false"); subBtn.focus(); } });

  // Scroll reveal
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => io ? io.observe(el) : el.classList.add("in"));

  // Floating WhatsApp chat
  const wa = document.createElement("script"); wa.src = "js/whatsapp.js"; document.body.appendChild(wa);
});
