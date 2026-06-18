export interface SteelTextDims {
  width: number;
  height: number;
  fontSize: number;
  textY: number;
  offsetX: number;
  offsetY: number;
  fontFamily: string;
  fontWeight: string | number;
  letterSpacing: string;
}

function parseLineHeightPx(lineHeight: string, fontSize: number): number {
  if (lineHeight === 'normal') return fontSize * 1.2;
  if (lineHeight.endsWith('px')) return parseFloat(lineHeight);
  const numeric = parseFloat(lineHeight);
  return Number.isNaN(numeric) ? fontSize : numeric * fontSize;
}

export function measureSteelText(
  el: HTMLElement,
  wrapper: HTMLElement,
  text: string
): SteelTextDims {
  const rect = el.getBoundingClientRect();
  const wrapperRect = wrapper.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize);
  const strokeWidth =
    parseFloat(cs.webkitTextStrokeWidth || cs.getPropertyValue('-webkit-text-stroke-width') || '0') || 0;
  const lineHeightPx = parseLineHeightPx(cs.lineHeight, fontSize);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let ascent = fontSize * 0.82;
  let descent = fontSize * 0.2;

  if (ctx) {
    ctx.font = `${cs.fontStyle} ${cs.fontVariant} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const metrics = ctx.measureText(text);
    if (metrics.actualBoundingBoxAscent > 0) ascent = metrics.actualBoundingBoxAscent;
    if (metrics.actualBoundingBoxDescent > 0) descent = metrics.actualBoundingBoxDescent;
  }

  // Account for line-height centering and stroke padding so SVG fill matches outline text
  const leading = Math.max(0, (lineHeightPx - (ascent + descent)) / 2);
  const textY = leading + ascent + strokeWidth * 0.5;

  return {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height),
    fontSize,
    textY,
    offsetX: rect.left - wrapperRect.left,
    offsetY: rect.top - wrapperRect.top,
    fontFamily: cs.fontFamily,
    fontWeight: cs.fontWeight,
    letterSpacing: cs.letterSpacing,
  };
}
