import { Flurry } from "./flurry";
import type { Point, Random } from "./math";
import { createPalette, readThemeColors } from "./palette";
import { SnowRenderer } from "./renderer";
import { LetterSwarm } from "./swarm";
import { particleBudget, sampleWordmark } from "./wordmark";

export interface HeroElements {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  heading: HTMLElement;
  word: HTMLElement;
}

const MAX_DPR = 2;
const MAX_FRAME_MS = 50;
const RESIZE_DEBOUNCE_MS = 150;

export class SnowHero {
  private readonly swarm: LetterSwarm;
  private readonly flurry: Flurry;
  private readonly renderer: SnowRenderer;
  private pointer: Point | null = null;
  private visible = true;
  private frameRequest = 0;
  private lastFrame = 0;
  private dpr = 1;

  constructor(
    private readonly elements: HeroElements,
    private readonly random: Random = Math.random,
  ) {
    this.swarm = new LetterSwarm(random);
    this.flurry = new Flurry(random);
    this.renderer = new SnowRenderer(elements.canvas);
  }

  start(): void {
    this.layout();
    this.bindEvents();
    this.resume();
  }

  private layout(): void {
    const { section, canvas, heading, word } = this.elements;
    const viewportWidth = document.documentElement.clientWidth;
    const sectionRect = section.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    const style = getComputedStyle(heading);
    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    Object.assign(canvas.style, {
      left: `${-sectionRect.left}px`,
      width: `${viewportWidth}px`,
      height: `${sectionRect.height}px`,
    });
    this.renderer.resize({
      width: viewportWidth,
      height: sectionRect.height,
      dpr: this.dpr,
    });

    const targets = sampleWordmark(
      {
        word: word.textContent ?? "",
        font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        letterSpacing: parseFloat(style.letterSpacing) || 0,
        box: {
          left: wordRect.left,
          top: wordRect.top - sectionRect.top,
          width: wordRect.width,
          height: wordRect.height,
        },
      },
      particleBudget(viewportWidth),
      this.random,
    );
    this.swarm.setTargets(targets, sectionRect.height);
    this.flurry.resize(viewportWidth, sectionRect.height);
    this.refreshPalette();
  }

  private refreshPalette(): void {
    this.renderer.setPalette(
      createPalette(
        readThemeColors(document.documentElement),
        this.swarm.radius,
        this.dpr,
      ),
    );
  }

  private bindEvents(): void {
    const { section, canvas } = this.elements;

    new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? false;
      this.resume();
    }).observe(section);

    document.addEventListener("visibilitychange", () => this.resume());

    new MutationObserver(() => this.refreshPalette()).observe(
      document.documentElement,
      { attributeFilter: ["data-theme"] },
    );

    let laidOutWidth = document.documentElement.clientWidth;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const width = document.documentElement.clientWidth;
        if (width === laidOutWidth) return;
        laidOutWidth = width;
        this.layout();
      }, RESIZE_DEBOUNCE_MS);
    });

    const toCanvasPoint = (event: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType === "mouse") this.pointer = toCanvasPoint(event);
      },
      { passive: true },
    );
    document.documentElement.addEventListener("pointerleave", () => {
      this.pointer = null;
    });
    section.addEventListener(
      "pointerdown",
      (event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a, button")
        )
          return;
        this.swarm.burst(toCanvasPoint(event));
      },
      { passive: true },
    );
  }

  private resume(): void {
    if (this.frameRequest || !this.visible || document.hidden) return;
    this.lastFrame = performance.now();
    this.frameRequest = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    this.frameRequest = 0;
    if (!this.visible || document.hidden) return;
    const dt = Math.min(now - this.lastFrame, MAX_FRAME_MS);
    this.lastFrame = now;
    this.swarm.step(dt, this.pointer);
    this.flurry.step(dt);
    this.renderer.render(this.swarm, this.flurry);
    this.elements.heading.classList.add("snow-ready");
    this.frameRequest = requestAnimationFrame(this.frame);
  };
}

export async function mountSnowHero(
  root: ParentNode = document,
): Promise<void> {
  const section = root.querySelector<HTMLElement>("[data-snow-hero]");
  const canvas =
    section?.querySelector<HTMLCanvasElement>("[data-snow-canvas]");
  const heading = section?.querySelector<HTMLElement>("h1");
  const word = section?.querySelector<HTMLElement>("[data-snow-word]");
  if (!section || !canvas || !heading || !word) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof OffscreenCanvas === "undefined") return;

  const style = getComputedStyle(heading);
  await document.fonts
    .load(
      `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      word.textContent ?? "",
    )
    .catch(() => []);
  new SnowHero({ section, canvas, heading, word }).start();
}
