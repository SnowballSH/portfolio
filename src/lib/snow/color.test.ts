import { describe, expect, test } from "bun:test";
import {
  colorAt,
  mixOklab,
  parseCanvasColor,
  toRgba,
  wordmarkCssGradient,
  wordmarkGradient,
} from "./color";

const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };
const blue = { r: 30, g: 89, b: 181 };

const expectRgbClose = (
  actual: { r: number; g: number; b: number },
  expected: { r: number; g: number; b: number },
) => {
  expect(actual.r).toBeCloseTo(expected.r, 0);
  expect(actual.g).toBeCloseTo(expected.g, 0);
  expect(actual.b).toBeCloseTo(expected.b, 0);
};

describe("mixOklab", () => {
  test("returns the endpoints at 0 and 1", () => {
    expectRgbClose(mixOklab(blue, white, 0), blue);
    expectRgbClose(mixOklab(blue, white, 1), white);
  });

  test("keeps grays neutral and brightens perceptually", () => {
    const middle = mixOklab(black, white, 0.5);
    expect(middle.r).toBeCloseTo(middle.g, 0);
    expect(middle.g).toBeCloseTo(middle.b, 0);
    expect(middle.r).toBeGreaterThan(90);
    expect(middle.r).toBeLessThan(105);
  });
});

describe("parseCanvasColor", () => {
  test("parses canvas-normalized hex and rgba strings", () => {
    expect(parseCanvasColor("#1e59b5")).toEqual(blue);
    expect(parseCanvasColor("rgba(30, 89, 181, 0.5)")).toEqual(blue);
  });

  test("rejects anything else", () => {
    expect(parseCanvasColor("oklch(0.5 0.1 250)")).toBeNull();
  });
});

describe("gradients", () => {
  const stops = [
    { offset: 0.2, color: black },
    { offset: 0.8, color: white },
  ];

  test("clamps outside the stops", () => {
    expect(colorAt(stops, 0)).toEqual(black);
    expect(colorAt(stops, 1)).toEqual(white);
  });

  test("interpolates between stops in Oklab", () => {
    expectRgbClose(colorAt(stops, 0.5), mixOklab(black, white, 0.5));
  });

  test("rejects an empty gradient", () => {
    expect(() => colorAt([], 0.5)).toThrow();
  });

  test("canvas and CSS gradients share the same stops", () => {
    const canvasStops = wordmarkGradient(black, blue);
    expect(canvasStops.map((stop) => stop.offset)).toEqual([0.06, 0.55, 0.98]);
    expectRgbClose(canvasStops[1]?.color ?? black, mixOklab(black, blue, 0.55));
    expect(wordmarkCssGradient()).toBe(
      "linear-gradient(172deg, var(--fui-ink) 6%, " +
        "color-mix(in oklab, var(--fui-accent) 55%, var(--fui-ink)) 55%, " +
        "color-mix(in oklab, var(--fui-accent) 92%, var(--fui-ink)) 98%)",
    );
  });

  test("formats rounded rgba strings", () => {
    expect(toRgba({ r: 1.4, g: 2.6, b: 3 }, 0.5)).toBe("rgba(1, 3, 3, 0.5)");
  });
});
