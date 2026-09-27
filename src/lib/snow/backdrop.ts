import {
  type CanvasSize,
  context2d,
  devicePixelRatio,
  fitCanvas,
  watchPixelRatio,
} from "./canvas";
import { type Cadence, FrameLoop } from "./frame-loop";
import { Flurry } from "./flurry";
import type { Random } from "./math";
import { createFlakeSprite, readThemeColors } from "./palette";

const RESIZE_DEBOUNCE_MS = 100;
const IDLE_FPS = { fine: 30, coarse: 24 } as const;

export class SnowBackdrop {
  private readonly flurry: Flurry;
  private readonly context: CanvasRenderingContext2D;
  private readonly loop: FrameLoop;
  private readonly lifecycle = new AbortController();
  private readonly observers: { disconnect(): void }[] = [];
  private size: CanvasSize = { width: 0, height: 0, dpr: 1 };
  private sprite: OffscreenCanvas | null = null;
  private resizeTimer: ReturnType<typeof setTimeout> | undefined;
  private scrollTop = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    random: Random = Math.random,
  ) {
    this.flurry = new Flurry(random);
    this.context = context2d(canvas);
    const pointer = matchMedia("(pointer: coarse)").matches ? "coarse" : "fine";
    this.loop = new FrameLoop(this.tick, 1000 / IDLE_FPS[pointer]);
  }

  start(): void {
    this.layout();
    this.bindEvents();
    this.loop.wake();
  }

  destroy(): void {
    this.lifecycle.abort();
    for (const observer of this.observers) observer.disconnect();
    this.loop.destroy();
    clearTimeout(this.resizeTimer);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private readonly tick = (dtMs: number): Cadence => {
    this.flurry.step(dtMs);
    this.render();
    return "idle";
  };

  private layout(): void {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.size = { width, height, dpr: devicePixelRatio() };
    fitCanvas(this.canvas, this.size);
    this.flurry.resize(width, height);
    this.refreshSprite();
    this.render();
  }

  private refreshSprite(): void {
    this.sprite = createFlakeSprite(
      readThemeColors(document.documentElement),
      this.size.dpr,
    );
  }

  private render(): void {
    const { context, sprite, flurry } = this;
    const { width, height, dpr } = this.size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    if (!sprite) return;
    for (let i = 0; i < flurry.count; i++) {
      const radius = flurry.radius[i];
      context.drawImage(
        sprite,
        flurry.x[i] - radius,
        flurry.y[i] - radius,
        radius * 2,
        radius * 2,
      );
    }
  }

  private readonly scheduleLayout = (): void => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => this.layout(), RESIZE_DEBOUNCE_MS);
  };

  private bindEvents(): void {
    const { signal } = this.lifecycle;
    const resize = new ResizeObserver(this.scheduleLayout);
    resize.observe(this.canvas);
    const theme = new MutationObserver(() => this.refreshSprite());
    theme.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
    });
    this.observers.push(resize, theme);
    watchPixelRatio(signal, this.scheduleLayout);

    this.scrollTop = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        this.flurry.drift(window.scrollY - this.scrollTop);
        this.scrollTop = window.scrollY;
      },
      { passive: true, signal },
    );
  }
}
