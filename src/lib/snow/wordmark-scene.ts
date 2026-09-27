import { devicePixelRatio, watchPixelRatio } from "./canvas";
import { wordmarkGradient } from "./color";
import { Compaction } from "./compaction";
import { type Cadence, FrameLoop } from "./frame-loop";
import type { Box, Point, Random } from "./math";
import { createLetterSprites, readThemeColors } from "./palette";
import { LetterSwarm } from "./swarm";
import {
  type WordmarkLayout,
  particleBudget,
  renderWordmarkLayer,
  sampleWordmark,
} from "./wordmark";
import { WordmarkRenderer } from "./wordmark-renderer";

export interface WordmarkElements {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  heading: HTMLElement;
  word: HTMLElement;
}

export const HEADING_CLASSES = {
  pending: "snow-pending",
  active: "snow-active",
  fallback: "snow-fallback",
} as const;

type LayoutResult = "ready" | "empty" | "unreadable";

const LAYOUT_DEBOUNCE_MS = 150;
const FIRST_FRAME_DEADLINE_MS = 4000;
const POINTER_REST_MS = 1000;

const relativeBox = (rect: DOMRect, originTop: number): Box => ({
  left: rect.left,
  top: rect.top - originTop,
  width: rect.width,
  height: rect.height,
});

export class SnowWordmark {
  private readonly swarm: LetterSwarm;
  private readonly compaction = new Compaction();
  private readonly renderer: WordmarkRenderer;
  private readonly loop: FrameLoop;
  private readonly lifecycle = new AbortController();
  private readonly observers: { disconnect(): void }[] = [];
  private layoutTimer: ReturnType<typeof setTimeout> | undefined;
  private watchdogTimer: ReturnType<typeof setTimeout> | undefined;
  private pointerRestTimer: ReturnType<typeof setTimeout> | undefined;
  private onScreen = true;
  private wordmarkLayout: WordmarkLayout | null = null;
  private pointer: Point | null = null;
  private pointerInWord = false;
  private layoutKey = "";
  private laidOut = false;
  private drawn = false;
  private dpr = 1;

  constructor(
    private readonly elements: WordmarkElements,
    private readonly random: Random = Math.random,
  ) {
    this.swarm = new LetterSwarm(random);
    this.renderer = new WordmarkRenderer(elements.canvas);
    this.loop = new FrameLoop(this.tick);
  }

  start(): boolean {
    this.bindEvents();
    this.armWatchdog();
    return this.applyLayout();
  }

  destroy(): void {
    this.lifecycle.abort();
    for (const observer of this.observers) observer.disconnect();
    this.loop.destroy();
    clearTimeout(this.layoutTimer);
    clearTimeout(this.watchdogTimer);
    clearTimeout(this.pointerRestTimer);
    this.renderer.clear();
    const { classList } = this.elements.heading;
    classList.remove(HEADING_CLASSES.pending, HEADING_CLASSES.active);
    classList.add(HEADING_CLASSES.fallback);
  }

  private readonly tick = (dtMs: number): Cadence => {
    if (!this.laidOut) return "sleep";
    const drew = this.guard(() => {
      this.swarm.step(dtMs, this.pointer);
      this.compaction.step(dtMs, this.swarm.settled);
      this.renderer.render(this.swarm, this.compaction.look);
    });
    if (!drew) return "sleep";
    if (!this.drawn) {
      this.drawn = true;
      this.elements.heading.classList.add(HEADING_CLASSES.active);
    }
    return this.swarm.settled && this.compaction.complete ? "sleep" : "active";
  };

  private armWatchdog(): void {
    this.watchdogTimer = setTimeout(() => {
      if (this.drawn) return;
      if (document.hidden || !this.onScreen) this.armWatchdog();
      else this.destroy();
    }, FIRST_FRAME_DEADLINE_MS);
  }

  private currentLayoutKey(): string {
    const { height } = this.elements.section.getBoundingClientRect();
    const { width: wordWidth } = this.elements.word.getBoundingClientRect();
    return [
      document.documentElement.clientWidth,
      height,
      wordWidth,
      window.devicePixelRatio,
    ].join(":");
  }

  private applyLayout(): boolean {
    const result = this.layout();
    if (result === "unreadable") {
      this.destroy();
      return false;
    }
    this.laidOut = result === "ready";
    this.loop.wake();
    return true;
  }

  private layout(): LayoutResult {
    const { section, canvas, heading, word } = this.elements;
    const viewportWidth = document.documentElement.clientWidth;
    const sectionRect = section.getBoundingClientRect();
    const wordRect = word.getBoundingClientRect();
    this.layoutKey = this.currentLayoutKey();
    if (wordRect.width === 0 || sectionRect.height === 0) return "empty";

    const style = getComputedStyle(heading);
    const layout: WordmarkLayout = {
      word: word.textContent ?? "",
      font: `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      letterSpacing: parseFloat(style.letterSpacing) || 0,
      box: relativeBox(wordRect, sectionRect.top),
      gradientBox: relativeBox(
        heading.getBoundingClientRect(),
        sectionRect.top,
      ),
    };
    const targets = sampleWordmark(
      layout,
      particleBudget(viewportWidth),
      this.random,
    );
    if (!targets) return "unreadable";

    this.dpr = devicePixelRatio();
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
    this.wordmarkLayout = layout;
    this.refreshArt();
    return "ready";
  }

  private refreshArt(): void {
    if (!this.wordmarkLayout) return;
    const theme = readThemeColors(document.documentElement);
    this.renderer.setArt({
      letters: createLetterSprites(theme, this.swarm.radius, this.dpr),
      layer: renderWordmarkLayer(
        this.wordmarkLayout,
        wordmarkGradient(theme.ink, theme.accent),
        this.dpr,
      ),
    });
    this.loop.wake();
  }

  private readonly scheduleLayout = (): void => {
    clearTimeout(this.layoutTimer);
    this.layoutTimer = setTimeout(() => {
      if (this.laidOut && this.currentLayoutKey() === this.layoutKey) return;
      this.guard(() => this.applyLayout());
    }, LAYOUT_DEBOUNCE_MS);
  };

  private bindEvents(): void {
    const { section, canvas } = this.elements;
    const { signal } = this.lifecycle;

    const intersection = new IntersectionObserver(([entry]) => {
      this.onScreen = entry?.isIntersecting ?? false;
      this.loop.setOnScreen(this.onScreen);
    });
    intersection.observe(section);
    const resize = new ResizeObserver(this.scheduleLayout);
    resize.observe(section);
    const theme = new MutationObserver(() =>
      this.guard(() => this.refreshArt()),
    );
    theme.observe(document.documentElement, {
      attributeFilter: ["data-theme"],
    });
    this.observers.push(intersection, resize, theme);

    watchPixelRatio(signal, this.scheduleLayout);
    window.addEventListener("resize", this.scheduleLayout, { signal });
    document.fonts.addEventListener("loadingdone", this.scheduleLayout, {
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
        const point = toCanvasPoint(event);
        const inWord = this.swarm.contains(point);
        if (inWord && !this.pointerInWord) this.swarm.scatter(point);
        this.pointerInWord = inWord;
        this.pointer = point;
        clearTimeout(this.pointerRestTimer);
        this.pointerRestTimer = setTimeout(() => {
          this.pointer = null;
        }, POINTER_REST_MS);
        if (this.swarm.attracts(point)) this.loop.wake();
      },
      { passive: true, signal },
    );
    document.documentElement.addEventListener(
      "pointerleave",
      () => {
        this.pointer = null;
        this.pointerInWord = false;
      },
      { signal },
    );
    section.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("a, button")) return;
        if (this.swarm.scatter(toCanvasPoint(event))) this.loop.wake();
      },
      { signal },
    );
  }

  private guard(action: () => void): boolean {
    try {
      action();
      return true;
    } catch (error) {
      console.warn("[snow] falling back to the static wordmark:", error);
      this.destroy();
      return false;
    }
  }
}
