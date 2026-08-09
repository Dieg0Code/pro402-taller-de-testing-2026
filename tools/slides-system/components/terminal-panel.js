const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function addTerminalPanel(slide, SH, opts = {}) {
  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    rectRadius: 0.04,
    fill: { color: opts.fill || TOKENS.terminalBg },
    line: { color: opts.fill || TOKENS.terminalBg },
  });

  slide.addShape(SH.roundRect, {
    x: opts.x + 0.14,
    y: opts.y + 0.12,
    w: opts.w - 0.28,
    h: 0.34,
    rectRadius: 0.03,
    fill: { color: "1E2937" },
    line: { color: "1E2937" },
  });
  slide.addText(opts.title || "Terminal", {
    x: opts.x + 0.28,
    y: opts.y + 0.2,
    w: opts.w - 0.56,
    h: 0.14,
    fontFace: TYPOGRAPHY.body,
    fontSize: 10,
    bold: true,
    color: TOKENS.white,
    margin: 0,
  });

  const lines = opts.lines || [];
  lines.forEach((line, index) => {
    const y = opts.y + 0.62 + index * 0.28;
    if (line.prompt) {
      slide.addText(line.prompt, {
        x: opts.x + 0.24,
        y,
        w: 0.36,
        h: 0.18,
        fontFace: TYPOGRAPHY.mono,
        fontSize: opts.fontSize || 11,
        bold: true,
        color: TOKENS.terminalPrompt,
        margin: 0,
      });
    }
    slide.addText(line.text || "", {
      x: opts.x + (line.prompt ? 0.58 : 0.24),
      y,
      w: opts.w - 0.82,
      h: 0.18,
      fontFace: TYPOGRAPHY.mono,
      fontSize: opts.fontSize || 11,
      color: line.kind === "muted" ? TOKENS.terminalMuted : TOKENS.terminalOutput,
      margin: 0,
    });
  });
}

module.exports = {
  addTerminalPanel,
};
