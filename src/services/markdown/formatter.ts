/**
 * Lightweight markdown formatter for predictable note layout.
 */
export function formatMarkdown(input: string): string {
  const normalizedLineBreaks = input.replace(/\r\n/g, "\n");
  const collapsedTrailingSpace = normalizedLineBreaks
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  const collapsedEmptyLines = collapsedTrailingSpace.replace(/\n{3,}/g, "\n\n");

  return `${collapsedEmptyLines.trim()}\n`;
}
