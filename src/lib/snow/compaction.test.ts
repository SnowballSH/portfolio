import { describe, expect, test } from "bun:test";
import {
  breakingLook,
  Compaction,
  type CompactionLook,
  formingLook,
} from "./compaction";

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

describe("formingLook", () => {
  test("starts as pure snow and ends as pure type", () => {
    expect(formingLook(0)).toEqual({
      layerAlpha: 0,
      flakeAlpha: 1,
      flakeScale: 1,
    });
    const solid = formingLook(1);
    expect(solid.layerAlpha).toBe(1);
    expect(solid.flakeAlpha).toBe(0);
  });

  test("the type is nearly opaque before the flakes are half gone", () => {
    let progress = 0;
    while (formingLook(progress).flakeAlpha > 0.5) progress += 0.01;
    expect(formingLook(progress).layerAlpha).toBeGreaterThan(0.95);
  });

  test("changes monotonically and eases at both ends", () => {
    const samples = Array.from({ length: 101 }, (_, i) => formingLook(i / 100));
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

describe("breakingLook", () => {
  test("shows every flake at once while the type fades out", () => {
    expect(breakingLook(1)).toEqual({
      layerAlpha: 1,
      flakeAlpha: 1,
      flakeScale: 1.1,
    });
    expect(breakingLook(0.5).flakeAlpha).toBe(1);
    expect(breakingLook(0.5).layerAlpha).toBeCloseTo(0.5);
    expect(breakingLook(0)).toEqual(formingLook(0));
  });
});

describe("Compaction defaults", () => {
  test("forms over 1.4 s and breaks over 200 ms, choosing the look by direction", () => {
    const compaction = new Compaction();
    compaction.step(1399, true);
    expect(compaction.complete).toBe(false);
    compaction.step(1, true);
    expect(compaction.complete).toBe(true);
    expect(compaction.look()).toEqual(formingLook(1));

    compaction.step(100, false);
    expect(compaction.value).toBeCloseTo(0.5);
    expect(compaction.look()).toEqual(breakingLook(0.5));
    compaction.step(100, false);
    expect(compaction.value).toBe(0);
  });
});

describe("direction changes", () => {
  const close = (a: CompactionLook, b: CompactionLook) => {
    expect(a.layerAlpha).toBeCloseTo(b.layerAlpha, 2);
    expect(a.flakeAlpha).toBeCloseTo(b.flakeAlpha, 2);
    expect(a.flakeScale).toBeCloseTo(b.flakeScale, 2);
  };

  test("breaking during formation continues from the current look", () => {
    const compaction = new Compaction(1000, 200);
    compaction.step(600, true);
    const before = compaction.look();
    compaction.step(1, false);
    close(compaction.look(), before);
    compaction.step(1000, false);
    expect(compaction.look()).toEqual(formingLook(0));
  });

  test("re-forming during a break continues from the current look", () => {
    const compaction = new Compaction(1000, 200);
    compaction.step(1000, true);
    compaction.step(140, false);
    const before = compaction.look();
    compaction.step(1, true);
    close(compaction.look(), before);
    compaction.step(2000, true);
    expect(compaction.look()).toEqual(formingLook(1));
  });

  test("breaking a solid word shows the flakes at once", () => {
    const compaction = new Compaction(1000, 200);
    compaction.step(1000, true);
    compaction.step(1, false);
    expect(compaction.look().flakeAlpha).toBe(1);
  });
});
