import { clamp } from "./math";

export class Compaction {
  value = 0;

  constructor(
    private readonly formMs = 700,
    private readonly breakMs = 160,
  ) {}

  get complete(): boolean {
    return this.value === 1;
  }

  step(dtMs: number, formed: boolean): void {
    const rate = formed ? 1 / this.formMs : -1 / this.breakMs;
    this.value = clamp(this.value + rate * dtMs, 0, 1);
  }
}
