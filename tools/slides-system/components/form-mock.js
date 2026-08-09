const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function addFormMock(slide, SH, opts = {}) {
  const x = opts.x;
  const y = opts.y;
  const w = opts.w;
  const h = opts.h;
  const title = opts.title || "Formulario";
  const fields = opts.fields || [];
  const buttonLabel = opts.buttonLabel || "Enviar";

  slide.addShape(SH.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addText(title, {
    x: x + 0.28,
    y: y + 0.3,
    w: w - 0.56,
    h: 0.36,
    fontFace: TYPOGRAPHY.display,
    fontSize: 18,
    bold: true,
    color: TOKENS.navy,
    margin: 0,
  });

  fields.forEach((field, index) => {
    const fieldY = y + 0.88 + index * 0.86;
    slide.addText(field.label, {
      x: x + 0.3,
      y: fieldY,
      w: w - 0.6,
      h: 0.16,
      fontFace: TYPOGRAPHY.body,
      fontSize: 11,
      bold: true,
      color: TOKENS.slate,
      margin: 0,
    });
    slide.addShape(SH.roundRect, {
      x: x + 0.28,
      y: fieldY + 0.24,
      w: w - 0.56,
      h: field.multiline ? 0.74 : 0.48,
      rectRadius: 0.03,
      fill: { color: TOKENS.paper },
      line: { color: TOKENS.border, pt: 1 },
    });
  });

  const buttonW = opts.buttonW || 1.36;
  const buttonX = x + (w - buttonW) / 2;
  const buttonY = y + h - 0.7;
  slide.addShape(SH.roundRect, {
    x: buttonX,
    y: buttonY,
    w: buttonW,
    h: 0.42,
    rectRadius: 0.03,
    fill: { color: TOKENS.red },
    line: { color: TOKENS.red },
  });
  slide.addText(buttonLabel, {
    x: buttonX,
    y: buttonY + 0.08,
    w: buttonW,
    h: 0.18,
    fontFace: TYPOGRAPHY.body,
    fontSize: 10.5,
    bold: true,
    color: TOKENS.white,
    align: "center",
    valign: "mid",
    margin: 0,
  });
}

module.exports = {
  addFormMock,
};
