import * as spacingJs from "../../utils/spacing";
import * as validationJs from "../../utils/validation";
import * as codeJs from "../../utils/code";
import type { PptxLike, SlideLike, TextRun } from "../types";

type SpacingModule = {
  SPACING: Record<string, number>;
};

type ValidationModule = {
  validateSlide: (slide: SlideLike, pptx: PptxLike) => void;
};

type CodeModule = {
  makeCodeRuns: (code: string, lang?: string, fontSize?: number) => TextRun[];
  makeCodeText: (
    code: string
  ) => { lineNumbers: string; codeText: string; totalLines: number; lineDigits: number };
  makeCodeLines: (code: string, lang?: string) => Array<{ segments: Array<{ text: string; color: string }> }>;
  makeCodeLineRuns: (code: string, lang?: string, fontSize?: number) => TextRun[][];
  makeCodeSvgData: (
    code: string,
    lang?: string,
    opts?: {
      width?: number;
      height?: number;
      fontSize?: number;
      linePitch?: number;
      charW?: number;
      lineDigits?: number;
      pxPerIn?: number;
      topOffset?: number;
    }
  ) => string;
  buildThemeMap: (themeCssModule?: string) => Record<string, string>;
};

const spacing = spacingJs as unknown as SpacingModule;
const validation = validationJs as unknown as ValidationModule;
const code = codeJs as unknown as CodeModule;

export const SPACING = spacing.SPACING;
export const validateSlide = validation.validateSlide;
export const makeCodeRuns = code.makeCodeRuns;
export const makeCodeText = code.makeCodeText;
export const makeCodeLines = code.makeCodeLines;
export const makeCodeLineRuns = code.makeCodeLineRuns;
export const makeCodeSvgData = code.makeCodeSvgData;
export const buildThemeMap = code.buildThemeMap;

export * from "./text-quality";
