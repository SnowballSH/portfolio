import { describe, expect, test } from "bun:test";
import { Compaction, compactionLook } from "./compaction";

describe("Compaction", () => {
  test("forms gradually while settled and completes", () => {
    const compaction = new Compaction(700, 160);
    compaction.step(350, true);
    expect(compaction.value).toBeCloseTo(0.5);
    expect(compaction.complete).toBe(false);
    compaction.step(1000, true);
    expect(compaction.value).toBe(1);
    expect(compaction.complete).toBe(true);
  });

  test("breaks quickly once disturbed", () => {
    const compaction = new Compaction(700, 160);
    compaction.step(1000, true);
    compaction.step(80, false);
    expect(compaction.value).toBeCloseTo(0.5);
    compaction.step(1000, false);
    expect(compaction.value).toBe(0);
  });
});

describe("compactionLook", () => {
  test("starts as pure snow and ends as pure type", () => {
    expect(compactionLook(0)).toEqual({
      layerAlpha: 0,
      flakeAlpha: 1,
      flakeScale: 1,
    });
    const solid = compactionLook(1);
    expect(solid.layerAlpha).toBe(1);
    expect(solid.flakeAlpha).toBe(0);
  });

  test("the type is nearly opaque before the flakes are half gone", () => {
    let progress = 0;
    while (compactionLook(progress).flakeAlpha > 0.5) progress += 0.01;
    expect(compactionLook(progress).layerAlpha).toBeGreaterThan(0.95);
  });

  test("changes monotonically and eases at both ends", () => {
    const samples = Array.from({ length: 101 }, (_, i) =>
      compactionLook(i / 100),
    );
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i].layerAlpha).toBeGreaterThanOrEqual(
        samples[i - 1].layerAlpha,
      );
      expect(samples[i].flakeAlpha).toBeLessThanOrEqual(
        samples[i - 1].flakeAlpha,
      );
    }
    expect(samples[1].layerAlpha).toBeLessThan(0.01);
    expect(samples[99].flakeAlpha).toBeLessThan(0.01);
  });
});
