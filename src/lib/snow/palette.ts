import { context2d } from "./canvas";
import { FLAKE_GROWTH } from "./compaction";
import { FLAKE_SIZE } from "./swarm";
import {
  type Rgb,
  colorAt,
  parseCanvasColor,
  toRgba,
  wordmarkGradient,
} from "./color";

export const SHADE_BUCKETS = 16;
const MAX_PARTICLE_SCALE = FLAKE_SIZE.max * (1 + FLAKE_GROWTH);
export const FLAKE_SPRITE_RADIUS = 3;

export interface ThemeColors {
  ink: Rgb;
  accent: Rgb;
  dark: boolean;
}

export interface LetterSprites {
  sprites: OffscreenCanvas[];
  radius: number;
}

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

export function createLetterSprites(
  theme: ThemeColors,
  radius: number,
  dpr: number,
): LetterSprites {
  const gradient = wordmarkGradient(theme.ink, theme.accent);
  const sprites = Array.from({ length: SHADE_BUCKETS }, (_, bucket) =>
    createDotSprite(
      colorAt(gradient, (bucket + 0.5) / SHADE_BUCKETS),
      1,
      radius * MAX_PARTICLE_SCALE,
      dpr,
      0.5,
    ),
  );
  return { sprites, radius };
}

export const createFlakeSprite = (
  theme: ThemeColors,
  dpr: number,
): OffscreenCanvas =>
  theme.dark
    ? createDotSprite(DARK_FLAKE, 0.75, FLAKE_SPRITE_RADIUS, dpr, 0.2)
    : createDotSprite(theme.accent, 0.6, FLAKE_SPRITE_RADIUS, dpr, 0.25);

function resolveCssColor(value: string): Rgb {
  const color = value.trim();
  if (!CSS.supports("color", color)) {
    throw new Error(`Unsupported theme color: ${color}`);
  }
  const context = context2d(new OffscreenCanvas(1, 1));
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
  const context = context2d(sprite);
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
