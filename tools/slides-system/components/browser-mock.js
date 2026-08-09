const { TOKENS } = require("../theme/tokens");
const { TYPOGRAPHY } = require("../theme/typography");

function getAddressChromeMetrics(width) {
  if (width < 2.1) {
    return {
      circleX: 0.12,
      circleGap: 0.12,
      circleSize: 0.065,
      addressX: 0.42,
      addressY: 0.105,
      addressW: Math.max(0.9, width - 0.52),
      addressH: 0.205,
      textInset: 0.06,
      fontSize: 6.2,
      align: "center",
    };
  }

  if (width < 3) {
    return {
      circleX: 0.14,
      circleGap: 0.13,
      circleSize: 0.07,
      addressX: 0.48,
      addressY: 0.105,
      addressW: Math.max(1.1, width - 0.6),
      addressH: 0.205,
      textInset: 0.07,
      fontSize: 7,
      align: "left",
    };
  }

  return {
    circleX: 0.16,
    circleGap: 0.16,
    circleSize: 0.08,
    addressX: 0.62,
    addressY: 0.11,
    addressW: width - 1,
    addressH: 0.2,
    textInset: 0.16,
    fontSize: 8.8,
    align: "left",
  };
}

function getCompactUrlDisplay(rawUrl, width) {
  const fallback = "app.local";
  const source = String(rawUrl || fallback).trim();
  let host = source;
  let path = "";

  try {
    const normalized = source.includes("://") ? source : `https://${source}`;
    const parsed = new URL(normalized);
    host = parsed.hostname || fallback;
    path = parsed.pathname && parsed.pathname !== "/" ? parsed.pathname.replace(/^\/+/, "") : "";
  } catch {
    const stripped = source.replace(/^[a-z]+:\/\//i, "");
    const parts = stripped.split("/");
    host = parts[0] || fallback;
    path = parts[1] || "";
  }

  if (width < 2.1) {
    if (host.length > 10) {
      return `${host.slice(0, 9)}…`;
    }
    return host;
  }

  if (!path) {
    return host;
  }

  const combined = `${host}/${path}`;
  if (combined.length > 18) {
    return `${host}/…`;
  }
  return combined;
}

function addBrowserMock(slide, SH, opts = {}) {
  const metrics = getAddressChromeMetrics(opts.w);
  const displayUrl =
    opts.compactUrl || opts.w < 3 ? getCompactUrlDisplay(opts.url, opts.w) : opts.url || "https://app.local";

  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    rectRadius: 0.04,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });

  slide.addShape(SH.roundRect, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: 0.42,
    rectRadius: 0.04,
    fill: { color: TOKENS.softNeutral },
    line: { color: TOKENS.softNeutral },
  });
  ["D62027", "E0BC5A", "52606D"].forEach((color, index) => {
    slide.addShape(SH.ellipse, {
      x: opts.x + metrics.circleX + index * metrics.circleGap,
      y: opts.y + 0.14,
      w: metrics.circleSize,
      h: metrics.circleSize,
      fill: { color },
      line: { color },
    });
  });
  slide.addShape(SH.roundRect, {
    x: opts.x + metrics.addressX,
    y: opts.y + metrics.addressY,
    w: metrics.addressW,
    h: metrics.addressH,
    rectRadius: 0.03,
    fill: { color: TOKENS.white },
    line: { color: TOKENS.border, pt: 1 },
  });
  slide.addText(displayUrl, {
    x: opts.x + metrics.addressX + metrics.textInset,
    y: opts.y + 0.15,
    w: Math.max(0.2, metrics.addressW - metrics.textInset * 2),
    h: 0.12,
    fontFace: TYPOGRAPHY.body,
    fontSize: metrics.fontSize,
    color: TOKENS.slate,
    margin: 0,
    fit: "shrink",
    align: metrics.align,
  });

  if (opts.title) {
    slide.addText(opts.title, {
      x: opts.x + 0.22,
      y: opts.y + 0.62,
      w: opts.w - 0.44,
      h: 0.22,
      fontFace: TYPOGRAPHY.display,
      fontSize: 16,
      bold: true,
      color: TOKENS.navy,
      margin: 0,
    });
  }
}

module.exports = {
  addBrowserMock,
};
