export interface SvgOptions {
  /** Optional label drawn before the number, e.g. `"views"`. */
  label?: string;
  /** Text color. Default `"#111827"`. */
  color?: string;
  /** Background color. Default transparent. */
  background?: string;
  /** Font size in px. Default `14`. */
  fontSize?: number;
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (ch) =>
    ch === "<"
      ? "&lt;"
      : ch === ">"
      ? "&gt;"
      : ch === "&"
      ? "&amp;"
      : ch === "'"
      ? "&apos;"
      : "&quot;"
  );
}

function formatCount(count: number): string {
  return count.toLocaleString("en-US");
}

/**
 * Render a minimal, self-contained SVG showing a count. Used for the badge mode
 * (`<img src=".../blog.svg">`). Deliberately plain so it inherits nicely; for a
 * styled counter use the native mode (`trackView` / `<vistaz-counter>`) instead.
 */
export function renderCountSvg(count: number, options: SvgOptions = {}): string {
  const fontSize = options.fontSize ?? 14;
  const color = options.color ?? "#111827";
  const text = options.label
    ? `${formatCount(count)} ${options.label}`
    : formatCount(count);
  const width = Math.max(24, Math.round(text.length * fontSize * 0.62) + 12);
  const height = Math.round(fontSize * 1.6);
  const rect = options.background
    ? `<rect width="${width}" height="${height}" rx="4" fill="${escapeXml(
        options.background
      )}"/>`
    : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(text)}">` +
    rect +
    `<text x="${width / 2}" y="${height / 2}" dominant-baseline="central" ` +
    `text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, sans-serif" ` +
    `font-size="${fontSize}" fill="${escapeXml(color)}">${escapeXml(text)}</text>` +
    `</svg>`
  );
}
