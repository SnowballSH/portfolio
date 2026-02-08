# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Snapshot

- Personal portfolio site for SnowballSH (Yinuo Huang)
- Stack: Astro 5, Tailwind CSS v4, TypeScript, Bun
- Output: static build for GitHub Pages
- Styling approach: Tailwind utilities + component-scoped CSS

## Package Manager and Scripts

Use Bun for all package and script operations.

- `bun install`
- `bun run dev` (local dev server)
- `bun run check` (Astro + TypeScript checks)
- `bun run format` (Prettier write)
- `bun run format:check` (Prettier check)
- `bun run build` (production build to `dist/`)
- `bun run preview` (preview built site)

## Core Architecture

- `src/layouts/Layout.astro`: global layout, navbar, metadata/SEO, JSON-LD support
- `src/components/`: shared components (`Navbar.astro`, `ProjectCard.astro`)
- `src/pages/`: route pages
  - `index.astro`
  - `projects/index.astro`
  - `projects/[slug].astro`
  - `blogs/index.astro`
  - `blogs/[slug].astro`
  - `contact.astro`
- `src/content/`: content collections
  - `projects/*.md`
  - `blogs/*.typ`
- `src/content/config.ts`: content collection schemas
- `src/styles/global.css`: global styles and design tokens/utilities

## Content Model

### Projects collection

Project content is Markdown with frontmatter fields validated in `src/content/config.ts`:
- `title`
- `shortDescription`
- `date`
- `technologies`
- `featured`
- `status`
- `image`, `imageAlt`
- `githubUrl`, `liveUrl`, `demoUrl`
- `links[]`
- `category`
- `priority`

### Blogs collection

Blog content is Typst (`.typ`) with frontmatter metadata exposed via Typst metadata and validated in `src/content/config.ts`:
- `title`
- `description`
- `date`
- `tags`
- `draft`

## Typst Integration

Configured in `astro.config.mjs` using `astro-typst`.

- Typst files under `src/content/blogs/` are rendered for blog pages.
- `@myriaddreamin/typst-ts-node-compiler` is listed in Vite SSR external config.
- Blog rendering logic and responsive Typst behavior live in `src/pages/blogs/[slug].astro`.

## SEO and Metadata

SEO is centralized in `src/layouts/Layout.astro`.

- Canonical URLs
- Open Graph and Twitter metadata
- Robots metadata
- Optional article publish/modified meta
- JSON-LD via `schema` prop
- Sitemap integration via `@astrojs/sitemap`

## Deployment

GitHub Actions workflow: `.github/workflows/deploy.yml`

- Triggers on pushes to branch `new` (and manual dispatch)
- Installs with Bun
- Runs checks and build
- Deploys `dist/` to GitHub Pages

## Editing Guidelines for Agents

- Keep Bun as the package manager.
- Prefer minimal, focused changes that preserve current design language.
- Run `bun run build` (and `bun run check` when relevant) before finishing significant edits.
- Do not revert unrelated user changes in the working tree.
