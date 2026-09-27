import { describe, expect, test } from "bun:test";
import { colorAt, mixRgb, toRgba, wordmarkGradient } from "./color";

const black = { r: 0, g: 0, b: 0 };
const white = { r: 255, g: 255, b: 255 };

describe("color", () => {
  test("mixes channels linearly", () => {
    expect(mixRgb(black, white, 0.5)).toEqual({ r: 127.5, g: 127.5, b: 127.5 });
  });

  test("formats rounded rgba strings", () => {
    expect(toRgba({ r: 1.4, g: 2.6, b: 3 }, 0.5)).toBe("rgba(1, 3, 3, 0.5)");
  });

  test("interpolates between gradient stops and clamps outside them", () => {
    const stops = [
      { offset: 0.2, color: black },
      { offset: 0.8, color: white },
    ];
    expect(colorAt(stops, 0)).toEqual(black);
    const middle = colorAt(stops, 0.5);
    for (const channel of [middle.r, middle.g, middle.b]) {
      expect(channel).toBeCloseTo(127.5);
    }
    expect(colorAt(stops, 1)).toEqual(white);
  });

  test("rejects an empty gradient", () => {
    expect(() => colorAt([], 0.5)).toThrow();
  });

  test("builds the wordmark gradient from ink toward accent", () => {
    const [top, middle, bottom] = wordmarkGradient(black, white);
    expect(top?.color).toEqual(black);
    expect(middle?.color.r).toBeCloseTo(255 * 0.55);
    expect(bottom?.color.r).toBeCloseTo(255 * 0.92);
  });
});
