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
  screen readers. It fades out only after the canvas has drawn its first frame.
  The effect is skipped entirely, leaving the gradient wordmark, without
  JavaScript or `OffscreenCanvas`, with `prefers-reduced-motion`, in forced
  colors mode, when canvas pixels cannot be read back (privacy modes return
  blank data, which `isPlausibleInk` rejects), or when anything throws.
- **One gradient definition.** `WORDMARK_STOPS` in `color.ts` produces both the
  CSS gradient on the heading and the canvas palette, and both mix in Oklab, so
  the fallback and the snow match. Theme colors are resolved through the
  canvas `fillStyle` normalizer, not pixel readback.
- **Targets come from the real font.** `sampleWordmark` renders the word with
  the heading's computed font and letter spacing into an offscreen canvas,
  scales it to the heading's measured width, and samples the ink on a jittered
  grid. The particle budget scales with viewport width (700–1,800).
- **Simulation is separate from rendering.** `LetterSwarm` (intro fall, spring
  physics, hover, burst) and `Flurry` (ambient flakes) are pure and unit-tested;
  `SnowRenderer` only draws. Particle state is stored in typed arrays.
- **Idle is cheap.** Particles are drawn from pre-rendered dot sprites, one per
  gradient shade. Once the letters settle they are painted into one reused
  bitmap the size of the word, and the loop drops from the display rate to a
  timer-paced idle rate for the ambient flakes. It returns to full rate only
  when a burst happens or the mouse comes near the letters, and it stops while
  the hero is off screen or the tab is hidden. Device pixel ratio is capped at 2.
- **Touch never blocks scrolling.** Bursts fire on `click`, which browsers do
  not dispatch after a scroll gesture, so starting a scroll on the hero does not
  disturb the snow. The mouse also pushes snow aside on hover.
- **Layout follows the page.** A `ResizeObserver`, window resizes, and a
  device-pixel-ratio media query all schedule a debounced relayout keyed on
  width, height, and pixel ratio. Existing particles spring to their new
  targets. A zero-size layout (a page loaded while hidden) waits for the next
  resize instead of giving up.
- **Teardown.** `SnowHero.destroy()` removes every listener and observer and
  restores the heading; it runs on `astro:before-swap` for client-side
  navigation.

Measured in Chrome at 1280×800: the first frame draws about 100 ms after load,
the intro runs at 60 fps for about 2.4 s, then the settled hero idles at about
20 fps. Physics costs 0.09 ms and drawing 1.6 ms per frame with 1,800 moving
particles.
