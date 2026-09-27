import { clamp, modulo, type Random } from "./math";

const FRAME_MS = 1000 / 60;
const EDGE = 4;
const MAX_RADIUS = 2.9;

export const flakeCount = (width: number, height: number): number =>
  clamp(Math.round((width * height) / 16_000), 20, 90);

export class Flurry {
  x = new Float32Array(0);
  y = new Float32Array(0);
  radius = new Float32Array(0);
  private swayPhase = new Float32Array(0);
  private width = 0;
  private height = 0;
  private clock = 0;

  constructor(private readonly random: Random) {}

  get count(): number {
    return this.x.length;
  }

  resize(width: number, height: number): void {
    const count = flakeCount(width, height);
    const keep = Math.min(this.count, count);
    const carry = (source: Float32Array, fresh: () => number) =>
      Float32Array.from({ length: count }, (_, i) =>
        i < keep ? source[i] : fresh(),
      );
    this.x = carry(this.x, () => this.random() * width).map((x) =>
      x > width + EDGE ? this.random() * width : x,
    );
    this.y = carry(this.y, () => this.random() * height).map((y) =>
      y > height + EDGE ? this.random() * height : y,
    );
    this.radius = carry(this.radius, () => 0.7 + this.random() ** 2 * 2.2);
    this.swayPhase = carry(this.swayPhase, () => this.random() * Math.PI * 2);
    this.width = width;
    this.height = height;
  }

  step(dtMs: number): void {
    this.clock += dtMs;
    const frames = dtMs / FRAME_MS;
    for (let i = 0; i < this.count; i++) {
      const sway = Math.sin(this.clock / 1300 + this.swayPhase[i]) * 0.25;
      this.x[i] += sway * frames;
      this.y[i] += (0.25 + this.radius[i] * 0.22) * frames;
      this.wrap(i);
    }
  }

  drift(scrollDelta: number): void {
    for (let i = 0; i < this.count; i++) {
      const depth = 0.25 + (this.radius[i] / MAX_RADIUS) * 0.5;
      this.y[i] -= scrollDelta * depth;
      this.wrap(i);
    }
  }

  private wrap(i: number): void {
    if (this.y[i] < -EDGE || this.y[i] > this.height + EDGE) {
      this.y[i] = modulo(this.y[i] + EDGE, this.height + EDGE * 2) - EDGE;
      this.x[i] = this.random() * this.width;
    }
    if (this.x[i] < -EDGE || this.x[i] > this.width + EDGE) {
      this.x[i] = modulo(this.x[i] + EDGE, this.width + EDGE * 2) - EDGE;
    }
  }
}
