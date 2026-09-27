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

export class Compaction {
  value = 0;
  private forming = true;

  constructor(
    private readonly formMs = 1400,
    private readonly breakMs = 200,
  ) {}

  get complete(): boolean {
    return this.value === 1;
  }

  look(): CompactionLook {
    return this.forming ? formingLook(this.value) : breakingLook(this.value);
  }

  step(dtMs: number, formed: boolean): void {
    this.forming = formed;
    const rate = formed ? 1 / this.formMs : -1 / this.breakMs;
    this.value = clamp(this.value + rate * dtMs, 0, 1);
  }
}
