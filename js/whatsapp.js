// Floating WhatsApp button. Visitor picks what they need → WhatsApp opens with a ready-written message.
(function () {
  const C = window.HADIBOO;
  if (!C || !C.whatsapp) return;
  const needs = [
    "Career Clarity & Mentorship",
    "CV, Cover Letter & LinkedIn Optimization",
    "Interview Preparation",
    "Training, Facilitation & Public Speaking",
    "Public Health & Development Programme Support",
    "Project Development & Organizational Support",
    "Invite to speak at an event",
    "Something else",
  ];
  const chips = needs.map((n, i) => `<button type="button" class="wa-chip" data-v="${n.replace(/"/g, "&quot;")}" aria-pressed="false">${n}</button>`).join("");

  document.body.insertAdjacentHTML("beforeend", `
  <div class="wa" id="wa">
    <div class="wa-teaser" id="wa-teaser" hidden>👋 Need career or programme support? <b>Chat with us</b><button type="button" aria-label="Dismiss" id="wa-x">×</button></div>
    <section class="wa-panel" id="wa-panel" role="dialog" aria-label="Chat on WhatsApp" hidden>
      <header><div><strong>Chat with Hadiboo</strong><span>We typically reply within a few hours</span></div><button type="button" id="wa-close" aria-label="Close">×</button></header>
      <div class="wa-body">
        <p>What do you need help with?</p>
        <div class="wa-chips" id="wa-chips">${chips}</div>
        <label for="wa-name">Your name</label><input id="wa-name" class="field" autocomplete="name" placeholder="e.g. Amaka">
        <label for="wa-note">Anything to add? <em>(optional)</em></label><textarea id="wa-note" class="field" rows="2" placeholder="Tell us a bit more…"></textarea>
        <button type="button" class="btn btn--primary wa-send" id="wa-send">Continue on WhatsApp</button>
        <small>This opens WhatsApp with your message ready — just tap Send.</small>
        ${C.email ? `<a class="wa-mail" href="mailto:${C.email}">Prefer email? Write to ${C.email}</a>` : `<a class="wa-mail" href="contact.html#book">Prefer email? Use the contact form</a>`}
      </div>
    </section>
    <button type="button" class="wa-fab" id="wa-fab" aria-label="Chat on WhatsApp" aria-expanded="false" aria-controls="wa-panel">
      <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3C9.4 3 4 8.3 4 14.8c0 2.2.6 4.3 1.8 6.1L4 29l8.3-2.1a12 12 0 0 0 3.7.6c6.6 0 12-5.300 12-11.800S22.600 3 16 3z"/><path fill="#1f8f4e" d="M12.200 9.500c-.3 0-.6.100-.9.500-.4.500-1.100 1.300-1.100 2.600 0 1.600 1.100 3.100 1.300 3.300.2.200 2.400 3.700 5.900 5.100 2.900 1.100 3.500.9 4.100.8.600-.1 2-.8 2.300-1.600.3-.8.3-1.500.2-1.600-.1-.2-.3-.3-.7-.5l-2.200-1.100c-.3-.1-.6-.2-.8.200l-1 1.200c-.2.200-.4.200-.7.100-1.800-.9-3-1.800-4.200-3.700-.3-.5.300-.5.900-1.700.1-.3 0-.5 0-.6l-1-2.400c-.3-.600-.5-.5-.8-.5z"/></svg>
      <span>Chat</span>
    </button>
  </div>`);

  const $ = (id) => document.getElementById(id);
  const panel = $("wa-panel"), fab = $("wa-fab"), teaser = $("wa-teaser");
  let chosen = "";
  const open = (v) => { panel.hidden = !v; teaser.hidden = true; fab.setAttribute("aria-expanded", v); if (v) $("wa-name").focus({ preventScroll: true }); };

  fab.addEventListener("click", () => open(panel.hidden));
  $("wa-close").addEventListener("click", () => open(false));
  teaser.addEventListener("click", (e) => { if (e.target.id !== "wa-x") open(true); });
  $("wa-x").addEventListener("click", (e) => { e.stopPropagation(); teaser.hidden = true; try { sessionStorage.setItem("wa-seen", "1"); } catch (_) {} });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { open(false); fab.focus(); } });

  $("wa-chips").addEventListener("click", (e) => {
    const b = e.target.closest(".wa-chip"); if (!b) return;
    chosen = b.dataset.v;
    document.querySelectorAll(".wa-chip").forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on); });
  });

  // Pre-select the service when a page/card passes ?topic=
  const t = new URLSearchParams(location.search).get("topic");
  if (t) document.querySelectorAll(".wa-chip").forEach((x) => { if (x.dataset.v.toLowerCase().startsWith(t.toLowerCase().slice(0, 12))) x.click(); });

  $("wa-send").addEventListener("click", () => {
    const name = $("wa-name").value.trim(), note = $("wa-note").value.trim();
    const lines = [
      `Hello Hadiboo 👋${name ? ", my name is " + name + "." : ""}`,
      `I'm interested in: ${chosen || "learning more about your services"}.`,
      note ? `Details: ${note}` : "",
      `(Sent from your website — ${document.title.split(" — ")[0] || "Hadiboo"} page)`,
    ].filter(Boolean).join("\n");
    if (window.hadibooLogEnquiry) hadibooLogEnquiry({ name, topic: chosen || "General enquiry", message: note, channel: "whatsapp" });
    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
    open(false);
  });

  // Gentle "pop out" teaser once per visit, after a few seconds
  let seen = false; try { seen = !!sessionStorage.getItem("wa-seen"); } catch (_) {}
  if (!seen) setTimeout(() => { if (panel.hidden) { teaser.hidden = false; try { sessionStorage.setItem("wa-seen", "1"); } catch (_) {} } }, 6000);
})();
