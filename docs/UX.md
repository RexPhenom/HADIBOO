# Hadiboo — UX Design

## Audience & goals
| Persona | Needs | Primary path |
|---|---|---|
| **Programme lead (NGO/gov/school)** — Amina | Trust, proof of method, easy way to start a conversation | Home → Services → Contact (book consult) |
| **Student / early-career pro** — Tunde | Guidance, jobs, affordable help | Home → Mentorship → Apply; or Jobs |
| **Job seeker** — Grace | Fresh, trustworthy listings fast | Jobs (search/filter) → employer link |
| **Corporate/CSR manager** — David | Workplace wellness partner | Services → Contact |

## Site map
```
Home ─┬─ Services (6 services across 2 focus areas · Who we serve)
      ├─ Career (Clarity · CV/LinkedIn · Interviews)
      ├─ Jobs (search · type filter · sort · expiry countdown)
      └─ Contact (form · direct email · what happens next)
```

## Key flows
1. **Book a consultation:** any page → header CTA → Contact form (topic prefilled via `?topic=`) → mail/Formspree → reply ≤ 2 working days.
2. **Find a job:** Jobs → search / type / sort → "View & apply" opens employer page in new tab. Each card shows *time left* so users prioritise.
3. **Apply for mentorship:** Mentorship → pick track → Contact (topic = Mentorship).

## Page wireframes (low-fi)
**Home:** Hero (promise + 2 CTAs + 3 proof points | logo orbit) → marquee → 5 service cards → "How we work" (4 steps, maroon band) → Why Hadiboo (sticky heading + 4 cards) → Jobs teaser → FAQ → CTA band → footer.
**Services:** page head → 4 detailed cards (anchors) → audiences grid → CTA.
**Mentorship:** hero + rhythm card → 3 tracks → expectations accordion → CTA.
**Jobs:** safety notice → filter bar → live count → job cards → empty state → "feature your role".
**Contact:** form (2-col) | sidebar (email, next steps).

## UX decisions
- One primary action per screen; persistent "Book a consult" in header.
- Jobs show **expiry countdown** and **New / Expiring soon** tags — the 6-day rule becomes a feature, not a surprise.
- **Empty state** is designed (logo, message) so a quiet day never looks broken.
- Safety notice on jobs ("never pay to apply") builds trust.
- Forms: visible labels, minimal fields, graceful email fallback if no backend.
- Mobile: drawer nav, stacked cards, thumb-reachable CTAs.

## Success metrics
Consultation requests / month · contact-form completion rate · job-card click-through · mentorship applications · return visits to Jobs.

## Usability test script (5 users)
1. "Find out whether Hadiboo can train your staff." 2. "Find a job posted this week in Akwa Ibom." 3. "Apply to be mentored." 4. "How do you contact them?" — Success = under 60s, no help.
