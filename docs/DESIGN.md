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
