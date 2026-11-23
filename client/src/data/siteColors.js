import { palette } from './palette.js';

const toRgb = (hex) => hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16));

export function siteColors(layout) {
  const groups = [
    ['ink', 900, layout.background],
    ['teal', 400, layout.primary],
    ['amber', 500, layout.accent],
  ];

  return Object.fromEntries(groups.flatMap(([name, baseShade, color]) => {
    const shades = palette[name];
    const base = toRgb(shades[baseShade]);
    const next = toRgb(color);
    return Object.entries(shades).map(([shade, hex]) => [
      `--${name}-${shade}`,
      toRgb(hex).map((channel, i) => Math.max(0, Math.min(255, channel + next[i] - base[i]))).join(' '),
    ]);
  }));
}

