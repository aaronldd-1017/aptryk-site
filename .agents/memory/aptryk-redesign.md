---
name: APTRYK ground-up redesign — deep space system
description: Design tokens, typography, logo, and routing details for the ground-up 2026 redesign.
---

## Design System (current)

**Palette**
- `--bg: #03030d` — true near-black, cold
- `--accent-cyan: #00e5ff` — primary electric accent
- `--accent-indigo: #4050ff` — secondary, mono labels
- `--accent-violet: #a855f7` — tertiary, available but used sparingly
- `--ink: #ffffff`, `--ink-mid: #a0aec0`, `--ink-muted: #64748b`
- `--surface: rgba(7,7,20,0.6)` — glass card background
- `--surface-border: rgba(0,229,255,0.1)` / hover `rgba(0,229,255,0.3)`

**Typography**
- Display: `Syne` 800 — tight tracking, bold headings
- Body: `DM Sans` 400/500/600
- Serif italic accent: `Playfair Display` italic — used in `<em>` within headlines
- Mono labels: `JetBrains Mono` 500/700 — uppercase, letter-spaced 0.1em, indigo color
- Font load: `Syne:wght@600;700;800`, `DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600`, `Playfair+Display:ital,wght@1,600;1,700`, `JetBrains+Mono:wght@500;700`

**Logo mark**
- Currently: `<img src="/favicon.svg">` — geometric rounded-square SVG
- favicon.svg exists at root (coordinate-node concept from previous pass — may want to redesign as part of future task)

**Background effects**
- `.bg-fx` — fixed radial gradients, indigo top-left + cyan bottom-right
- `.bg-grid` — fixed 40px grid lines at 2% white opacity, masked to top-20% → transparent

## File structure
- `index.html` — main landing, ~500 lines
- `book.html` — booking flow (4-step calendar + form), ~420 lines  
- `start.html` — project brief form, ~300 lines
- `library.html` — project library with categories, ~250 lines
- `server.py` — clean URL server (maps /book → book.html etc.)
- `favicon.svg` — SVG brand mark (dark bg + cyan coordinate node)

## Routing
- Dev server: `python3 server.py` (CleanURLHandler — strips .html, maps /book → book.html)
- Production: Cloudflare Pages with `_routes.json`
- Nav links use extension-less URLs (/book, /start, /library) — works in both environments

## Key patterns
- Scroll reveal: `.rev` class + IntersectionObserver → adds `.in` class → opacity/translateY
- Delay classes: `.d-1`, `.d-2`, `.d-3` (transition-delay 0.1/0.2/0.3s)
- Modal: `.modal-backdrop` + `.open` class toggle, backdrop click closes
- Mobile nav: `.mobile-nav` full-screen overlay with `translateY(-100%)` → `translateY(0)` slide

**Why:** pseudo-element z-index stacking issue documented previously — body::before (fixed) sits above main content unless main has explicit z-index. Using hero background-image layers for grid overlays avoids this.
