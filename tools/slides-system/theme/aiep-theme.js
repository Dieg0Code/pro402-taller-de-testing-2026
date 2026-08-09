const { TOKENS } = require("./tokens");
const { TYPOGRAPHY } = require("./typography");

function applyAiepTheme(pptx, meta = {}) {
  pptx.layout = meta.layout || "LAYOUT_WIDE";
  pptx.author = meta.author || "Codex";
  pptx.company = meta.company || "AIEP";
  pptx.subject = meta.subject || "Presentacion";
  pptx.title = meta.title || "Deck";
  pptx.lang = TYPOGRAPHY.lang;
  pptx.theme = {
    headFontFace: TYPOGRAPHY.display,
    bodyFontFace: TYPOGRAPHY.body,
    lang: TYPOGRAPHY.lang,
  };
  return pptx;
}

module.exports = {
  TOKENS,
  TYPOGRAPHY,
  applyAiepTheme,
};
