import { type Rgb, colorAt, toRgba, wordmarkGradient } from "./color";

export const SHADE_BUCKETS = 8;

export interface ThemeColors {
  ink: Rgb;
  accent: Rgb;
  dark: boolean;
}

export interface SnowPalette {
  letters: OffscreenCanvas[];
  flake: OffscreenCanvas;
  letterRadius: number;
  flakeRadius: number;
}

const FLAKE_SPRITE_RADIUS = 3;
const MAX_PARTICLE_SCALE = 1.25;
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
      toRgba(colorAt(gradient, (bucket + 0.5) / SHADE_BUCKETS)),
      letterRadius * MAX_PARTICLE_SCALE,
      dpr,
      0.5,
    ),
  );
  const flake = theme.dark
    ? createDotSprite(toRgba(DARK_FLAKE, 0.75), FLAKE_SPRITE_RADIUS, dpr, 0.2)
    : createDotSprite(
        toRgba(theme.accent, 0.45),
        FLAKE_SPRITE_RADIUS,
        dpr,
        0.2,
      );
  return { letters, flake, letterRadius, flakeRadius: FLAKE_SPRITE_RADIUS };
}

function resolveCssColor(value: string): Rgb {
  const context = new OffscreenCanvas(1, 1).getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) throw new Error("2D canvas is unavailable");
  context.fillStyle = value.trim() || "#000";
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data;
  return { r, g, b };
}

function createDotSprite(
  color: string,
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
  fill.addColorStop(0, color);
  fill.addColorStop(solidFraction, color);
  fill.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
  context.fillStyle = fill;
  context.fillRect(0, 0, size, size);
  return sprite;
}
