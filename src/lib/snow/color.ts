import { clamp } from "./math";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface GradientStop {
  offset: number;
  color: Rgb;
}

export const mixRgb = (from: Rgb, to: Rgb, t: number): Rgb => ({
  r: from.r + (to.r - from.r) * t,
  g: from.g + (to.g - from.g) * t,
  b: from.b + (to.b - from.b) * t,
});

export const toRgba = ({ r, g, b }: Rgb, alpha = 1): string =>
  `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;

export function colorAt(stops: readonly GradientStop[], offset: number): Rgb {
  const [first] = stops;
  if (!first) throw new Error("A gradient needs at least one stop");
  let previous = first;
  for (const stop of stops) {
    if (offset <= stop.offset) {
      const span = stop.offset - previous.offset;
      const t = span > 0 ? clamp((offset - previous.offset) / span, 0, 1) : 0;
      return mixRgb(previous.color, stop.color, t);
    }
    previous = stop;
  }
  return previous.color;
}

export const wordmarkGradient = (ink: Rgb, accent: Rgb): GradientStop[] => [
  { offset: 0.06, color: ink },
  { offset: 0.55, color: mixRgb(ink, accent, 0.55) },
  { offset: 0.98, color: mixRgb(ink, accent, 0.92) },
];
