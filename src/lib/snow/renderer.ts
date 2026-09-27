import type { Flurry } from "./flurry";
import { type SnowPalette, shadeBucket } from "./palette";
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
  private settledLetters: OffscreenCanvas | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas is unavailable");
    this.context = context;
  }

  resize(size: CanvasSize): void {
    this.size = size;
    this.canvas.width = Math.round(size.width * size.dpr);
    this.canvas.height = Math.round(size.height * size.dpr);
    this.settledLetters = null;
  }

  setPalette(palette: SnowPalette): void {
    this.palette = palette;
    this.settledLetters = null;
  }

  render(swarm: LetterSwarm, flurry: Flurry): void {
    const { palette, context } = this;
    if (!palette) return;
    const { width, height, dpr } = this.size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    if (swarm.settled) {
      this.settledLetters ??= this.paintSettledLetters(swarm, palette);
      context.drawImage(this.settledLetters, 0, 0, width, height);
    } else {
      this.settledLetters = null;
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

  private paintSettledLetters(
    swarm: LetterSwarm,
    palette: SnowPalette,
  ): OffscreenCanvas {
    const layer = new OffscreenCanvas(this.canvas.width, this.canvas.height);
    const context = layer.getContext("2d");
    if (!context) throw new Error("2D canvas is unavailable");
    context.setTransform(this.size.dpr, 0, 0, this.size.dpr, 0, 0);
    drawLetters(context, swarm, palette);
    return layer;
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
