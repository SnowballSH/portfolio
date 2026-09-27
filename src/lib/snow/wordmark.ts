import { context2d } from "./canvas";
import {
  colorAt,
  cssGradientLine,
  type GradientStop,
  gradientOffset,
  toRgba,
  WORDMARK_ANGLE_DEG,
} from "./color";
import { type Box, clamp, type Random } from "./math";
import type { SwarmTargets } from "./swarm";

export interface WordmarkLayout {
  word: string;
  font: string;
  letterSpacing: number;
  box: Box;
  gradientBox: Box;
}

export interface WordmarkLayer {
  image: OffscreenCanvas;
  box: Box;
}

const INK_ALPHA = 128;
const MAX_INK_COVERAGE = 0.6;
const PAD_RATIO = 0.25;
const GRADIENT_SAMPLES = 16;

export const particleBudget = (viewportWidth: number): number =>
  clamp(Math.round(viewportWidth * 1.6), 700, 1800);

export const particleSpacing = (inkPixels: number, budget: number): number =>
  clamp(Math.sqrt(inkPixels / budget), 1.6, 6);

export const isPlausibleInk = (
  inkPixels: number,
  totalPixels: number,
): boolean => inkPixels > 0 && inkPixels / totalPixels <= MAX_INK_COVERAGE;

const paddedBox = ({ box }: WordmarkLayout): Box => {
  const pad = Math.ceil(box.height * PAD_RATIO);
  return {
    left: box.left - pad,
    top: box.top - pad,
    width: Math.ceil(box.width) + pad * 2,
    height: Math.ceil(box.height) + pad * 2,
  };
};

function drawWord(
  context: OffscreenCanvasRenderingContext2D,
  layout: WordmarkLayout,
  area: Box,
  scale: number,
): void {
  const { word, font, letterSpacing, box } = layout;
  context.font = font;
  context.textBaseline = "middle";
  const glyphs = [...word];
  const advances = glyphs.map((glyph) => context.measureText(glyph).width);
  const naturalWidth =
    advances.reduce((sum, advance) => sum + advance, 0) +
    letterSpacing * glyphs.length;
  context.setTransform(
    (scale * box.width) / naturalWidth,
    0,
    0,
    scale,
    (box.left - area.left) * scale,
    0,
  );
  const baseline = box.top - area.top + box.height / 2;
  let cursor = 0;
  glyphs.forEach((glyph, index) => {
    context.fillText(glyph, cursor, baseline);
    cursor += (advances[index] ?? 0) + letterSpacing;
  });
}

export function sampleWordmark(
  layout: WordmarkLayout,
  budget: number,
  random: Random,
): SwarmTargets | null {
  const area = paddedBox(layout);
  const context = context2d(new OffscreenCanvas(area.width, area.height), {
    willReadFrequently: true,
  });
  drawWord(context, layout, area, 1);
  const alpha = context
    .getImageData(0, 0, area.width, area.height)
    .data.filter((_, index) => index % 4 === 3);

  let ink = 0;
  for (const value of alpha) if (value > INK_ALPHA) ink++;
  if (!isPlausibleInk(ink, alpha.length)) return null;
  const spacing = particleSpacing(ink, budget);
  const line = cssGradientLine(WORDMARK_ANGLE_DEG, layout.gradientBox);

  const positions: number[] = [];
  const shades: number[] = [];
  for (let py = spacing / 2; py < area.height; py += spacing) {
    for (let px = spacing / 2; px < area.width; px += spacing) {
      const x = px + (random() - 0.5) * spacing * 0.5;
      const y = py + (random() - 0.5) * spacing * 0.5;
      const column = clamp(Math.floor(x), 0, area.width - 1);
      const row = clamp(Math.floor(y), 0, area.height - 1);
      if ((alpha[row * area.width + column] ?? 0) <= INK_ALPHA) continue;
      const point = { x: area.left + x, y: area.top + y };
      positions.push(point.x, point.y);
      shades.push(gradientOffset(point, line));
    }
  }

  return {
    positions: Float32Array.from(positions),
    shades: Float32Array.from(shades),
    radius: spacing * 0.68,
  };
}

export function renderWordmarkLayer(
  layout: WordmarkLayout,
  stops: readonly GradientStop[],
  dpr: number,
): WordmarkLayer {
  const area = paddedBox(layout);
  const image = new OffscreenCanvas(
    Math.ceil(area.width * dpr),
    Math.ceil(area.height * dpr),
  );
  const context = context2d(image);
  drawWord(context, layout, area, dpr);

  const line = cssGradientLine(WORDMARK_ANGLE_DEG, {
    ...layout.gradientBox,
    left: layout.gradientBox.left - area.left,
    top: layout.gradientBox.top - area.top,
  });
  const fill = context.createLinearGradient(
    line.start.x * dpr,
    line.start.y * dpr,
    (line.start.x + line.direction.x * line.length) * dpr,
    (line.start.y + line.direction.y * line.length) * dpr,
  );
  for (let i = 0; i <= GRADIENT_SAMPLES; i++) {
    const offset = i / GRADIENT_SAMPLES;
    fill.addColorStop(offset, toRgba(colorAt(stops, offset)));
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.globalCompositeOperation = "source-in";
  context.fillStyle = fill;
  context.fillRect(0, 0, image.width, image.height);
  return { image, box: area };
}
