import type { Flurry } from "./flurry";
import type { Bounds } from "./math";
import { MAX_PARTICLE_SCALE, type SnowPalette, shadeBucket } from "./palette";
import type { LetterSwarm } from "./swarm";

export interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

export class SnowRenderer {
  private readonly context: CanvasRenderingContext2D;
  private size: CanvasSize = { width: 0, height: 0, dpr: 1 };
  private palette: SnowPalette | null = null;
  private settledLayer: OffscreenCanvas | null = null;
  private settledBounds: Bounds | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas is unavailable");
    this.context = context;
  }

  resize(size: CanvasSize): void {
    this.size = size;
    this.canvas.width = Math.round(size.width * size.dpr);
    this.canvas.height = Math.round(size.height * size.dpr);
    this.settledBounds = null;
  }

  setPalette(palette: SnowPalette): void {
    this.palette = palette;
    this.settledBounds = null;
  }

  render(swarm: LetterSwarm, flurry: Flurry): void {
    const { palette, context } = this;
    if (!palette) return;
    const { width, height, dpr } = this.size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    if (swarm.settled) {
      this.drawSettledLetters(swarm, palette);
    } else {
      this.settledBounds = null;
      drawLetters(context, swarm, palette);
    }

    for (let i = 0; i < flurry.count; i++) {
      const radius = flurry.radius[i];
      context.drawImage(
        palette.flake,
        flurry.x[i] - radius,
        flurry.y[i] - radius,
        radius * 2,
        radius * 2,
      );
    }
  }

  private drawSettledLetters(swarm: LetterSwarm, palette: SnowPalette): void {
    if (!this.settledBounds || !this.settledLayer) {
      this.paintSettledLayer(swarm, palette);
    }
    const bounds = this.settledBounds;
    if (!bounds || !this.settledLayer) return;
    this.context.drawImage(
      this.settledLayer,
      bounds.left,
      bounds.top,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top,
    );
  }

  private paintSettledLayer(swarm: LetterSwarm, palette: SnowPalette): void {
    const pad = palette.letterRadius * MAX_PARTICLE_SCALE;
    const bounds: Bounds = {
      left: Math.floor(swarm.bounds.left - pad),
      top: Math.floor(swarm.bounds.top - pad),
      right: Math.ceil(swarm.bounds.right + pad),
      bottom: Math.ceil(swarm.bounds.bottom + pad),
    };
    const { dpr } = this.size;
    const width = Math.ceil((bounds.right - bounds.left) * dpr);
    const height = Math.ceil((bounds.bottom - bounds.top) * dpr);
    if (
      this.settledLayer?.width !== width ||
      this.settledLayer.height !== height
    ) {
      this.settledLayer = new OffscreenCanvas(width, height);
    }
    const context = this.settledLayer.getContext("2d");
    if (!context) throw new Error("2D canvas is unavailable");
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    context.setTransform(dpr, 0, 0, dpr, -bounds.left * dpr, -bounds.top * dpr);
    drawLetters(context, swarm, palette);
    this.settledBounds = bounds;
  }
}

function drawLetters(
  context: Context2D,
  swarm: LetterSwarm,
  palette: SnowPalette,
): void {
  for (let i = 0; i < swarm.count; i++) {
    const radius = palette.letterRadius * swarm.size[i];
    const y = swarm.y[i];
    if (y < -radius) continue;
    const sprite = palette.letters[shadeBucket(swarm.shade[i])];
    if (!sprite) continue;
    context.drawImage(
      sprite,
      swarm.x[i] - radius,
      y - radius,
      radius * 2,
      radius * 2,
    );
  }
}
