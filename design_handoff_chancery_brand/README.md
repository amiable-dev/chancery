# Handoff: chancery brand & docs site

## Overview
Brand identity and docs-site design for **chancery** (chancery.dev) — the governed, git-native knowledge base for AI agents at `amiable-dev/swe-ai-ml-kb` (local checkout: `chancery/`). It continues the amiable-dev family language: the llm-council 12-step teal→purple ramp and flat geometric bar construction. Deliverables: logo mark + favicon, MkDocs Material theme overrides, and three hi-fi prototypes (docs landing, Quick Start inner page, brand spec page).

## About the Design Files
Files in `prototypes/` are **design references created in HTML** — they show intended look and behavior, not production code to ship. Open them directly in a browser (keep `support.js` and `assets/` beside them). The task is to **recreate these designs in the target environment** — an MkDocs Material site for the chancery repo — using the drop-in files here plus the specs below. Only `assets/*.svg` and `mkdocs/extra.css` are production files to copy verbatim.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final. Recreate pixel-perfectly where the target supports it; where MkDocs Material controls layout, apply the tokens via `extra.css` and mkdocs.yml rather than fighting the theme.

## Quick integration (MkDocs Material)
1. `assets/logo-mark.svg` → `docs/img/logo.svg`
2. `assets/favicon.svg` → `docs/img/favicon.svg`
3. `mkdocs/extra.css` → `docs/stylesheets/extra.css`
4. mkdocs.yml:
```yaml
site_name: chancery
site_url: https://chancery.dev
theme:
  name: material
  logo: img/logo.svg
  favicon: img/favicon.svg
  font: { text: IBM Plex Sans, code: IBM Plex Mono }
  palette:
    - scheme: default
      toggle: { icon: material/brightness-7 }
    - scheme: slate
      toggle: { icon: material/brightness-4 }
extra_css: [stylesheets/extra.css]
```

## Logo (construction spec)
Meaning: two brackets = the deterministic gate; inner bars = note lines consolidating down the ramp — teal staging in, purple canon out (inverse of llm-council's fragmenting bars).

`logo-mark.svg`, 300×300 viewBox, rects only:
- Left bracket `#33d6c2`: post x30 y30 w26 h240; arms x30 w64 h26 at y30 and y244
- Right bracket `#6b19ca`: post x244 y30 w26 h240; arms x206 w64 h26 at y30 and y244
- Bars x76, h20, progressive widths (consolidation): y76 w92 `#37bfc0` · y108 w108 `#4289c3` · y140 w124 `#4c68c5` · y172 w136 `#5848c7` · y204 w148 `#6428c9`

Rules: full ramp on white or slate `#0b0f17` only; clearspace = one post width; min 20px, below 24px use the favicon cut (3 bars); never recolor, outline, rotate, or gradient-fill a bar.

Wordmark: `chancery`, lowercase, Space Grotesk 700, letter-spacing -0.02em, ink (light) / white (dark). Lockup: mark at cap-height ×1.4, gap ≈ 0.35× mark width.

## Design tokens
Ramp (shared with llm-council, in order):
`#33d6c2 #37bfc0 #3aacc1 #3e9ac2 #4289c3 #4778c4 #4c68c5 #5258c6 #5848c7 #5e38c8 #6428c9 #6b19ca`

Core: Teal 500 `#33d6c2` (start; dark-mode accent) · Purple 600 `#6b19ca` (end) · Violet 500 `#671bc6` (action/light-mode accent) · Ink `#0d1220` · Slate `#0b0f17` (dark bg) · Paper `#f6f8fb`

Light: bg `#ffffff` · alt `#f6f8fb` · border `#e4e8ee` · muted `#5a6577` · link `#6428c9` (hover `#4d0fa0`) · chip `#f1eefb`
Dark: bg `#0b0f17` · alt `#0e1420` · panel `#121826` · border `#232b3d` · text `#e8ecf4` · muted `#93a1b8` · link `#53d6c2` (hover `#8ae8da`)
Code blocks are always `#0b0f17` (text `#d7e0ee`, comments `#7f8ba0`, highlight `#53d6c2`) in both modes.
Ramp steps are for the mark, 3px strips, stat numbers, and diagram stages — never body text.

Type: Space Grotesk 500/700 (display/headings, -0.01…-0.02em) · IBM Plex Sans 400/500/600 (body) · IBM Plex Mono 400/500/600 (code, kickers, badges). Scale: display 52, h2 28, h3 21, body 15–16.5/1.6–1.7, code 13/1.8, kickers 10.5–11 uppercase +0.12em.
Radii: cards/code 10, buttons/inputs 6–7, badges 3. Borders 1px (1.5px diagram nodes). No shadows except active-stepper ring `0 0 0 5px <color>33`.

Signature: 3px full-width 12-segment ramp strip under the site header (`.md-header::after` in extra.css).

## Screens (prototypes/)
**Landing.dc.html** — docs landing, llm-council.dev mould. Sticky 58px header (logo+wordmark, tab nav w/ 2px violet active underline, search that hides <1180px, mono theme toggle, repo box) over ramp strip; 224/1fr/196 grid (sidebar · content · page-TOC), max 1360, gap 44. Sections: centered hero (92px mark, h1, tagline, violet primary + outlined GitHub buttons, 5 shield badges); "Start in 60 seconds" 3-tab code panel; "See it gate" terminal (dark chrome, title "kb verify — 480 files, no network", replay button, lines type in at 380ms, teal `✓`/red `✗ #ff7a8a`, blinking 8×15 teal caret); "Two phases, one gate" 5-stage stepper (42px circles, stage colors `#19b3a1 #4289c3 #7c3aed #5848c7 #6b19ca`, connectors fill when passed, detail card w/ 3px left border, prev/next); "Why chancery" 3×2 cards, 26×4 ramp tick per card; "Pick your path" 3 link cards; stats strip (244 / 1,240 / ~1s / 0 in ramp colors); next steps; footer with chancery.dev + sibling links.

**Guide.dc.html** — Quick Start inner page, same shell. Breadcrumb, h1 38, teal-bordered Prerequisites admonition, numbered h2 sections with code blocks, 3-col two-phase table (header row alt-bg, mono uppercase), purple "Dry-run by default" admonition, prev/next cards, on-page TOC. Admonition accents: note `#4778c4`, tip `#33d6c2`/`#19b3a1`, warning `#6428c9` — tinted title bar (10–12% alpha), 8px square swatch, 1px colored border, radius 8.

**Brand Pack.dc.html** — the visual spec itself (logo, color, type, badges, diagram style, social card & README banner mockups, MkDocs snippets). Use as the reference of record.

## Interactions & behavior
- Theme toggle: `data-theme` on body switches CSS vars; persisted (`localStorage kb-proto-theme`); label "dark mode"/"light mode". On the real site, Material's palette toggle covers this.
- Quickstart tabs: instant swap; active tab ink text + 2px accent underline, inactive muted.
- Terminal: autoplays on load, one line per 380ms, replay resets; pass variant exists (verdict `verify: PASS (exit 0)` in teal).
- Stepper: click a node or prev/next; active = filled circle + 4px ring + colored label; passed connectors fill with the stage color; disabled prev/next at 40% opacity.
- Hovers: links get link color; cards/buttons swap border to accent; no motion beyond 0.15–0.2s color/border transitions.

## Assets to (re)generate
- **GitHub social card 1280×640** and **README banner 1280×256**: dark `#0b0f17`, mark left (240px / 132px), Space Grotesk 700 wordmark (92px / 56px), teal mono feature line, muted mono URL "chancery.dev · github.com/amiable-dev/swe-ai-ml-kb", 12-segment ramp strip bottom (10px / 8px). Exact layouts live in Brand Pack.dc.html (`#social-card`, `#readme-banner`).
- Shield badges: label `#444d5c` white; values — verify passing `#33d6c2` (dark text `#06251f`), license MIT `#671bc6`, status early v0.x `#5848c7`, node ≥22 `#4289c3` (shields.io `?color=` equivalents).

## Diagram style (docs figures)
White/panel cards, 1.5px border in the stage's ramp step, radius 6, mono uppercase kicker + Plex Sans 600 name; canon nodes filled `#6b19ca` white; anything outside kb (agents/humans/councils) dashed `#7c3aed`, never filled; the gate = two 5×44 `#6428c9` bars; edges = mono arrows `#5258c6`; no curves, no shadows.

## Files
- `assets/logo-mark.svg`, `assets/favicon.svg` — production
- `mkdocs/extra.css` — production (→ docs/stylesheets/extra.css)
- `prototypes/Landing.dc.html`, `prototypes/Guide.dc.html`, `prototypes/Brand Pack.dc.html` — design references (open in a browser; need sibling `support.js`, `assets/`, `pack/`)
