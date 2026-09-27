# Design notes

Decisions that the code alone does not explain.

## Email links

`EmailLink` never puts the address in the served HTML. The build encodes it
into a `data-email` attribute and `revealEmailLinks` turns it into a `mailto:`
link in the browser. Scrapers that read raw HTML without running scripts miss
it; visitors see an ordinary link. Every page that shows the address, including
the Rimehand page and the footer, must go through `EmailLink`, and structured
data (JSON-LD) must not include it.

## Latest writing

The home page lists the newest posts from blogs.snowballsh.com. The blog API
only allows its own origin (CORS), so posts are fetched at build time by
`src/lib/blog.ts`, not in the browser. Consequences:

- A new post appears on the portfolio after its next build and deploy.
- The response is validated against a schema; if the API is down or its shape
  changes, the build logs a warning and the section is omitted rather than
  failing the build.

## Type checking

`tsconfig.json` covers the site and deliberately has no Bun types, so browser
code cannot use `Bun` or other runtime-only APIs. Tests are checked separately
by `tsconfig.test.json`, which adds the Bun types; `bun run check` runs both.

## Share image

`public/og.jpg` is the default link-preview image (1200×630). Its source is
`scripts/og/og.html`, rendered by `scripts/og/render.sh` with headless Chrome
and converted to JPEG with ffmpeg. The snowflakes use a seeded generator so
re-renders are identical. Edit the HTML and rerun the script instead of editing
the image.

## Icons

`favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`, and `logo-64.webp` are
derived from `favicon.webp` (800×800). The touch icon is flattened onto an
opaque background because iOS fills transparent corners with black.

## Snowfall hero

The home page wordmark is drawn by snow particles that fall and settle into the
letters (`src/lib/snow/`).

- **The real heading stays.** The `<h1>` keeps its text for layout, search, and
  screen readers. It fades out only after the canvas has drawn its first frame,
  so without JavaScript, without `OffscreenCanvas`, or with
  `prefers-reduced-motion`, visitors see the gradient wordmark unchanged.
- **Targets come from the real font.** `sampleWordmark` renders the word with
  the heading's computed font and letter spacing into an offscreen canvas,
  scales it to the heading's measured width, and samples the ink on a jittered
  grid. The particle budget scales with viewport width (700–1,800), so phones
  simulate fewer particles.
- **Simulation is separate from rendering.** `LetterSwarm` (intro fall, spring
  physics, hover, burst) and `Flurry` (ambient flakes) are pure and unit-tested;
  `SnowRenderer` only draws. Particle state is stored in typed arrays.
- **Idle is cheap.** Particles are drawn from pre-rendered dot sprites, one per
  shade of the wordmark gradient. Once the letters settle they are painted into
  one cached bitmap, so a settled frame is a single image blit plus the ambient
  flakes. The loop stops while the hero is off screen or the tab is hidden, and
  device pixel ratio is capped at 2.
- **Touch never blocks scrolling.** The mouse pushes snow aside on hover; a tap
  or click away from links puffs it outward. Touch moves are ignored, so the
  page scrolls normally on phones.
- **Resizes morph.** A width change resamples the word; existing particles
  spring to their new targets and any extra ones fall in from above. Height-only
  changes (mobile address bars) are ignored.

Measured on a desktop at 120 Hz: 0.09 ms of physics and 1.6 ms of drawing per
frame with 1,800 moving particles, 0.18 ms when settled, and no dropped frames
during a burst.
