import type { Bounds, DrawOptions, SlideLike, SlideText } from "../types";

export interface RecordedShape {
  kind: "shape";
  shapeType: unknown;
  options: DrawOptions;
}

export interface RecordedText {
  kind: "text";
  text: SlideText;
  options: DrawOptions;
}

export interface RecordedImage {
  kind: "image";
  options: Record<string, unknown>;
}

export type RecordedEntry = RecordedShape | RecordedText | RecordedImage;

export class RecordingSlide implements SlideLike {
  background?: Record<string, unknown>;
  readonly shapes: RecordedShape[] = [];
  readonly texts: RecordedText[] = [];
  readonly images: RecordedImage[] = [];

  addShape(shapeType: unknown, options: DrawOptions): RecordedShape {
    const entry: RecordedShape = {
      kind: "shape",
      shapeType,
      options: { ...options },
    };
    this.shapes.push(entry);
    return entry;
  }

  addText(text: SlideText, options: DrawOptions = {}): RecordedText {
    const entry: RecordedText = {
      kind: "text",
      text,
      options: { ...options },
    };
    this.texts.push(entry);
    return entry;
  }

  addImage(options: Record<string, unknown>): RecordedImage {
    const entry: RecordedImage = {
      kind: "image",
      options: { ...options },
    };
    this.images.push(entry);
    return entry;
  }

  getEntries(): RecordedEntry[] {
    return [...this.shapes, ...this.texts, ...this.images];
  }
}

export function getEntryBounds(entry: { options: Record<string, unknown> }): Bounds {
  const rawX = Number(entry.options.x ?? 0);
  const rawY = Number(entry.options.y ?? 0);
  const rawW = Number(entry.options.w ?? 0);
  const rawH = Number(entry.options.h ?? 0);

  return {
    x: Math.min(rawX, rawX + rawW),
    y: Math.min(rawY, rawY + rawH),
    w: Math.abs(rawW),
    h: Math.abs(rawH),
  };
}

export function isBoxWithin(inner: Bounds, outer: Bounds, tolerance = 0.001): boolean {
  return (
    inner.x >= outer.x - tolerance &&
    inner.y >= outer.y - tolerance &&
    inner.x + inner.w <= outer.x + outer.w + tolerance &&
    inner.y + inner.h <= outer.y + outer.h + tolerance
  );
}

export function boxesIntersect(a: Bounds, b: Bounds, tolerance = 0.001): boolean {
  return !(
    a.x + a.w <= b.x + tolerance ||
    b.x + b.w <= a.x + tolerance ||
    a.y + a.h <= b.y + tolerance ||
    b.y + b.h <= a.y + tolerance
  );
}
