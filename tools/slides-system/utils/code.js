const fs = require("fs");
const Prism = require("prismjs");
const { svgToDataUri } = require("../vendor/pptxgenjs_helpers/svg");

let THEME_MAP;
const FALLBACK_COLORS = {
  plain: "F8F8F2",
  comment: "8292A2",
  punctuation: "F8F8F2",
  tag: "F92672",
  attrName: "A6E22E",
  attrValue: "E6DB74",
  string: "E6DB74",
  keyword: "66D9EF",
  function: "A6E22E",
  operator: "F8F8F2",
  number: "AE81FF",
  boolean: "AE81FF",
  property: "66D9EF",
  className: "A6E22E",
  regex: "FD971F",
 };

function loadPrismLanguage(lang) {
  const normalized = String(lang || "plaintext").toLowerCase();
  const aliases = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    yml: "yaml",
    html: "markup",
    xml: "markup",
  };
  const id = aliases[normalized] || normalized;
  if (!Prism.languages[id]) {
    try {
      require(`prismjs/components/prism-${id}`);
    } catch (_error) {}
  }
  return Prism.languages[id] || Prism.languages.plain || {};
}

function buildThemeMap(themeCssModule = "prismjs/themes/prism-okaidia.css") {
  try {
    const css = fs.readFileSync(require.resolve(themeCssModule), "utf8");
    return Object.fromEntries(
      [...css.matchAll(/\.token\.([\w-]+)[^{]*\{[^}]*color:\s*([^;\s]+)[^}]*\}/g)].map(
        ([, token, color]) => [token, color.replace(/#|!important/g, "").trim()]
      )
    );
  } catch (_error) {
    return { plain: "FFFFFF", comment: "999999" };
  }
}

function getThemeMap() {
  if (!THEME_MAP) THEME_MAP = buildThemeMap();
  return THEME_MAP;
}

function normalizeType(type = "plain") {
  const raw = Array.isArray(type) ? type[0] : type;
  const key = String(raw || "plain")
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  return key || "plain";
}

function resolveColor(type = "plain") {
  const theme = getThemeMap();
  const normalized = normalizeType(type);
  return (
    theme[normalized] ||
    theme[String(normalized).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)] ||
    FALLBACK_COLORS[normalized] ||
    theme.plain ||
    FALLBACK_COLORS.plain
  );
}

function createRun(text, type = "plain", fontSize = 11.5) {
  return {
    text,
    options: {
      fontFace: "Consolas",
      color: resolveColor(type),
      fontSize,
    },
  };
}

function escapeXml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function normalizeSegmentText(text) {
  return String(text || "").replace(/\t/g, "  ");
}

function mergeSegment(segments, text, type = "plain") {
  if (!text) return;
  const color = resolveColor(type);
  const last = segments[segments.length - 1];
  if (last && last.color === color) {
    last.text += text;
    return;
  }
  segments.push({ text, color });
}

function tokensToSegments(tokens, inheritedType = "plain", segments = []) {
  tokens.forEach((token) => {
    if (typeof token === "string") {
      mergeSegment(segments, token, inheritedType);
      return;
    }

    const nextType = token.alias || token.type || inheritedType;
    if (Array.isArray(token.content)) {
      tokensToSegments(token.content, nextType, segments);
      return;
    }

    mergeSegment(segments, token.content, nextType);
  });

  return segments;
}

function tokensToRuns(tokens, fontSize, inheritedType = "plain") {
  return tokens.flatMap((token) =>
    typeof token === "string"
      ? [createRun(token, inheritedType, fontSize)]
      : Array.isArray(token.content)
      ? tokensToRuns(token.content, fontSize, token.alias || token.type || inheritedType)
      : [createRun(token.content, token.alias || token.type || inheritedType, fontSize)]
  );
}

function makeCodeRuns(code, lang = "html", fontSize = 11.5) {
  const grammar = loadPrismLanguage(lang);
  const lines = String(code || "").split("\n");
  const pad = lines.length.toString().length;
  return lines.flatMap((line, index) => {
    const lineRuns = [
      createRun(`${(index + 1).toString().padStart(pad, " ")} `, "comment", fontSize),
      ...tokensToRuns(Prism.tokenize(line, grammar), fontSize),
    ];

    if (index < lines.length - 1 && lineRuns.length > 0) {
      const last = lineRuns[lineRuns.length - 1];
      lineRuns[lineRuns.length - 1] = {
        ...last,
        options: {
          ...(last.options || {}),
          breakLine: true,
        },
      };
    }

    return lineRuns;
  });
}

function makeCodeText(code) {
  const lines = String(code || "").split("\n");
  const pad = lines.length.toString().length;
  return {
    lineNumbers: lines.map((_, index) => String(index + 1).padStart(pad, " ")).join("\n"),
    codeText: lines.join("\n"),
    totalLines: lines.length,
    lineDigits: pad,
  };
}

function makeCodeLines(code, lang = "html") {
  const grammar = loadPrismLanguage(lang);
  return String(code || "").split("\n").map((line) => ({
    segments: tokensToSegments(Prism.tokenize(line, grammar)),
  }));
}

function makeCodeLineRuns(code, lang = "html", fontSize = 11.5) {
  const grammar = loadPrismLanguage(lang);
  return String(code || "").split("\n").map((line) => {
    const runs = tokensToRuns(Prism.tokenize(line, grammar), fontSize);
    return runs.length > 0 ? runs : [createRun(" ", "plain", fontSize)];
  });
}

function makeCodeSvgData(code, lang = "html", opts = {}) {
  const codeData = makeCodeText(code);
  const lines = makeCodeLines(code, lang);
  const pxPerIn = opts.pxPerIn || 240;
  const widthPx = Math.max(160, Math.round((opts.width || 4.2) * pxPerIn));
  const heightPx = Math.max(80, Math.round((opts.height || 2.4) * pxPerIn));
  const fontSizePt = opts.fontSize || 11.5;
  const fontSizePx = Math.max(11, Math.round((fontSizePt / 72) * pxPerIn));
  const charWidthPx = Math.max(6, (opts.charW || 0.07) * pxPerIn);
  const linePitchPx = Math.max(16, (opts.linePitch || 0.18) * pxPerIn);
  const lineDigits = opts.lineDigits || codeData.lineDigits || 1;
  const lineNumberRightX = Math.max(18, Math.round((lineDigits + 0.72) * charWidthPx));
  const codeStartX = Math.round((lineDigits + 1) * charWidthPx);
  const topOffsetPx = Math.max(0, Math.round((opts.topOffset || 0) * pxPerIn));
  const lineBaselineOffsetPx = Math.max(12, Math.round(fontSizePx * 0.84));
  const clipId = `code-clip-${codeData.totalLines}-${lineDigits}-${widthPx}-${heightPx}`;
  const numberColor = resolveColor("comment");
  const svgLines = [];

  lines.forEach((line, index) => {
    const lineTop = topOffsetPx + index * linePitchPx + lineBaselineOffsetPx;
    const lineNumber = escapeXml(String(index + 1).padStart(lineDigits, " "));
    svgLines.push(
      `<text x="${lineNumberRightX}" y="${lineTop}" fill="#${numberColor}" text-anchor="end">${lineNumber}</text>`
    );

    const tspans = line.segments
      .map((segment) => {
        const segmentText = normalizeSegmentText(segment.text);
        if (!segmentText) return "";
        return `<tspan fill="#${segment.color}" xml:space="preserve">${escapeXml(segmentText)}</tspan>`;
      })
      .filter(Boolean)
      .join("");

    svgLines.push(
      `<text x="${codeStartX}" y="${lineTop}" xml:space="preserve">${tspans || " "}</text>`
    );
  });

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${widthPx}" height="${heightPx}" viewBox="0 0 ${widthPx} ${heightPx}" overflow="hidden">`,
    `<defs><clipPath id="${clipId}"><rect x="0" y="0" width="${widthPx}" height="${heightPx}" rx="0" ry="0"/></clipPath></defs>`,
    `<g clip-path="url(#${clipId})" font-family="Consolas, 'Courier New', monospace" font-size="${fontSizePx}" font-weight="400">`,
    svgLines.join(""),
    "</g>",
    "</svg>",
  ].join("");

  return svgToDataUri(svg).slice(5);
}

module.exports = {
  makeCodeRuns,
  makeCodeText,
  makeCodeLines,
  makeCodeLineRuns,
  makeCodeSvgData,
  buildThemeMap,
};
