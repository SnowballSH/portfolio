import { describe, expect, test } from "bun:test";
import { LetterSwarm } from "./swarm";

const seeded =
  (seed = 1) =>
  () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

const targets = (points: [number, number][]) => ({
  positions: Float32Array.from(points.flat()),
  shades: Float32Array.from(points.map(() => 0.5)),
  radius: 2,
});

const runFor = (
  swarm: LetterSwarm,
  ms: number,
  pointer = null as { x: number; y: number } | null,
) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 16) swarm.step(16, pointer);
};

const settledSwarm = () => {
  const swarm = new LetterSwarm(seeded());
  swarm.setTargets(
    targets([
      [100, 100],
      [110, 100],
      [120, 100],
    ]),
    400,
  );
  runFor(swarm, 10_000);
  return swarm;
};

describe("LetterSwarm", () => {
  test("starts above the targets and falls into place", () => {
    const swarm = new LetterSwarm(seeded());
    swarm.setTargets(
      targets([
        [100, 200],
        [140, 220],
      ]),
      400,
    );
    expect(swarm.introducing).toBe(true);
    expect(Math.max(...swarm.y)).toBeLessThan(0);

    runFor(swarm, 10_000);
    expect(swarm.settled).toBe(true);
    expect([...swarm.x]).toEqual([100, 140]);
    expect([...swarm.y]).toEqual([200, 220]);
  });

  test("covers its targets with bounds padded by the radius", () => {
    const swarm = settledSwarm();
    expect(swarm.bounds).toEqual({
      left: 98,
      top: 98,
      right: 122,
      bottom: 102,
    });
  });

  test("ignores scatters during the intro", () => {
    const swarm = new LetterSwarm(seeded());
    swarm.setTargets(targets([[100, 100]]), 400);
    expect(swarm.scatter({ x: 100, y: 100 })).toBe(false);
  });

  test("a scatter breaks the whole word, which then re-forms", () => {
    const swarm = settledSwarm();
    expect(swarm.scatter({ x: 99, y: 100 })).toBe(true);
    swarm.step(16, null);
    expect(swarm.settled).toBe(false);
    for (let i = 0; i < swarm.count; i++) {
      expect(
        Math.hypot(swarm.x[i] - (100 + i * 10), swarm.y[i] - 100),
      ).toBeGreaterThan(1);
    }

    runFor(swarm, 10_000);
    expect(swarm.settled).toBe(true);
    expect([...swarm.x]).toEqual([100, 110, 120]);
  });

  test("a scatter away from the word changes nothing", () => {
    const swarm = settledSwarm();
    expect(swarm.scatter({ x: 1000, y: 1000 })).toBe(false);
    expect(swarm.settled).toBe(true);
  });

  test("contains only points over the word itself", () => {
    const swarm = settledSwarm();
    expect(swarm.contains({ x: 110, y: 100 })).toBe(true);
    expect(swarm.contains({ x: 110, y: 130 })).toBe(false);
    expect(swarm.attracts({ x: 110, y: 130 })).toBe(true);
  });

  test("a hovering pointer pushes particles away and they recover after it leaves", () => {
    const swarm = settledSwarm();
    runFor(swarm, 500, { x: 105, y: 100 });
    expect(swarm.x[0]).toBeLessThan(100);

    runFor(swarm, 10_000, { x: 1000, y: 1000 });
    expect(swarm.settled).toBe(true);
  });

  test("retargeting keeps existing particles and spawns new ones above", () => {
    const swarm = settledSwarm();
    swarm.setTargets(
      targets([
        [200, 100],
        [210, 100],
        [220, 100],
        [230, 100],
      ]),
      400,
    );
    expect(swarm.count).toBe(4);
    expect(swarm.introducing).toBe(false);
    expect(swarm.x[0]).toBe(100);
    expect(swarm.y[3]).toBeLessThan(0);

    runFor(swarm, 10_000);
    expect([...swarm.x]).toEqual([200, 210, 220, 230]);
  });

  test("attracts only pointers near the letters", () => {
    const swarm = settledSwarm();
    expect(swarm.attracts({ x: 110, y: 100 })).toBe(true);
    expect(swarm.attracts({ x: 110, y: 400 })).toBe(false);
  });
});
