import { SnowBackdrop } from "./backdrop";
import {
  HEADING_CLASSES,
  SnowWordmark,
  type WordmarkElements,
} from "./wordmark-scene";

const FONT_TIMEOUT_MS = 3000;

interface Scene {
  destroy(): void;
}

export const supportsSnow = (): boolean =>
  typeof OffscreenCanvas !== "undefined" &&
  matchMedia("(scripting: enabled)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !matchMedia("(forced-colors: active)").matches;

function findWordmarkElements(root: ParentNode): WordmarkElements | null {
  const section = root.querySelector<HTMLElement>("[data-snow-hero]");
  const canvas =
    section?.querySelector<HTMLCanvasElement>("[data-snow-canvas]");
  const heading = section?.querySelector<HTMLElement>("h1");
  const word = section?.querySelector<HTMLElement>("[data-snow-word]");
  return section && canvas && heading && word
    ? { section, canvas, heading, word }
    : null;
}

async function waitForFont(elements: WordmarkElements): Promise<void> {
  const style = getComputedStyle(elements.heading);
  const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  await Promise.race([
    document.fonts.load(font, elements.word.textContent ?? "").catch(() => []),
    new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS)),
  ]);
}

function claimHeading(heading: HTMLElement): boolean {
  const revealed = Number(getComputedStyle(heading).opacity) > 0;
  heading.classList.add(
    revealed ? HEADING_CLASSES.fallback : HEADING_CLASSES.pending,
  );
  return !revealed;
}

function attempt<T extends Scene>(create: () => T | null): T | null {
  try {
    return create();
  } catch (error) {
    console.warn("[snow] skipped:", error);
    return null;
  }
}

export async function mountSnow(root: ParentNode = document): Promise<void> {
  const wordmark = findWordmarkElements(root);
  const backdropCanvas = root.querySelector<HTMLCanvasElement>(
    "[data-snow-backdrop]",
  );
  if (!supportsSnow()) {
    wordmark?.heading.classList.add(HEADING_CLASSES.fallback);
    return;
  }
  const claimedWordmark = wordmark && claimHeading(wordmark.heading);

  const scenes: Scene[] = [];
  const backdrop =
    backdropCanvas &&
    attempt(() => {
      const scene = new SnowBackdrop(backdropCanvas);
      scene.start();
      return scene;
    });
  if (backdrop) scenes.push(backdrop);

  if (wordmark && claimedWordmark) {
    await waitForFont(wordmark);
    const scene = attempt(() => {
      const candidate = new SnowWordmark(wordmark);
      return candidate.start() ? candidate : null;
    });
    if (scene) scenes.push(scene);
    else wordmark.heading.classList.add(HEADING_CLASSES.fallback);
  }

  document.addEventListener(
    "astro:before-swap",
    () => {
      for (const scene of scenes) scene.destroy();
    },
    { once: true },
  );
}
