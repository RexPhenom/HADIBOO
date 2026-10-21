# Hadiboo — UI Design System ("Crown & Care")

## 1. Concept
The logo is a crowned **H** joined to a **B**. The crown's beads become the site's signature motif: a **bead divider** (`.beads`), the **eyebrow dots**, and the dashed orbit ring around the hero mark. Royal but warm — authority with care.

## 2. Colour (sampled from the logo)
| Token | Hex | Use |
|---|---|---|
| `--maroon-700` | `#7F000C` | Brand primary, buttons, headings accents |
| `--maroon-900` | `#3D0007` | Footer, hover states |
| `--cream-100` | `#F4ECE1` | Page background (logo background) |
| `--cream-50` / `--cream-200` | `#FBF7F0` / `#EADFCE` | Cards / alt sections |
| `--gold` | `#B98A3E` | Accent beads, numbers, "expiring" tag — sparingly |
| `--sage` | `#4D6B5C` | "New", success — the calm "health" counter-colour |
| `--ink` | `#26090C` | Body text (contrast 15:1 on cream) |

Contrast: maroon-700 on cream ≈ 9.6:1 (AAA); cream on maroon-700 ≈ 9.6:1. Gold is never used for body text.

## 3. Typography
- **Display:** Fraunces (variable serif, optical sizing) — warm, editorial, credible.
- **Body/UI:** Manrope — clean, legible at small sizes.
- Scale: hero `clamp(2.6rem → 5.4rem)`, H2 `2.1 → 3.4rem`, body `1.05rem / 1.65`. Eyebrows: 0.8rem, caps, +16% tracking.

## 4. Spacing, shape, depth
4-px base scale (`--s1…--s9`). Radii: 10 / 18 / pill. Two shadows only (resting, raised). Cards lift 6px on hover; jobs slide 4px.

## 5. Components
Buttons (primary, ghost, light, outline-light; 48px min height) · Eyebrow · Bead divider · Card (with numbered/icon variants) · Marquee · Steps (numbered timeline) · Job card (+ tags: type / New / Expiring soon) · Filters bar · Notice · Accordion (`details`) · Form fields · Sticky header + mobile drawer · Footer.

## 6. Motion
Scroll-reveal (800ms ease-out), slow 60s orbit, marquee. All disabled under `prefers-reduced-motion`.

## 7. Layout
12-col feel via CSS grid; container max 1180px; breakpoints 960 / 760. Mobile-first drawer nav, single-column stacks, 48px touch targets.

## 8. Accessibility
Skip link · visible gold focus ring · semantic landmarks · `aria-current`, `aria-live` for job counts and form status · labels on all inputs · honeypot (no CAPTCHA) · contrast AA+.

## 9. Logo usage
`assets/logo-full.png` (mark + wordmark) · `logo-mark.png` · `favicon.png` (transparent PNGs derived from the original). Keep clear space ≥ the height of the "H" crown beads. Use maroon on cream/white, or cream on maroon (CSS filter used in hero/footer). Don't recolour, stretch or add effects.

## 10. Voice
Plain, warm, specific. "Health that is designed with the people it serves." Avoid jargon, avoid unverifiable claims.
