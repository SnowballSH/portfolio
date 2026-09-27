import { type Random, clamp } from "./math";

const FRAME_MS = 1000 / 60;

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
    this.width = width;
    this.height = height;
    const count = clamp(Math.round(width / 22), 18, 70);
    this.x = Float32Array.from({ length: count }, () => this.random() * width);
    this.y = Float32Array.from({ length: count }, () => this.random() * height);
    this.radius = Float32Array.from(
      { length: count },
      () => 0.7 + this.random() ** 2 * 2.2,
    );
    this.swayPhase = Float32Array.from(
      { length: count },
      () => this.random() * Math.PI * 2,
    );
  }

  step(dtMs: number): void {
    this.clock += dtMs;
    const frames = dtMs / FRAME_MS;
    const edge = 4;
    for (let i = 0; i < this.count; i++) {
      const radius = this.radius[i];
      let x =
        this.x[i] +
        Math.sin(this.clock / 1300 + this.swayPhase[i]) * 0.25 * frames;
      let y = this.y[i] + (0.25 + radius * 0.22) * frames;
      if (y > this.height + edge) {
        y = -edge;
        x = this.random() * this.width;
      }
      if (x < -edge) x += this.width + edge * 2;
      else if (x > this.width + edge) x -= this.width + edge * 2;
      this.x[i] = x;
      this.y[i] = y;
    }
  }
}
