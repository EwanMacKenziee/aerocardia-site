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

## Preview / deploy

There is no local server dependency. To preview, open `index.html` in a browser,
or serve the folder with anything static:

```bash
npx serve aerocardia-site
```

Deploy the folder as-is to Netlify, Vercel, Cloudflare Pages or GitHub Pages.

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
| `vo2-phases.jpg` | training section, blog card, idle strip | **7 MB / 6000 px — resize to ~1600 px before launch** |
| `proto-5914.jpg`, `oscar-1.jpg` | about page | prototype photography |

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
2. **Stock photography** — drop `cyclists-bw.jpg` (the B&W motion-blur cyclists shot)
   into `assets/img/`; it's already referenced by the first blog card and the idle
   strip, with a `picsum.photos` fallback until the file exists. The remaining idle
   strip / blog images are grayscale `picsum.photos` placeholders — replace with
   curated running/cycling shots.
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

Not included. AI video generation was not available in this environment, and the
supplied renders are single-angle stills (not a turntable), so a true 360° spin
can't be faked from them. Current treatment: the device floats on a studio
"stage" card (CSS), and colourways cross-fade on interaction.

Options to add real motion later:
- Export a turntable frame sequence (24–72 frames) from the CAD/render tool and
  wire it to scroll position — the hook is already in `main.js` (`data-scrub`).
- Generate a clip with an external tool (Runway, Kling, Sora) from
  `device-black-teal.png`, drop it in `assets/video/`, and replace the `.stage`
  markup on the hero / how-it-works with `<video autoplay muted loop playsinline>`.
