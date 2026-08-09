export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DrawOptions extends Partial<Bounds> {
  [key: string]: unknown;
}

export interface TextRunOptions {
  [key: string]: unknown;
}

export interface TextRun {
  text: string;
  options?: TextRunOptions;
}

export type SlideText = string | number | boolean | TextRun[];

export interface SlideLike {
  background?: Record<string, unknown>;
  addShape(shapeType: unknown, options: DrawOptions): unknown;
  addText(text: SlideText, options?: DrawOptions): unknown;
  addImage?(options: Record<string, unknown>): unknown;
}

export interface PptxLike {
  layout?: string;
  author?: string;
  company?: string;
  subject?: string;
  title?: string;
  lang?: string;
  theme?: Record<string, unknown>;
  _slides?: unknown[];
  [key: string]: unknown;
}

export type ShapeCatalog = Record<string, unknown>;
