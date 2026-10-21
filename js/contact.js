// Contact form: posts to Formspree if configured, otherwise opens the visitor's email app.
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const C = window.HADIBOO;
  const params = new URLSearchParams(location.search);
  if (params.get("topic")) { const s = form.elements.topic; if (s) s.value = params.get("topic"); }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.company && form.elements.company.value) return; // honeypot
    const d = Object.fromEntries(new FormData(form).entries());
    status.style.color = "var(--maroon-700)";
    if (C.formEndpoint) {
      status.textContent = "Sending…";
      try {
        const r = await fetch(C.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!r.ok) throw new Error();
        form.reset(); status.style.color = "var(--sage)"; status.textContent = "Thank you — we've received your message and will reply within two working days.";
      } catch { status.textContent = "Something went wrong. Please email us directly at " + C.email; }
    } else if (!C.email && C.whatsapp) {
      const text = `Hello Hadiboo, my name is ${d.name}${d.org ? " (" + d.org + ")" : ""}.\nI'm interested in: ${d.topic}\n\n${d.message}`;
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      status.textContent = "Opening WhatsApp with your message…";
    } else {
      const body = `Name: ${d.name}\nOrganisation: ${d.org || "-"}\nTopic: ${d.topic}\n\n${d.message}`;
      location.href = `mailto:${C.email}?subject=${encodeURIComponent("Hadiboo enquiry: " + d.topic)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app…";
    }
  });
})();
