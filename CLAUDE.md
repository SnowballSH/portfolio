# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: Use `pnpm` (not npm/yarn)

- `pnpm dev` - Start development server at localhost:4321
- `pnpm build` - Build production site to `./dist/`
- `pnpm preview` - Preview production build locally
- `pnpm astro add <integration>` - Add Astro integrations
- `pnpm astro check` - Check for TypeScript/Astro errors

## Architecture

**Framework**: Astro 5.9.3 static site generator with TypeScript
**Module Type**: ES modules only (`"type": "module"`)
**Config**: Strict TypeScript configuration extending Astro's recommended settings

### File-Based Routing

- Pages go in `src/pages/` and automatically become routes
- `src/pages/index.astro` = `/` route
- Astro files can contain TypeScript in frontmatter and JSX-like templates

### Component Structure

- **Layouts**: `src/layouts/` - Page templates with `<slot />` for content
- **Components**: `src/components/` - Reusable `.astro` components
- **Assets**: `src/assets/` for build-time assets, `public/` for static files

### Styling

- Component-scoped CSS using `<style>` blocks in `.astro` files
- No CSS framework currently configured
- Styles are automatically scoped to components

## Key Patterns

**Astro Components**: Use `.astro` extension with frontmatter (TypeScript) and template sections
**Asset Imports**: Import assets from `src/assets/` for optimization, use `public/` for direct serving
**TypeScript**: Strict mode enabled, use proper typing for component props

## Development Commands

- **Package manager**: pnpm
- **Development**: `pnpm dev` starts server (localhost:4321)
- **Build**: `pnpm build` outputs static site to `./dist/`
- **Preview**: `pnpm preview` serves the production build locally
- **Integrations**: `pnpm astro add <integration-name>`
- **Type checks**: `pnpm astro check` for TypeScript/Astro errors

## Project Cleanup and Initialization

- **Audit existing repo**: Identify and extract reusable texts, images, and project descriptions; back up content in a reference file.
- **Remove boilerplate**: Delete unused files, placeholder assets, and unneeded dependencies; keep package manifest scripts minimal.
- **New Astro project**: Initialize a fresh Astro setup with TypeScript in strict mode; confirm `"type": "module"` and strict TypeScript settings.

## Integrations

- **Tailwind CSS**: Utility-first styling, configured for theme colors and backdrop filters.
- **Astro Image Optimization**: Automated responsive image handling.
- **SEO/Metadata**: Integration or conventions to manage head tags, Open Graph, per-page metadata.
- **Optional Lottie Support**: Include lottie-web in client-loaded components for complex animations if needed.
- **Icon Approach**: Use inline SVGs or an Astro-friendly icon plugin or library that does not require React.

## Theme and Design System

- **Color Palette**:

  - Accent: light blue (e.g., around `#00AEEF`) for logo animation and highlights.
  - Background: dark neutral (e.g., near `#0A0A0A`) or light neutral, ensuring high contrast.
  - Glass panels: semi-transparent white/gray (\~20% opacity) with strong backdrop blur and subtle border (\~30% opacity).
  - Text: white/off-white on dark, dark on light, accent for links or badges.

- **Typography**: Modern sans-serif (e.g., Inter, Poppins), loaded efficiently; define clear size scale for headings, body, captions.
- **Spacing & Layout**: Consistent scale of paddings/margins; responsive grids for project listing.
- **Glassmorphism Utilities**: Describe use of translucent backgrounds plus backdrop blur and subtle borders/shadows for lifted panels.
- **Mode Support**: If supporting dark/light toggle, specify adjustments to panel opacity, background, and text colors for both modes.

## File Structure and Routing

- **Layouts**:

  - Base layout for common head metadata, navigation, footer, and content slot.
  - Optional homepage-specific layout for full-viewport hero wrapper.

- **Pages**:

  - `index.astro` for homepage.
  - `projects/index.astro` for listing.
  - `projects/[slug].astro` for individual project pages via dynamic routing.
  - Optional pages like about or contact.

- **Components**:

  - Navbar and footer components.
  - Hero component with bouncing site name animation.
  - Project card component implementing glass panel preview.
  - Animated-text utility implementing bounce via vanilla JS or Motion One.
  - Badge/tag component for technology labels.
  - Image-with-caption component using optimized images.
  - Animation wrapper for reveal-on-scroll or page transitions.

- **Content**:

  - Use Astro Content Collections: store each project as a markdown file with frontmatter fields (title, description, date, technologies array, optional image path, optional live/repo links) and detailed body.
  - Define a schema for the collection to enforce types and generate typed data.

- **Assets**:

  - `src/assets/` for build-time images, SVGs.
  - `public/` for static files (favicon, robots.txt).

## Content Modeling

- **Project schema**:

  - title (string), description (string), date (ISO date string), technologies (array of strings), optional image path, optional live URL, optional repository URL.

- **Markdown entries**: Each project file includes defined frontmatter and a rich markdown body for narrative, images, code snippets.
- **Data retrieval**: On listing page, fetch all entries, sort by date descending, and supply each to ProjectCard. On detail page, fetch by slug and render metadata and body with styled prose.

## Animations and Interactivity

- **Homepage bounce**: Implement “SnowballSH” bounce on load using vanilla JS animation or Motion One; ensure it runs only on client and remains lightweight.
- **Reveal-on-scroll**: Use Intersection Observer with CSS transitions or Motion One to animate glass panels as they enter viewport; keep JS minimal.
- **Page transitions**: Leverage view-transition or similar native approach if desired, ensuring minimal hydration.
- **Hover/focus effects**: Subtle scale or shadow changes on cards and buttons via CSS transitions.
- **Lottie integration**: If a custom animation JSON is available, load via lottie-web in a client-only component.
- **Performance considerations**: Defer or idle-load non-essential animations so core content loads first.

## Styling and Utility Libraries

- **Tailwind CSS**: Core engine, extend config with custom colors and utilities for backdrop blur.
- **Typography plugin**: Style markdown content in project pages.
- **Icons**: Use inline SVG or an Astro-compatible icon plugin that does not require React.
- **Form support**: If contact form needed, plan for third-party endpoint (Formspree, Netlify Forms) with environment variables.
- **Analytics**: Integrate privacy-friendly solution loaded asynchronously.

## Accessibility and Performance

- **Semantic HTML**: Use proper elements (nav, main, article, section).
- **Alt text**: Ensure all images have meaningful alt attributes.
- **Color contrast**: Verify text over glass panels meets contrast guidelines; adjust opacity or text as needed.
- **Keyboard navigation**: Ensure interactive elements are focusable with visible focus styles.
- **Minimal JS**: Rely on Astro’s partial hydration; only hydrate animation or interactive components. Prefer vanilla or Motion One.
- **Image optimization**: Responsive sizes, lazy-loading offscreen images.
- **Resource hints**: Preconnect/preload for critical external resources (fonts).
- **Audits**: Run performance tools periodically; address unused CSS/JS, font loading, large assets.
