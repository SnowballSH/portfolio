import { clamp, smoothstep } from "./math";

export interface CompactionLook {
  layerAlpha: number;
  flakeAlpha: number;
  flakeScale: number;
}

const LAYER_FADE_END = 0.65;
const FLAKE_FADE_START = 0.35;
export const FLAKE_GROWTH = 0.1;

export const formingLook = (progress: number): CompactionLook => ({
  layerAlpha: smoothstep(0, LAYER_FADE_END, progress),
  flakeAlpha: 1 - smoothstep(FLAKE_FADE_START, 1, progress),
  flakeScale: 1 + FLAKE_GROWTH * smoothstep(0, 1, progress),
});

export const breakingLook = (progress: number): CompactionLook => ({
  layerAlpha: smoothstep(0, 1, progress),
  flakeAlpha: 1,
  flakeScale: 1 + FLAKE_GROWTH * progress,
});

type LookCurve = (progress: number) => CompactionLook;

interface Handoff {
  from: CompactionLook;
  fromValue: number;
}

const mixLook = (
  from: CompactionLook,
  to: CompactionLook,
  t: number,
): CompactionLook => ({
  layerAlpha: from.layerAlpha + (to.layerAlpha - from.layerAlpha) * t,
  flakeAlpha: from.flakeAlpha + (to.flakeAlpha - from.flakeAlpha) * t,
  flakeScale: from.flakeScale + (to.flakeScale - from.flakeScale) * t,
});

export class Compaction {
  value = 0;
  private forming = true;
  private breakCurve: LookCurve = breakingLook;
  private handoff: Handoff | null = null;

  constructor(
    private readonly formMs = 1400,
    private readonly breakMs = 200,
  ) {}

  get complete(): boolean {
    return this.value === 1;
  }

  look(): CompactionLook {
    const target = (this.forming ? formingLook : this.breakCurve)(this.value);
    if (!this.handoff) return target;
    const { from, fromValue } = this.handoff;
    const span = this.forming ? 1 - fromValue : fromValue;
    const travelled = Math.abs(this.value - fromValue);
    return mixLook(from, target, smoothstep(0, span, travelled));
  }

  step(dtMs: number, formed: boolean): void {
    if (formed !== this.forming) this.turn(formed);
    const rate = formed ? 1 / this.formMs : -1 / this.breakMs;
    this.value = clamp(this.value + rate * dtMs, 0, 1);
    if (this.value === 0 || this.value === 1) this.handoff = null;
  }

  private turn(formed: boolean): void {
    const current = this.look();
    this.forming = formed;
    if (!formed) this.breakCurve = this.complete ? breakingLook : formingLook;
    const atRest = this.value === 0 || this.value === 1;
    this.handoff = atRest ? null : { from: current, fromValue: this.value };
  }
}
