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
const IDLE_FRAME_MS = 1000 / 30;
const LAYOUT_DEBOUNCE_MS = 150;
const READY_CLASS = "snow-ready";

type LayoutResult = "ready" | "empty" | "unreadable";

export class SnowHero {
  private readonly swarm: LetterSwarm;
  private readonly flurry: Flurry;
  private readonly renderer: SnowRenderer;
  private readonly lifecycle = new AbortController();
  private readonly observers: { disconnect(): void }[] = [];
  private pointer: Point | null = null;
  private visible = true;
  private frameRequest = 0;
  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  private layoutTimer: ReturnType<typeof setTimeout> | undefined;
  private lastFrame = 0;
  private layoutKey = "";
  private dpr = 1;
  private laidOut = false;
  private drawn = false;

  constructor(
    private readonly elements: HeroElements,
    private readonly random: Random = Math.random,
  ) {
    this.swarm = new LetterSwarm(random);
    this.flurry = new Flurry(random);
    this.renderer = new SnowRenderer(elements.canvas);
  }

  start(): boolean {
    this.bindEvents();
    return this.applyLayout();
  }

  destroy(): void {
    this.lifecycle.abort();
    for (const observer of this.observers) observer.disconnect();
    cancelAnimationFrame(this.frameRequest);
    clearTimeout(this.idleTimer);
    clearTimeout(this.layoutTimer);
    this.frameRequest = 0;
    this.elements.heading.classList.remove(READY_CLASS);
  }

  private currentLayoutKey(): string {
    const { height } = this.elements.section.getBoundingClientRect();
    const width = document.documentElement.clientWidth;
    return `${width}x${height}@${window.devicePixelRatio}`;
  }

  private applyLayout(): boolean {
    const result = this.layout();
    if (result === "unreadable") {
      this.destroy();
      return false;
    }
    this.laidOut = result === "ready";
    this.resume();
    return true;
  }

  private layout(): LayoutResult {
    const { section, canvas, heading, word } = this.elements;
    const viewportWidth = document.documentElement.clientWidth;
    const sectionRect = section.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    const style = getComputedStyle(heading);
    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    this.layoutKey = this.currentLayoutKey();
    if (wordRect.width === 0 || sectionRect.height === 0) return "empty";

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
    if (!targets) return "unreadable";

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
    this.swarm.setTargets(targets, sectionRect.height);
    this.flurry.resize(viewportWidth, sectionRect.height);
    this.refreshPalette();
    return "ready";
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

  private scheduleLayout = (): void => {
    clearTimeout(this.layoutTimer);
    this.layoutTimer = setTimeout(() => {
      if (this.laidOut && this.currentLayoutKey() === this.layoutKey) return;
      this.guard(() => this.applyLayout());
    }, LAYOUT_DEBOUNCE_MS);
  };

  private watchPixelRatio(): void {
    matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener(
      "change",
      () => {
        this.scheduleLayout();
        this.watchPixelRatio();
      },
      { once: true, signal: this.lifecycle.signal },
    );
  }

  private bindEvents(): void {
    const { section, canvas } = this.elements;
    const { signal } = this.lifecycle;

    const intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry?.isIntersecting ?? false;
      this.resume();
    });
    intersection.observe(section);

    const resize = new ResizeObserver(this.scheduleLayout);
    resize.observe(section);

    const theme = new MutationObserver(() =>
      this.guard(() => this.refreshPalette()),
    );
    theme.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
    });

    this.observers.push(intersection, resize, theme);
    this.watchPixelRatio();

    window.addEventListener("resize", this.scheduleLayout, { signal });
    document.addEventListener("visibilitychange", () => this.resume(), {
      signal,
    });

    const toCanvasPoint = (event: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        this.pointer = toCanvasPoint(event);
        if (this.swarm.attracts(this.pointer)) this.resume();
      },
      { passive: true, signal },
    );
    document.documentElement.addEventListener(
      "pointerleave",
      () => {
        this.pointer = null;
      },
      { signal },
    );
    section.addEventListener(
      "click",
      (event) => {
        if (
          event.target instanceof Element &&
          event.target.closest("a, button")
        )
          return;
        if (this.swarm.burst(toCanvasPoint(event))) this.resume();
      },
      { signal },
    );
  }

  private resume(): void {
    if (this.frameRequest || !this.laidOut || this.lifecycle.signal.aborted)
      return;
    if (!this.visible || document.hidden) return;
    clearTimeout(this.idleTimer);
    this.idleTimer = undefined;
    this.lastFrame = performance.now();
    this.frameRequest = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    this.frameRequest = 0;
    if (!this.visible || document.hidden) return;
    const dt = Math.min(now - this.lastFrame, MAX_FRAME_MS);
    this.lastFrame = now;
    this.guard(() => {
      this.swarm.step(dt, this.pointer);
      this.flurry.step(dt);
      this.renderer.render(this.swarm, this.flurry);
    });
    if (this.lifecycle.signal.aborted) return;
    if (!this.drawn) {
      this.drawn = true;
      this.elements.heading.classList.add(READY_CLASS);
    }
    if (this.swarm.settled) {
      this.idleTimer = setTimeout(() => {
        this.idleTimer = undefined;
        this.frameRequest = requestAnimationFrame(this.frame);
      }, IDLE_FRAME_MS);
    } else {
      this.frameRequest = requestAnimationFrame(this.frame);
    }
  };

  private guard(action: () => void): void {
    try {
      action();
    } catch (error) {
      console.warn("[snow] falling back to the static wordmark:", error);
      this.destroy();
    }
  }
}

function findHeroElements(root: ParentNode): HeroElements | null {
  const section = root.querySelector<HTMLElement>("[data-snow-hero]");
  const canvas =
    section?.querySelector<HTMLCanvasElement>("[data-snow-canvas]");
  const heading = section?.querySelector<HTMLElement>("h1");
  const word = section?.querySelector<HTMLElement>("[data-snow-word]");
  return section && canvas && heading && word
    ? { section, canvas, heading, word }
    : null;
}

const supportsSnow = (): boolean =>
  typeof OffscreenCanvas !== "undefined" &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !matchMedia("(forced-colors: active)").matches;

export async function mountSnowHero(
  root: ParentNode = document,
): Promise<SnowHero | null> {
  const elements = findHeroElements(root);
  if (!elements || !supportsSnow()) return null;

  const style = getComputedStyle(elements.heading);
  await document.fonts
    .load(
      `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      elements.word.textContent ?? "",
    )
    .catch(() => []);

  try {
    const hero = new SnowHero(elements);
    if (!hero.start()) {
      hero.destroy();
      return null;
    }
    document.addEventListener("astro:before-swap", () => hero.destroy(), {
      once: true,
    });
    return hero;
  } catch (error) {
    console.warn("[snow] falling back to the static wordmark:", error);
    return null;
  }
}
