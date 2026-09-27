import {
  type Bounds,
  type Point,
  type Random,
  clamp,
  easeOutCubic,
  isNear,
} from "./math";

export interface SwarmTargets {
  positions: Float32Array;
  shades: Float32Array;
  radius: number;
}

export interface SwarmTuning {
  spring: number;
  damping: number;
  hoverRadius: number;
  hoverForce: number;
  burstRadius: number;
  burstForce: number;
  introDuration: number;
  introStagger: number;
  introSweep: number;
  introDrift: number;
  settleDistance: number;
  settleSpeed: number;
}

export const DEFAULT_TUNING: SwarmTuning = {
  spring: 0.055,
  damping: 0.84,
  hoverRadius: 70,
  hoverForce: 1.6,
  burstRadius: 130,
  burstForce: 14,
  introDuration: 1500,
  introStagger: 600,
  introSweep: 300,
  introDrift: 240,
  settleDistance: 0.15,
  settleSpeed: 0.02,
};

type Phase = "idle" | "intro" | "physics" | "settled";

const FRAME_MS = 1000 / 60;

export class LetterSwarm {
  x = new Float32Array(0);
  y = new Float32Array(0);
  shade = new Float32Array(0);
  size = new Float32Array(0);
  radius = 1;
  bounds: Bounds = { left: 0, top: 0, right: 0, bottom: 0 };

  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private targetX = new Float32Array(0);
  private targetY = new Float32Array(0);
  private startX = new Float32Array(0);
  private startY = new Float32Array(0);
  private delay = new Float32Array(0);
  private swayPhase = new Float32Array(0);
  private phase: Phase = "idle";
  private introElapsed = 0;
  private clock = 0;

  constructor(
    private readonly random: Random,
    private readonly tuning: SwarmTuning = DEFAULT_TUNING,
  ) {}

  get count(): number {
    return this.x.length;
  }

  get settled(): boolean {
    return this.phase === "settled";
  }

  get introducing(): boolean {
    return this.phase === "intro";
  }

  setTargets(
    { positions, shades, radius }: SwarmTargets,
    skyHeight: number,
  ): void {
    const previous = this.count;
    const count = shades.length;
    const keep = Math.min(previous, count);
    const resize = (source: Float32Array) => {
      const next = new Float32Array(count);
      next.set(source.subarray(0, keep));
      return next;
    };
    this.x = resize(this.x);
    this.y = resize(this.y);
    this.vx = resize(this.vx);
    this.vy = resize(this.vy);
    this.size = resize(this.size);
    this.swayPhase = resize(this.swayPhase);
    this.targetX = new Float32Array(count);
    this.targetY = new Float32Array(count);
    this.shade = Float32Array.from(shades);
    this.radius = radius;

    for (let i = 0; i < count; i++) {
      this.targetX[i] = positions[i * 2];
      this.targetY[i] = positions[i * 2 + 1];
    }
    this.bounds = this.computeBounds();

    for (let i = keep; i < count; i++) {
      this.size[i] = 0.75 + this.random() * 0.45;
      this.swayPhase[i] = this.random() * Math.PI * 2;
    }

    if (previous === 0) {
      this.beginIntro(skyHeight);
    } else {
      for (let i = keep; i < count; i++) {
        this.x[i] = this.targetX[i] + (this.random() - 0.5) * 60;
        this.y[i] = -this.random() * 120 - 10;
      }
      this.phase = "physics";
    }
  }

  step(dtMs: number, pointer: Point | null): void {
    this.clock += dtMs;
    const frames = dtMs / FRAME_MS;
    if (this.phase === "intro") {
      this.stepIntro(dtMs);
      return;
    }
    if (this.phase === "settled") {
      if (!pointer || !isNear(pointer, this.bounds, this.tuning.hoverRadius))
        return;
      this.phase = "physics";
    }
    if (this.phase === "physics") this.stepPhysics(frames, pointer);
  }

  burst(point: Point): boolean {
    if (this.phase === "idle" || this.phase === "intro") return false;
    const { burstRadius, burstForce } = this.tuning;
    let hit = false;
    for (let i = 0; i < this.count; i++) {
      const dx = this.x[i] - point.x;
      const dy = this.y[i] - point.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (distance > burstRadius) continue;
      const force = (1 - distance / burstRadius) * burstForce;
      this.vx[i] =
        this.vx[i] + (dx / distance) * force + (this.random() - 0.5) * 2;
      this.vy[i] = this.vy[i] + (dy / distance) * force - this.random() * 2;
      hit = true;
    }
    if (hit) this.phase = "physics";
    return hit;
  }

  private beginIntro(skyHeight: number): void {
    const { introDrift, introStagger, introSweep } = this.tuning;
    const width = Math.max(1, this.bounds.right - this.bounds.left);
    this.startX = new Float32Array(this.count);
    this.startY = new Float32Array(this.count);
    this.delay = new Float32Array(this.count);
    for (let i = 0; i < this.count; i++) {
      const targetX = this.targetX[i];
      this.startX[i] = targetX + (this.random() - 0.5) * introDrift;
      this.startY[i] = -this.random() * skyHeight * 0.7 - 20;
      this.x[i] = this.startX[i];
      this.y[i] = this.startY[i];
      const across = (targetX - this.bounds.left) / width;
      this.delay[i] = this.random() * introStagger + across * introSweep;
    }
    this.introElapsed = 0;
    this.phase = "intro";
  }

  private stepIntro(dtMs: number): void {
    this.introElapsed += dtMs;
    let finished = true;
    for (let i = 0; i < this.count; i++) {
      const t = clamp(
        (this.introElapsed - this.delay[i]) / this.tuning.introDuration,
        0,
        1,
      );
      if (t < 1) finished = false;
      const eased = easeOutCubic(t);
      const sway =
        Math.sin(this.clock / 420 + this.swayPhase[i]) * 10 * (1 - eased);
      const startX = this.startX[i];
      const startY = this.startY[i];
      this.x[i] = startX + (this.targetX[i] - startX) * eased + sway;
      this.y[i] = startY + (this.targetY[i] - startY) * eased;
    }
    if (finished) {
      this.vx.fill(0);
      this.vy.fill(0);
      this.phase = "physics";
    }
  }

  private stepPhysics(frames: number, pointer: Point | null): void {
    const { spring, hoverRadius, hoverForce, settleDistance, settleSpeed } =
      this.tuning;
    const damping = this.tuning.damping ** frames;
    const hoverRadiusSquared = hoverRadius * hoverRadius;
    let active = false;

    for (let i = 0; i < this.count; i++) {
      const x = this.x[i];
      const y = this.y[i];
      const targetX = this.targetX[i];
      const targetY = this.targetY[i];
      let ax = (targetX - x) * spring;
      let ay = (targetY - y) * spring;

      if (pointer) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < hoverRadiusSquared && distanceSquared > 0.01) {
          const distance = Math.sqrt(distanceSquared);
          const push = (1 - distance / hoverRadius) * hoverForce;
          ax += (dx / distance) * push;
          ay += (dy / distance) * push;
          active = true;
        }
      }

      const vx = (this.vx[i] + ax * frames) * damping;
      const vy = (this.vy[i] + ay * frames) * damping;
      this.vx[i] = vx;
      this.vy[i] = vy;
      this.x[i] = x + vx * frames;
      this.y[i] = y + vy * frames;

      active ||=
        Math.abs(vx) > settleSpeed ||
        Math.abs(vy) > settleSpeed ||
        Math.abs(targetX - x) > settleDistance ||
        Math.abs(targetY - y) > settleDistance;
    }

    if (!active) {
      this.x.set(this.targetX);
      this.y.set(this.targetY);
      this.vx.fill(0);
      this.vy.fill(0);
      this.phase = "settled";
    }
  }

  private computeBounds(): Bounds {
    if (this.count === 0) return { left: 0, top: 0, right: 0, bottom: 0 };
    return {
      left: Math.min(...this.targetX) - this.radius,
      top: Math.min(...this.targetY) - this.radius,
      right: Math.max(...this.targetX) + this.radius,
      bottom: Math.max(...this.targetY) + this.radius,
    };
  }
}
