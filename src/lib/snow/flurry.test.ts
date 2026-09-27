import { describe, expect, test } from "bun:test";
import { Flurry } from "./flurry";

describe("Flurry", () => {
  test("scales its flake count with width within limits", () => {
    const flurry = new Flurry(() => 0.5);
    flurry.resize(100, 100);
    expect(flurry.count).toBe(18);
    flurry.resize(1100, 100);
    expect(flurry.count).toBe(50);
    flurry.resize(5000, 100);
    expect(flurry.count).toBe(70);
  });

  test("flakes fall and wrap back to the top", () => {
    const flurry = new Flurry(() => 0.5);
    flurry.resize(400, 100);
    const startY = flurry.y[0];
    flurry.step(16);
    expect(flurry.y[0]).toBeGreaterThan(startY);

    for (let i = 0; i < 2000; i++) flurry.step(16);
    for (const y of flurry.y) {
      expect(y).toBeGreaterThanOrEqual(-4);
      expect(y).toBeLessThanOrEqual(104);
    }
  });
});
