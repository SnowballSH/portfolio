import { describe, expect, test } from "bun:test";
import { Flurry, flakeCount } from "./flurry";

const seeded =
  (seed = 7) =>
  () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

const inBounds = (flurry: Flurry, width: number, height: number) => {
  for (let i = 0; i < flurry.count; i++) {
    expect(flurry.x[i]).toBeGreaterThanOrEqual(-4);
    expect(flurry.x[i]).toBeLessThanOrEqual(width + 4);
    expect(flurry.y[i]).toBeGreaterThanOrEqual(-4);
    expect(flurry.y[i]).toBeLessThanOrEqual(height + 4);
  }
};

describe("Flurry", () => {
  test("scales its flake count with the viewport area within limits", () => {
    expect(flakeCount(320, 400)).toBe(20);
    expect(flakeCount(1280, 800)).toBe(64);
    expect(flakeCount(3840, 2160)).toBe(90);
  });

  test("keeps existing flakes when the viewport resizes", () => {
    const flurry = new Flurry(seeded());
    flurry.resize(1280, 800);
    const first = [flurry.x[0], flurry.y[0]];
    flurry.resize(1280, 760);
    expect([flurry.x[0], flurry.y[0]]).toEqual(first);
    expect(flurry.count).toBe(flakeCount(1280, 760));
  });

  test("flakes fall and stay on screen", () => {
    const flurry = new Flurry(seeded());
    flurry.resize(400, 300);
    const startY = flurry.y[0];
    flurry.step(16);
    expect(flurry.y[0]).toBeGreaterThan(startY);
    for (let i = 0; i < 3000; i++) flurry.step(16);
    inBounds(flurry, 400, 300);
  });

  test("scrolling drifts flakes with parallax and wraps any distance", () => {
    const flurry = new Flurry(seeded());
    flurry.resize(400, 300);
    const before = Float32Array.from(flurry.y);
    flurry.drift(10);
    const moved = [...flurry.y].map((y, i) => (before[i] ?? 0) - y);
    expect(Math.min(...moved.filter((d) => d > 0))).toBeGreaterThan(2);
    expect(new Set(moved.map((d) => d.toFixed(1))).size).toBeGreaterThan(1);

    flurry.drift(12_345);
    flurry.drift(-54_321);
    inBounds(flurry, 400, 300);
  });
});
