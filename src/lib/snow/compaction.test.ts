import { describe, expect, test } from "bun:test";
import { Compaction } from "./compaction";

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
