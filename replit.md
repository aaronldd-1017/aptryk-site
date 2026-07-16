# APTRYK Site

Static HTML consulting website for APTRYK — Independent Technology Consulting.

## Stack

- Pure HTML/CSS/JS — no build step, no framework
- Served via `python3 -m http.server 5000`
- Deployed on Cloudflare Pages (see `_routes.json`)

## Pages

| File | URL | Purpose |
|---|---|---|
| `index.html` | `/` | Main marketing page |
| `book.html` | `/book` | Discovery call booking (calendar UI) |
| `start.html` | `/start` | Project brief form |
| `consult.html` | `/consult` | Guided consult intake (light theme) |
| `library.html` | `/library` | Internal asset/project catalog |
| `wrm.html` | `/wrm` | Internal WRM platform app |

## Running locally

```
python3 -m http.server 5000
```

Workflow: `Start application` (configured in Replit).

## Design tokens

- Background: `#0a0a10` (dark)
- Accent: `#3ecf6e` (green)
- Fonts: Syne (display), DM Sans (body), Playfair Display (serif italic), JetBrains Mono (mono)

## Mobile

All pages have been mobile-overhauled:
- `index.html`: Full hamburger menu with slide-in overlay, responsive nav, safe-area insets, touch targets, section padding scaled for mobile
- `book.html`, `start.html`, `library.html`, `consult.html`: Improved breakpoints, 16px input font size (prevents iOS zoom), safe-area insets, enlarged touch targets

## User preferences

- Mobile-first when making layout changes
- Keep existing design language (dark theme, green accent, Syne/DM Sans typography)
