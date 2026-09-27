import { type Box, clamp, type Point } from "./math";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface GradientStop {
  offset: number;
  color: Rgb;
}

export interface GradientLine {
  start: Point;
  direction: Point;
  length: number;
}

interface Oklab {
  l: number;
  a: number;
  b: number;
}

export const WORDMARK_ANGLE_DEG = 172;

export const WORDMARK_STOPS = [
  { offset: 0.06, accentShare: 0 },
  { offset: 0.55, accentShare: 0.55 },
  { offset: 0.98, accentShare: 0.92 },
] as const;

const toLinear = (channel: number): number => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (linear: number): number => {
  const c =
    linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, c * 255));
};

function rgbToOklab({ r, g, b }: Rgb): Oklab {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(
    0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb,
  );
  const m = Math.cbrt(
    0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb,
  );
  const s = Math.cbrt(
    0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb,
  );
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToRgb({ l, a, b }: Oklab): Rgb {
  const lc = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mc = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sc = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: fromLinear(4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc),
    g: fromLinear(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc),
    b: fromLinear(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc),
  };
}

export function mixOklab(from: Rgb, to: Rgb, t: number): Rgb {
  const a = rgbToOklab(from);
  const b = rgbToOklab(to);
  return oklabToRgb({
    l: a.l + (b.l - a.l) * t,
    a: a.a + (b.a - a.a) * t,
    b: a.b + (b.b - a.b) * t,
  });
}

export const toRgba = ({ r, g, b }: Rgb, alpha = 1): string =>
  `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;

export function parseCanvasColor(value: string): Rgb | null {
  const hex = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(value);
  if (hex) {
    const [, r = "0", g = "0", b = "0"] = hex;
    return { r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16) };
  }
  const rgb = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(value);
  if (rgb) {
    const [, r = "0", g = "0", b = "0"] = rgb;
    return { r: Number(r), g: Number(g), b: Number(b) };
  }
  return null;
}

export function colorAt(stops: readonly GradientStop[], offset: number): Rgb {
  const [first] = stops;
  if (!first) throw new Error("A gradient needs at least one stop");
  let previous = first;
  for (const stop of stops) {
    if (offset <= stop.offset) {
      const span = stop.offset - previous.offset;
      const t = span > 0 ? clamp((offset - previous.offset) / span, 0, 1) : 0;
      return mixOklab(previous.color, stop.color, t);
    }
    previous = stop;
  }
  return previous.color;
}

export const wordmarkGradient = (ink: Rgb, accent: Rgb): GradientStop[] =>
  WORDMARK_STOPS.map(({ offset, accentShare }) => ({
    offset,
    color: mixOklab(ink, accent, accentShare),
  }));

const percent = (fraction: number): string =>
  `${Math.round(fraction * 1000) / 10}%`;

export const wordmarkCssGradient = (): string => {
  const stops = WORDMARK_STOPS.map(({ offset, accentShare }) => {
    const color =
      accentShare === 0
        ? "var(--fui-ink)"
        : `color-mix(in oklab, var(--fui-accent) ${percent(accentShare)}, var(--fui-ink))`;
    return `${color} ${percent(offset)}`;
  });
  return `linear-gradient(${WORDMARK_ANGLE_DEG}deg, ${stops.join(", ")})`;
};

export function cssGradientLine(angleDeg: number, box: Box): GradientLine {
  const radians = (angleDeg * Math.PI) / 180;
  const direction = { x: Math.sin(radians), y: -Math.cos(radians) };
  const length =
    Math.abs(box.width * direction.x) + Math.abs(box.height * direction.y);
  return {
    start: {
      x: box.left + box.width / 2 - (direction.x * length) / 2,
      y: box.top + box.height / 2 - (direction.y * length) / 2,
    },
    direction,
    length,
  };
}

export const gradientOffset = (point: Point, line: GradientLine): number =>
  clamp(
    ((point.x - line.start.x) * line.direction.x +
      (point.y - line.start.y) * line.direction.y) /
      line.length,
    0,
    1,
  );
