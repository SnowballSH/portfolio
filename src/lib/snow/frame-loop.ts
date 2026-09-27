export type Cadence = "active" | "idle" | "sleep";

const MAX_FRAME_MS = 50;
const FRAME_TOLERANCE_MS = 2;

export class FrameLoop {
  private request = 0;
  private last = 0;
  private cadence: Cadence = "active";
  private onScreen = true;
  private readonly lifecycle = new AbortController();

  constructor(
    private readonly tick: (dtMs: number) => Cadence,
    private readonly idleIntervalMs = 1000 / 30,
  ) {
    document.addEventListener("visibilitychange", () => this.wake(), {
      signal: this.lifecycle.signal,
    });
  }

  setOnScreen(onScreen: boolean): void {
    this.onScreen = onScreen;
    this.wake();
  }

  wake(): void {
    this.cadence = "active";
    if (this.request || !this.canRun()) return;
    this.last = performance.now();
    this.request = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    this.lifecycle.abort();
    cancelAnimationFrame(this.request);
    this.request = 0;
  }

  private canRun(): boolean {
    return this.onScreen && !document.hidden && !this.lifecycle.signal.aborted;
  }

  private readonly frame = (now: number): void => {
    this.request = 0;
    if (!this.canRun()) return;
    const elapsed = now - this.last;
    if (
      this.cadence === "idle" &&
      elapsed < this.idleIntervalMs - FRAME_TOLERANCE_MS
    ) {
      this.request = requestAnimationFrame(this.frame);
      return;
    }
    this.last = now;
    this.cadence = this.tick(Math.min(elapsed, MAX_FRAME_MS));
    if (this.cadence !== "sleep" && this.canRun()) {
      this.request = requestAnimationFrame(this.frame);
    }
  };
}
