export type Random = () => number;

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

export const isNear = (point: Point, bounds: Bounds, margin: number): boolean =>
  point.x > bounds.left - margin &&
  point.x < bounds.right + margin &&
  point.y > bounds.top - margin &&
  point.y < bounds.bottom + margin;

export const modulo = (value: number, span: number): number =>
  ((value % span) + span) % span;

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
