import {
  type Rgb,
  colorAt,
  parseCanvasColor,
  toRgba,
  wordmarkGradient,
} from "./color";

export const SHADE_BUCKETS = 8;
export const MAX_PARTICLE_SCALE = 1.25;

export interface ThemeColors {
  ink: Rgb;
  accent: Rgb;
  dark: boolean;
}

export interface SnowPalette {
  letters: OffscreenCanvas[];
  flake: OffscreenCanvas;
  letterRadius: number;
}

const FLAKE_SPRITE_RADIUS = 3;
const DARK_FLAKE: Rgb = { r: 225, g: 238, b: 255 };

export const shadeBucket = (shade: number): number =>
  Math.min(SHADE_BUCKETS - 1, Math.floor(shade * SHADE_BUCKETS));

export function readThemeColors(root: HTMLElement): ThemeColors {
  const style = getComputedStyle(root);
  return {
    ink: resolveCssColor(style.getPropertyValue("--fui-ink")),
    accent: resolveCssColor(style.getPropertyValue("--fui-accent")),
    dark: root.dataset.theme === "dark",
  };
}

export function createPalette(
  theme: ThemeColors,
  letterRadius: number,
  dpr: number,
): SnowPalette {
  const gradient = wordmarkGradient(theme.ink, theme.accent);
  const letters = Array.from({ length: SHADE_BUCKETS }, (_, bucket) =>
    createDotSprite(
      colorAt(gradient, (bucket + 0.5) / SHADE_BUCKETS),
      1,
      letterRadius * MAX_PARTICLE_SCALE,
      dpr,
      0.5,
    ),
  );
  const flake = theme.dark
    ? createDotSprite(DARK_FLAKE, 0.75, FLAKE_SPRITE_RADIUS, dpr, 0.2)
    : createDotSprite(theme.accent, 0.45, FLAKE_SPRITE_RADIUS, dpr, 0.2);
  return { letters, flake, letterRadius };
}

function resolveCssColor(value: string): Rgb {
  const color = value.trim();
  const context = new OffscreenCanvas(1, 1).getContext("2d");
  if (!context || !CSS.supports("color", color)) {
    throw new Error(`Unsupported theme color: ${color}`);
  }
  context.fillStyle = color;
  const rgb = parseCanvasColor(String(context.fillStyle));
  if (!rgb) throw new Error(`Unsupported theme color: ${color}`);
  return rgb;
}

function createDotSprite(
  color: Rgb,
  alpha: number,
  radius: number,
  dpr: number,
  solidFraction: number,
): OffscreenCanvas {
  const size = Math.ceil(radius * 2 * dpr) + 2;
  const sprite = new OffscreenCanvas(size, size);
  const context = sprite.getContext("2d");
  if (!context) throw new Error("2D canvas is unavailable");
  const center = size / 2;
  const fill = context.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    center,
  );
  fill.addColorStop(0, toRgba(color, alpha));
  fill.addColorStop(solidFraction, toRgba(color, alpha));
  fill.addColorStop(1, toRgba(color, 0));
  context.fillStyle = fill;
  context.fillRect(0, 0, size, size);
  return sprite;
}
