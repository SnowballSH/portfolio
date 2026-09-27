import { type CanvasSize, context2d, fitCanvas } from "./canvas";
import { type LetterSprites, shadeBucket } from "./palette";
import type { LetterSwarm } from "./swarm";
import type { WordmarkLayer } from "./wordmark";

export interface WordmarkArt {
  letters: LetterSprites;
  layer: WordmarkLayer;
}

const COMPACTION_GROWTH = 0.3;

export class WordmarkRenderer {
  private readonly context: CanvasRenderingContext2D;
  private size: CanvasSize = { width: 0, height: 0, dpr: 1 };
  private art: WordmarkArt | null = null;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = context2d(canvas);
  }

  resize(size: CanvasSize): void {
    this.size = size;
    fitCanvas(this.canvas, size);
  }

  clear(): void {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setArt(art: WordmarkArt): void {
    this.art = art;
  }

  render(swarm: LetterSwarm, solidity: number): void {
    const { art, context } = this;
    if (!art) return;
    const { width, height, dpr } = this.size;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    if (solidity > 0) this.drawLayer(art.layer, solidity);
    if (solidity < 1) this.drawFlakes(swarm, art.letters, solidity);
  }

  private drawLayer({ image, box }: WordmarkLayer, alpha: number): void {
    this.context.globalAlpha = alpha;
    this.context.drawImage(image, box.left, box.top, box.width, box.height);
    this.context.globalAlpha = 1;
  }

  private drawFlakes(
    swarm: LetterSwarm,
    letters: LetterSprites,
    solidity: number,
  ): void {
    const { context } = this;
    const growth = 1 + COMPACTION_GROWTH * solidity;
    context.globalAlpha = 1 - solidity;
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
    context.globalAlpha = 1;
  }
}
