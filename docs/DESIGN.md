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

The home page wordmark is drawn by snow that falls, settles into the letters,
and compacts into solid type, while lighter snow falls behind every section of
the page (`src/lib/snow/`).

- **Two scenes.** `SnowWordmark` owns the hero canvas and the letters.
  `SnowBackdrop` owns a fixed, full-viewport canvas behind the whole page for
  ambient flakes. Each runs its own `FrameLoop`, so the letters can sleep while
  the backdrop keeps snowing.
- **No flash of the static wordmark.** CSS hides the `<h1>` from the first
  paint whenever the snow will run (`scripting: enabled`,
  `prefers-reduced-motion: no-preference`, `forced-colors: none`), and
  `supportsSnow` checks the same three conditions so script and CSS always
  agree. When the script starts it claims the heading with `snow-pending`,
  which cancels the CSS safety reveal; it then marks it `snow-active` on the
  first frame, or `snow-fallback` when it cannot run (canvas readback blocked,
  `OffscreenCanvas` missing, any error), clearing its canvas so no stale snow
  sits under the revealed text. If the script never loads, a CSS animation
  reveals the heading after 4 s; a script that arrives after that reveal has
  begun leaves the visible heading alone instead of hiding it again. Because
  `snow-pending` cancels that reveal, a watchdog takes the fallback if the page
  and hero are visible but nothing has drawn 4 s after the scene starts. The
  heading keeps its text for layout, search, and screen readers.
- **Compaction.** Once the particles settle, `Compaction` ramps from 0 to 1
  over 1.4 s, and `compactionLook` turns that progress into eased,
  overlapping fades: the crisp word (`renderWordmarkLayer`, same font, same
  gradient) fades in beneath the flakes first, and the flakes fade out on top
  only once it is mostly opaque, growing at most 10%. There is never a moment
  where both are half transparent, which read as a blurred double image; the
  settled heading is exactly the real type. Flakes use 16 gradient shades so
  their color matches the smooth gradient of the type. Moving the mouse onto
  the word, or clicking or tapping it, `scatter`s every particle outward, with
  force falling off with distance but never below a floor, and loosens the
  springs for 900 ms, so the whole word breaks back into snow and drifts before
  it pulls together; it re-forms and compacts once the snow settles again.
  Breaking has its own `breakingLook`: the flakes appear at full strength at
  once while the type fades out beneath them over 200 ms. A mouse that only
  passes near a solid word leaves it alone; entering the word breaks it.
- **One gradient definition.** `WORDMARK_STOPS` in `color.ts` drives the CSS
  gradient on the heading, the particle shades, and the crisp layer, all mixed
  in Oklab and laid out along the CSS gradient line of the heading's box
  (`cssGradientLine`), so snow, solid letters, and the fallback match.
- **Targets come from the real font.** `sampleWordmark` renders the word with
  the heading's computed font and letter spacing into an offscreen canvas and
  samples the ink on a jittered grid. The particle budget scales with viewport
  width (700–1,800). If the web font arrives late, the `loadingdone` font event
  and the word's width in the layout key trigger a resample, and the snow
  morphs to the real glyphs.
- **Cadence.** The letters run at the display rate during the intro, hover,
  and scatters, then sleep entirely once compacted; the mouse coming near the
  word, a click, a resize, or a theme change wakes them. The backdrop runs at
  30 fps, or 24 fps on touch devices (`pointer: coarse`), and redraws
  immediately after a resize so flakes do not blink when a phone's address bar
  moves. Both stop while the tab is hidden, and the letters also stop while
  the hero is off screen. A settled frame is a single blit of the pre-rendered
  word layer. A mouse resting on the word stops pushing flakes after 1 s, so
  the word can settle and the loop can sleep.
- **Scrolling moves through the snow.** Backdrop flakes live in viewport space
  and drift against the scroll with per-flake depth, so larger flakes move
  faster and the page reads as falling snow at every section.
- **Touch never blocks scrolling.** Taps scatter on `click`, which browsers do
  not dispatch after a scroll gesture.
- **Layout follows the page.** A `ResizeObserver`, window resizes, and a
  device-pixel-ratio media query schedule debounced relayouts. A zero-size
  layout (a page loaded while hidden) waits for the next resize.
- **Teardown.** Both scenes expose `destroy()`. `mountSnow` calls it on
  `astro:before-swap`, which fires only if Astro view transitions
  (`<ClientRouter />`) are enabled; the site does not enable them today.

Measured in Chrome at 1280×800: snow is on screen about 0.7 s after load, the
word lands at about 2.6 s and is solid by about 4.2 s. Afterwards the letter
canvas draws nothing (0 fps) and the backdrop runs at 30 fps.
