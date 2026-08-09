const path = require("path");
const { imageSizingContain } = require("../vendor/pptxgenjs_helpers/image");

// Posicion fija del sello en la esquina superior derecha (slide 13.333 x 7.5).
const LOCKUP_POS = { x: 11.55, y: 0.34, w: 1.42, h: 1.06 };

const ASSET_DARK = path.join(__dirname, "..", "assets", "vcm", "lockup-vinculacion-dark.png");
const ASSET_WHITE = path.join(__dirname, "..", "assets", "vcm", "lockup-vinculacion-white.png");

/**
 * Coloca el sello/lockup "Vinculacion con el Medio" en la esquina superior derecha.
 * Variante navy (dark) para fondos claros; variante blanca (white) para fondos oscuros.
 *
 * @param {object}  slide            slide de PptxGenJS
 * @param {object}  [opts]
 * @param {boolean} [opts.onDark=false]  fondo oscuro -> usa el sello blanco
 * @param {string}  [opts.path]          ruta a un PNG de sello propio (override)
 * @param {object}  [opts.pos]           override de posicion/tamano { x, y, w, h }
 */
function vcmLockup(slide, opts = {}) {
  const onDark = opts.onDark ?? false;
  const src = opts.path ?? (onDark ? ASSET_WHITE : ASSET_DARK);
  const pos = { ...LOCKUP_POS, ...(opts.pos || {}) };
  slide.addImage({ path: src, ...imageSizingContain(src, pos.x, pos.y, pos.w, pos.h) });
}

module.exports = { vcmLockup, VCM_LOCKUP_POS: LOCKUP_POS, VCM_LOCKUP_DARK: ASSET_DARK, VCM_LOCKUP_WHITE: ASSET_WHITE };
