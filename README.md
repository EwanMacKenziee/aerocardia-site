# AeroCardia — website

Wellness-positioned marketing site for the AeroCardia portable VO2 / breath sensor.
Static HTML/CSS/JS. No build step, no dependencies.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, real-time guidance, setup, training, "train in phases", "Sport your team's colours", blog highlights, idle image strip, waitlist CTA |
| `product.html` | Product — the five signals, who it's for, spec table, colourways ("Style meets performance") |
| `how-it-works.html` | How it works — scroll-rotate device, the sensing, four steps, training, ecosystem |
| `about.html` | About us — story, mission, approach, testing, backers, contact |
| `waitlist.html` | Join the waitlist — CTA, member perks, FAQ |

## French toggle (EN/FR)

Every page carries a FR/EN pill in the topbar (`[data-lang-toggle]`, styled
`.lang-toggle`) that swaps visible text client-side — no reload, no `/fr/`
URLs. `assets/js/i18n.js` is the whole engine; it's included on every page
and runs once on `DOMContentLoaded`.

**How it works:** any element with a `data-fr="<french html>"` attribute
gets its `innerHTML` swapped between the authored English and that French
string when the toggle fires. The first swap snapshots the live English
into `data-en` so toggling back is exact, not a re-translation. For
attributes (an `alt`, `aria-label`, or the description meta's `content`),
list the attribute names in `data-fr-attrs="alt aria-label"` and give each
one a `data-fr-attr-<name>` value; `data-en-attr-<name>` is where the
original gets snapshotted the same way. The chosen language persists in
`localStorage` (`ac-lang`) and defaults to the browser's language on first
visit. `document` fires an `ac:langchange` event after every swap — the
UCI colourway widget's label (`assets/js/main.js`) listens for it so a
dynamically-set country name (`data-country-fr` on `.flag` buttons; the
Belgium/Ireland/etc. flags on `index.html`) stays in the right language
even though it wasn't re-clicked.

**Translating new content** — when you add a page, section or blog
highlight to this repo:
1. Add `data-fr="…"` to every element that holds user-facing text (a
   heading, paragraph, list item, link, button). Nested tags inside the
   English content (a `<br>`, `<em>`, `<span class="arrow">`) need to be
   repeated inside the `data-fr` string too, since it replaces the whole
   `innerHTML` — use single quotes for any nested attribute (`<span
   class='arrow'>`) since the outer `data-fr="…"` is double-quoted.
2. Add `data-fr-attrs="…"` + `data-fr-attr-<name>="…"` for any `alt`,
   `aria-label`, meta `content`, etc.
3. Proper nouns, email addresses, numbers/units, and colourway/brand names
   (Copper, Signal Teal, …) are left untranslated on purpose — don't force
   a `data-fr` onto those.
4. Run `node scripts/check-i18n.mjs` before publishing. It's a heuristic
   line-scan, not a real parser — it flags any leaf element (plain text, no
   nested tags) with no `data-fr`, which includes the proper nouns from
   step 3, so review its output rather than treating every line as a bug.
   It won't catch a missed translation on an element whose text mixes with
   nested markup (those need a human read-through).
5. French copy follows the same CLAUDE.md house rules as English —
   banned words/claims, the disclaimer, no stronger claims than the
   English version. Translate, don't rewrite: the French text should carry
   the same meaning and the same strength of claim as the English next to
   it, not a punchier or softer version.

## Preview / deploy

Open `index.html` directly in a browser to preview — every script is a plain
classic script, so `file://` works. One caveat: browsers taint a canvas that
reads a `file://` image, so the hero's studio-grey key-out falls back to a soft
radial mask until the page is served over HTTP.

For the real thing, serve the folder:

```bash
node serve.mjs
```

`serve.mjs` is a zero-dependency static server (port 8123, `PORT=` to change).
Or use anything static — `npx serve`, `python -m http.server`. Deploy the folder
as-is to Netlify, Vercel, Cloudflare Pages or GitHub Pages.

## Hero: the liquid-glass card

The home hero has no video file. `assets/js/glass-card.js` paints an animated
scene (deep teal aurora + the floating `device-black-teal.png` render, studio
background keyed out live) to an offscreen canvas each frame, then blits it to
the full-bleed `#bg-stage` backdrop **and** to `#dup-stage`, a viewport-aligned
copy sitting behind `.glass-card` that carries the SVG filter
`#liquid-glass-refraction` (a per-channel `feDisplacementMap` chromatic
dispersion). The card's `overflow:hidden` + radius clip it into a glass window.

To swap in a real clip later: put a `<video>` in the hero and draw it instead of
the generated scene inside `draw()` — the rest of the pipeline is unchanged.

## Nav: shared shell

Every page carries the same fixed `.topbar` (hamburger + brand left, waitlist
pill top-right) and the same `#menu` fullscreen panel. `assets/js/menu.js`
drives open/close/focus/Escape and the topbar's scrolled state. Interior pages
set `<body class="interior">` (permanently-solid topbar + top padding).

## Design system

- Dark "performance" theme. Tokens live at the top of `assets/css/styles.css` (`:root`).
- Accent: **AeroCardia teal** `#29B0A6` (matches the logo mark).
- Type: Inter (Google Fonts). Swap in a licensed display face by editing the
  `<link>` and `--font-display` if you want more personality in headings.
- Scroll reveals are progressive enhancement: content is visible with JS disabled;
  `main.js` only animates elements that load below the fold, with a 4s safety net.

## Assets  (`assets/img/`)

Real files pulled from `Downloads/AeroCardia/`:

| File | Used on | Notes |
|------|---------|-------|
| `favicon.png` | brand mark + favicon, all pages | teal heart logo, transparent |
| `device-black-teal.png` | home hero, product hero, waitlist | primary colourway |
| `device-black-teal-2.png` | home "setup" | alt angle |
| `device-566.png` | how-it-works scroll-rotate | silver/blue, black bg (feathers into dark) |
| `device-black-copper-hero.png`, `device-green-gold.png`, `device-white-teal.png`, `device-white-yellow.png` | product + home colourway toggles | swappable bands |
| `vo2-phases.jpg` | training section, blog card, numbered card 2 | **7 MB / 6000 px — resize to ~1600 px before launch** |
| `proto-5914.jpg` | about page | prototype photography |
| `team/*.{jpg,jpeg,png,svg}` | about page | headshots for the team & interns grids; `placeholder-avatar.svg` covers anyone without a photo yet |

### Before launch — image hygiene
All `device-*.png` renders are ~1920 px on a grey/black studio background and
0.3–2.4 MB each. For production: trim to the device, export at 2× display size,
and consider WebP. `favicon.png` is 1500 px — generate a real 32×32 / 180×180 set.

## To finish wiring

1. **Waitlist** — `waitlist.html` embeds JotForm `262305901704046` in an `<iframe>`
   with a "open in new tab" fallback. To swap forms, change the `src` in that file.
   The "Join the waitlist" buttons in every nav/CTA point to `waitlist.html`.
   *(Optional: add JotForm's `jotform-form-embed` auto-resize script if the form
   height changes a lot.)*
2. **Photography** — the `picsum.photos` stock placeholders were pulled out of
   `index.html` (numbered cards, blog highlights, idle strip) so nothing on the
   live site reads as generic filler; those slots are empty gradient cards for
   now. The idle strip section is commented out entirely (see the HTML comment
   where it was). Once you have curated running/cycling shots, drop them in
   `assets/img/`, swap them back into the `<div class="post__img">` /
   `.ncard__media` slots, and restore the strip markup from git history
   (`git log -- index.html`).
3. **Blog** — cards link to `https://aerocardia.com/blog`. Point them at the real
   post URLs when the blog is migrated.
4. **Colourways** — `product.html` "Style meets performance" and `index.html`
   "Sport your team's colours" both toggle between the real renders:
   | Colourway | Render | UCI nation (home page) |
   |---|---|---|
   | Signal Teal | `device-black-teal.png` | Slovenia |
   | Copper | `device-black-copper-hero.png` | Netherlands |
   | Racing Green | `device-green-gold.png` | Ireland |
   | Cobalt | `device-566.png` | Great Britain |
   | Sunflower | `device-white-yellow.png` | Belgium |
   | Arctic White | `device-white-teal.png` | — |
   For exact national colours (GB red/white/blue, NL orange, FR tricolore) you'll
   want dedicated renders, or recolour the accent band in the 3D source.
5. **Social** — LinkedIn `company/aerocardia/`, Instagram `aerocardia` (confirmed).

## The "animated render video"

There is still no real video file — AI video generation and video encoding were
not available in the build environment, and the renders are single-angle stills.

The **home hero** now fakes convincing motion in real time: `glass-card.js`
animates the render on a canvas (drift, rotation, aurora) behind the refractive
glass card. See "Hero: the liquid-glass card" above.

The **how-it-works** page and product colourway toggles still use the CSS
`.stage` float + interaction cross-fade. To add a turntable there, export a
frame sequence and wire it to `main.js`'s `data-scrub` hook, or drop a real clip
into `assets/video/` and swap the `.stage` markup for `<video autoplay muted
loop playsinline>`.
