// Contact form: visitors choose WhatsApp or email. Every enquiry is also saved for the admin (when the database is on).
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const emailBtn = document.getElementById("send-email");
  const C = window.HADIBOO;
  const params = new URLSearchParams(location.search);
  if (params.get("topic")) { const s = form.elements.topic; if (s) s.value = params.get("topic"); }
  (window.HADIBOO_READY || Promise.resolve()).then(() => {
    if (!C.email && !C.formEndpoint) emailBtn.hidden = true;          // no business email set yet
    if (!C.whatsapp) form.querySelector('[data-channel="whatsapp"]').hidden = true;
  });
  let channel = "whatsapp";
  form.querySelectorAll("button[data-channel]").forEach((b) => b.addEventListener("click", () => { channel = b.dataset.channel; }));
  const say = (t, ok) => { status.textContent = t; status.style.color = ok ? "var(--sage)" : "#d0453c"; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.company && form.elements.company.value) return; // honeypot
    const d = Object.fromEntries(new FormData(form).entries());
    d.name = (d.name || "").trim(); d.message = (d.message || "").trim(); d.email = (d.email || "").trim();
    if (!d.name) return say("Please enter your name.", false);
    if (d.message.length < 3) return say("Please tell us how we can help.", false);
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return say("That email address doesn't look right.", false);
    if (channel === "email" && !d.email && !C.formEndpoint) return say("Please add your email so we can reply.", false);

    if (window.hadibooLogEnquiry) hadibooLogEnquiry({ name: d.name, email: d.email || null, org: d.org, topic: d.topic, message: d.message, channel: channel === "email" ? "email" : "whatsapp" });

    if (channel === "whatsapp") {
      const text = `Hello Hadiboo, my name is ${d.name}${d.org ? " (" + d.org + ")" : ""}.\nI'm interested in: ${d.topic}\n\n${d.message}${d.email ? "\n\nMy email: " + d.email : ""}`;
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      return say("Opening WhatsApp with your message…", true);
    }
    if (C.formEndpoint) {
      say("Sending…", true);
      try {
        const r = await fetch(C.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!r.ok) throw new Error();
        form.reset(); return say("Thank you — we've received your message and will reply within two working days.", true);
      } catch (_) { return say("Something went wrong. Please email us directly at " + (C.email || "our team") + ".", false); }
    }
    const body = `Name: ${d.name}\nOrganisation: ${d.org || "-"}\nReply to: ${d.email}\nTopic: ${d.topic}\n\n${d.message}`;
    location.href = `mailto:${C.email}?subject=${encodeURIComponent("Hadiboo enquiry: " + d.topic)}&body=${encodeURIComponent(body)}`;
    say("Opening your email app…", true);
  });
})();
