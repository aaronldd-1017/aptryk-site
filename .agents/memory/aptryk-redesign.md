---
name: APTRYK redesign system
description: Design tokens, font decisions, and CSS architecture lessons for the APTRYK site
---

## Active design system

- **Display font**: Space Grotesk 700 (headlines, nav, buttons, stats)
- **Body font**: Inter (paragraphs, card text)
- **Mono font**: JetBrains Mono 700 (section labels, nav links, stat labels)
- **Serif font**: Playfair Display italic (em tags only — gradient accent)
- **Background**: `#020209` deep space
- **Accent**: `#4a7cf5` blue → `#6366f1` indigo gradient
- **em gradient**: `linear-gradient(130deg, #7aa5f8 0%, #a07ef8 100%)` — blue to purple

## CSS architecture rule

**ONE style block, no override layers.** The task-agent merge (Task #5) created two competing CSS systems (Syne/DM Sans cyan-indigo vs Space Grotesk blue). The fix was to delete the entire old `<style>` block and write one unified system from scratch.

**Why:** CSS override layers cause specificity wars, bloat, and visual inconsistency. When a task agent rewrites HTML, always rebuild CSS as one block rather than appending overrides.

## Gradient text on nested em

Don't gradient the parent `h1` and the child `em` simultaneously — nested `background-clip: text` is unreliable. Instead: leave `h1` as solid `var(--ink)`, apply gradient only to `h1 em`. This resolves cleanly and `-webkit-text-fill-color: transparent` doesn't leak.

## z-index stacking

- `.bg-fx` (atmosphere orbs): `z-index: 0` — fixed, behind everything
- `.bg-grid`: `display: none` (killed permanently)
- `.grain`: `z-index: 1` — fixed overlay, mix-blend-mode: overlay
- All page content: `z-index: 2` (set on nav, section, .hero, footer, .modal-backdrop)
- `.mobile-nav`: `z-index: 200`
- `.modal-backdrop`: `z-index: 999`

## Server

`python3 server.py` — added by task agent. Maps `/book` → `/book.html` etc. (clean URLs). Keep this.

## Post-merge setup

`scripts/post-merge.sh` configured. Static site — no build step. Future merges will succeed.

## CSS variable naming

Use short, flat names: `--bg`, `--border`, `--border-h`, `--surface`, `--surface-h`, `--ink`, `--ink-2`, `--ink-3`, `--accent`, `--accent-2`. Avoid long names like `--surface-border-hover` — they encourage bloat.
