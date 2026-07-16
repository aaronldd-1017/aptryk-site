---
name: APTRYK blue technical redesign
description: Key decisions and gotchas from the full blue/technical aesthetic overhaul of the APTRYK static site.
---

## Grid background approach
**Rule:** Do NOT use `body::before { position:fixed; z-index:0 }` for grid overlays. Positioned pseudo-elements with an explicit z-index sit above normal-flow children in the stacking order, pushing hero content below the viewport.

**Why:** `position:fixed; z-index:0` on a pseudo-element creates a root stacking context entry that outranks un-indexed positioned descendants (like `.hero { position:relative }`), making content appear invisible or repositioned.

**How to apply:** Bake grid lines directly into a section's `background-image` stack as additional `linear-gradient` layers (not a pseudo-element). E.g.:
```css
.hero {
  background:
    radial-gradient(...),          /* glow */
    linear-gradient(rgba(74,124,245,0.045) 1px, transparent 1px),  /* h-grid */
    linear-gradient(90deg, rgba(74,124,245,0.045) 1px, transparent 1px),  /* v-grid */
    var(--bg);
  background-size: auto, 56px 56px, 56px 56px, auto;
}
```
This keeps the grid entirely within the section's own background painter, never above content.

## Brand colour tokens
- Accent: `#4a7cf5` (hover `#6b93f7`)
- Accent-fg (text on accent): `#f0f4ff`
- Background: `#08081a`, surface `#0d0d1e`, surface-2 `#111124`, surface-3 `#141430`
- All pages: `--bg`, `--surface`, `--accent`, `--accent-h`, `--accent-fg`, `--accent-soft`, `--accent-soft-2`

## Per-file redesign CSS placement
Each file has a `/* ══ APTRYK BLUE TECHNICAL REDESIGN ══ */` block appended before `</style>`. Contains: grid bg on hero/body, sharper border-radius (6-8px cards, 6px buttons), blue glow system on `btn-primary`, nav logo blue gradient, and blue tint on all interactive border/shadow tokens.

## consult.html special handling
- Light theme (white background), has its own body::before + body::after for grid
- `--lime` variable renamed to `--blue` throughout by migration script
- My redesign block also defines `:root { --blue: #4a7cf5 }` (redundant but harmless)
- `.btn-primary { background: var(--blue) }` — button renders dark navy in this theme intentionally

## Screenshot tool timing
The screenshot tool may capture pages mid-CSS-animation. For index.html, `.anim { animation: fadeUp }` elements start at `opacity:0` at page load, so screenshots may appear to show empty space. The layout IS correct — this is a screenshot timing artifact, not a real render bug.
