// Injects the shared header + footer so every page stays in sync.
(function () {
  const C = window.HADIBOO;
  const page = document.body.dataset.page || "";
  const links = [
    ["index.html", "Home", "home"],
    ["about.html", "About", "about"],
    ["services.html", "Services", "services"],
    ["career.html", "Career", "career"],
    ["jobs.html", "Jobs", "jobs"],
    ["contact.html", "Contact", "contact"],
  ];
  const nav = links.map(([h, t, k]) => `<li><a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="Hadiboo home">
        <img src="assets/logo-mark.png" alt="" width="60" height="46"><span>HADIBOO</span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="menu">Menu</button>
      <ul class="nav-links" id="menu">${nav}
        <li><a class="btn btn--primary" href="contact.html#book" style="color:#fbf7f0">Book a consult</a></li>
      </ul>
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
        <div><h4>Explore</h4><ul>${nav}</ul></div>
        <div><h4>Work with us</h4><ul>
          <li><a href="career.html">Career development</a></li>
          <li><a href="services.html#s5">Public health support</a></li>
          <li><a href="services.html#s4">Training &amp; speaking</a></li>
          <li><a href="jobs.html">Jobs board</a></li></ul></div>
        <div><h4>Reach us</h4><ul>
          ${C.email ? `<li><a href="mailto:${C.email}">${C.email}</a></li>` : ""}
          ${C.phone ? `<li><a href="tel:${C.phone.replace(/\s/g, "")}">${C.phone}</a></li>` : ""}
          ${C.whatsapp ? `<li><a href="https://wa.me/${C.whatsapp}" rel="noopener">WhatsApp</a></li>` : ""}
          ${soc}<li>${C.location}</li></ul></div>
      </div>
      <div class="foot-bottom"><span>© ${new Date().getFullYear()} Hadiboo. All rights reserved.</span>
        <span>Led by ${C.owner}.</span></div>
    </div>
  </footer>`);

  const btn = document.querySelector(".nav-toggle"), menu = document.getElementById("menu");
  btn.addEventListener("click", () => { const o = menu.classList.toggle("open"); btn.setAttribute("aria-expanded", o); });

  // Scroll reveal
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll(".reveal").forEach((el) => io ? io.observe(el) : el.classList.add("in"));

  // Floating WhatsApp chat
  const wa = document.createElement("script"); wa.src = "js/whatsapp.js"; document.body.appendChild(wa);
})();
