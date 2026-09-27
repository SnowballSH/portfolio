import { describe, expect, test } from "bun:test";
import { SHADE_BUCKETS, shadeBucket } from "./palette";
import { isPlausibleInk, particleBudget, particleSpacing } from "./wordmark";

describe("particle sizing", () => {
  test("budgets more particles for wider screens within limits", () => {
    expect(particleBudget(320)).toBe(700);
    expect(particleBudget(800)).toBe(1280);
    expect(particleBudget(2560)).toBe(1800);
  });

  test("spaces particles so the ink area meets the budget", () => {
    expect(particleSpacing(16_000, 1000)).toBe(4);
    expect(particleSpacing(10, 1000)).toBe(1.6);
    expect(particleSpacing(1_000_000, 1000)).toBe(6);
  });

  test("maps shades onto every bucket", () => {
    expect(shadeBucket(0)).toBe(0);
    expect(shadeBucket(0.5)).toBe(SHADE_BUCKETS / 2);
    expect(shadeBucket(1)).toBe(SHADE_BUCKETS - 1);
  });

  test("rejects blank or saturated samples", () => {
    expect(isPlausibleInk(0, 10_000)).toBe(false);
    expect(isPlausibleInk(9_000, 10_000)).toBe(false);
    expect(isPlausibleInk(2_500, 10_000)).toBe(true);
  });
});
