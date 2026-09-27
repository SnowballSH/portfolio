export interface CanvasSize {
  width: number;
  height: number;
  dpr: number;
}

type Canvas = HTMLCanvasElement | OffscreenCanvas;
type ContextFor<C extends Canvas> = C extends HTMLCanvasElement
  ? CanvasRenderingContext2D
  : OffscreenCanvasRenderingContext2D;

export const MAX_DPR = 2;

export const devicePixelRatio = (): number =>
  Math.min(window.devicePixelRatio || 1, MAX_DPR);

export function context2d<C extends Canvas>(
  canvas: C,
  options?: CanvasRenderingContext2DSettings,
): ContextFor<C> {
  const context = canvas.getContext("2d", options) as ContextFor<C> | null;
  if (!context) throw new Error("2D canvas is unavailable");
  return context;
}

export function fitCanvas(canvas: Canvas, { width, height, dpr }: CanvasSize) {
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
}

export function watchPixelRatio(signal: AbortSignal, onChange: () => void) {
  matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener(
    "change",
    () => {
      onChange();
      watchPixelRatio(signal, onChange);
    },
    { once: true, signal },
  );
}
