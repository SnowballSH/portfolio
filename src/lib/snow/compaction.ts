import { clamp, smoothstep } from "./math";

export interface CompactionLook {
  layerAlpha: number;
  flakeAlpha: number;
  flakeScale: number;
}

const LAYER_FADE_END = 0.65;
const FLAKE_FADE_START = 0.35;
const FLAKE_GROWTH = 0.1;

export const compactionLook = (progress: number): CompactionLook => ({
  layerAlpha: smoothstep(0, LAYER_FADE_END, progress),
  flakeAlpha: 1 - smoothstep(FLAKE_FADE_START, 1, progress),
  flakeScale: 1 + FLAKE_GROWTH * smoothstep(0, 1, progress),
});

export class Compaction {
  value = 0;

  constructor(
    private readonly formMs = 1400,
    private readonly breakMs = 200,
  ) {}

  get complete(): boolean {
    return this.value === 1;
  }

  get look(): CompactionLook {
    return compactionLook(this.value);
  }

  step(dtMs: number, formed: boolean): void {
    const rate = formed ? 1 / this.formMs : -1 / this.breakMs;
    this.value = clamp(this.value + rate * dtMs, 0, 1);
  }
}
