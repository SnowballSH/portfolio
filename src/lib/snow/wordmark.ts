import { type Random, clamp } from "./math";
import type { SwarmTargets } from "./swarm";

export interface WordmarkLayout {
  word: string;
  font: string;
  letterSpacing: number;
  box: { left: number; top: number; width: number; height: number };
}

const INK_ALPHA = 128;
const MAX_INK_COVERAGE = 0.6;

export const particleBudget = (viewportWidth: number): number =>
  clamp(Math.round(viewportWidth * 1.6), 700, 1800);

export const particleSpacing = (inkPixels: number, budget: number): number =>
  clamp(Math.sqrt(inkPixels / budget), 1.6, 6);

export const isPlausibleInk = (
  inkPixels: number,
  totalPixels: number,
): boolean => inkPixels > 0 && inkPixels / totalPixels <= MAX_INK_COVERAGE;

export function sampleWordmark(
  { word, font, letterSpacing, box }: WordmarkLayout,
  budget: number,
  random: Random,
): SwarmTargets | null {
  const pad = Math.ceil(box.height * 0.25);
  const width = Math.ceil(box.width) + pad * 2;
  const height = Math.ceil(box.height) + pad * 2;
  const alpha = renderWordAlpha(
    word,
    font,
    letterSpacing,
    box.width,
    pad,
    width,
    height,
  );

  let ink = 0;
  for (const value of alpha) if (value > INK_ALPHA) ink++;
  if (!isPlausibleInk(ink, alpha.length)) return null;
  const spacing = particleSpacing(ink, budget);

  const positions: number[] = [];
  const shades: number[] = [];
  for (let py = spacing / 2; py < height; py += spacing) {
    for (let px = spacing / 2; px < width; px += spacing) {
      const x = px + (random() - 0.5) * spacing * 0.5;
      const y = py + (random() - 0.5) * spacing * 0.5;
      const column = clamp(Math.floor(x), 0, width - 1);
      const row = clamp(Math.floor(y), 0, height - 1);
      if ((alpha[row * width + column] ?? 0) <= INK_ALPHA) continue;
      const canvasY = box.top - pad + y;
      positions.push(box.left - pad + x, canvasY);
      shades.push(clamp((canvasY - box.top) / box.height, 0, 1));
    }
  }

  return {
    positions: Float32Array.from(positions),
    shades: Float32Array.from(shades),
    radius: spacing * 0.68,
  };
}

function renderWordAlpha(
  word: string,
  font: string,
  letterSpacing: number,
  targetWidth: number,
  pad: number,
  width: number,
  height: number,
): Uint8ClampedArray {
  const context = new OffscreenCanvas(width, height).getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) throw new Error("2D canvas is unavailable");
  context.font = font;
  context.textBaseline = "middle";
  const glyphs = [...word];
  const advances = glyphs.map((glyph) => context.measureText(glyph).width);
  const naturalWidth =
    advances.reduce((sum, advance) => sum + advance, 0) +
    letterSpacing * glyphs.length;
  context.setTransform(targetWidth / naturalWidth, 0, 0, 1, pad, 0);
  let cursor = 0;
  glyphs.forEach((glyph, index) => {
    context.fillText(glyph, cursor, height / 2);
    cursor += (advances[index] ?? 0) + letterSpacing;
  });
  const rgba = context.getImageData(0, 0, width, height).data;
  return rgba.filter((_, index) => index % 4 === 3);
}
