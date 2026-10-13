// Gives each group a stable colour tile (same order as the Figma: blue, red, green, yellow, purple).
const COLORS = ["blue", "red", "green", "yellow", "purple"];

export function groupColor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
