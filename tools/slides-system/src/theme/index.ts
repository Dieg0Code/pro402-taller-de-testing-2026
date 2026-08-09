import * as jsTheme from "../../theme";
import type { PptxLike, ThemeMeta, ThemeTokens, TypographyScale } from "../types";

type ThemeModule = {
  TOKENS: ThemeTokens;
  TYPOGRAPHY: TypographyScale;
  applyAiepTheme: (pptx: PptxLike, meta?: ThemeMeta) => PptxLike;
};

const themeModule = jsTheme as unknown as ThemeModule;

export const TOKENS = themeModule.TOKENS;
export const TYPOGRAPHY = themeModule.TYPOGRAPHY;

export function applyAiepTheme(pptx: PptxLike, meta: ThemeMeta = {}): PptxLike {
  return themeModule.applyAiepTheme(pptx, meta);
}
