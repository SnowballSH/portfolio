import { type CanvasSize, context2d, fitCanvas } from "./canvas";
import type { Box } from "./math";
import { type LetterSprites, MAX_PARTICLE_SCALE, shadeBucket } from "./palette";
import type { LetterSwarm } from "./swarm";
import type { WordmarkLayer } from "./wordmark";

export interface WordmarkArt {
  letters: LetterSprites;
  layer: WordmarkLayer;
}

type Context2D = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;

const SOLID_GROWTH = 0.3;

export class WordmarkRenderer {
  private readonly context: CanvasRenderingContext2D;
  private size: CanvasSize = { width: 0, height: 0, dpr: 1 };
  private art: WordmarkArt | null = null;
  private solidCache: { image: OffscreenCanvas; box: Box } | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = context2d(canvas);
  }

  resize(size: CanvasSize): void {
    this.size = size;
    fitCanvas(this.canvas, size);
    this.solidCache = null;
  }

  setArt(art: WordmarkArt): void {
    this.art = art;
    this.solidCache = null;
  }

  render(swarm: LetterSwarm, solidity: number): void {
    const { art, context } = this;
    if (!art) return;
    const { width, height, dpr } = this.size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    if (swarm.settled && solidity === 1) {
      this.solidCache ??= this.paintSolidCache(swarm, art);
      const { image, box } = this.solidCache;
      context.drawImage(image, box.left, box.top, box.width, box.height);
      return;
    }
    this.solidCache = null;
    drawScene(context, swarm, art, solidity);
  }

  private paintSolidCache(
    swarm: LetterSwarm,
    art: WordmarkArt,
  ): { image: OffscreenCanvas; box: Box } {
    const pad = art.letters.radius * MAX_PARTICLE_SCALE;
    const box: Box = {
      left: Math.floor(art.layer.box.left - pad),
      top: Math.floor(art.layer.box.top - pad),
      width: Math.ceil(art.layer.box.width + pad * 2),
      height: Math.ceil(art.layer.box.height + pad * 2),
    };
    const { dpr } = this.size;
    const image = new OffscreenCanvas(
      Math.ceil(box.width * dpr),
      Math.ceil(box.height * dpr),
    );
    const context = context2d(image);
    context.setTransform(dpr, 0, 0, dpr, -box.left * dpr, -box.top * dpr);
    drawScene(context, swarm, art, 1);
    return { image, box };
  }
}

function drawScene(
  context: Context2D,
  swarm: LetterSwarm,
  { letters, layer }: WordmarkArt,
  solidity: number,
): void {
  if (solidity > 0) {
    context.globalAlpha = solidity;
    const { box } = layer;
    context.drawImage(layer.image, box.left, box.top, box.width, box.height);
    context.globalAlpha = 1;
  }
  const growth = 1 + SOLID_GROWTH * solidity;
  for (let i = 0; i < swarm.count; i++) {
    const radius = letters.radius * swarm.size[i] * growth;
    const y = swarm.y[i];
    if (y < -radius) continue;
    const sprite = letters.sprites[shadeBucket(swarm.shade[i])];
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
