import path from "node:path";

export function getBaseNameWithoutExt(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function toKebabCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeTag(tag: string): string {
  const trimmed = tag.trim().replace(/^#/, "");
  return `#${trimmed}`;
}

export function extractTopKeywords(text: string, maxKeywords: number): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "from",
    "have",
    "will",
    "you",
    "are",
    "not"
  ]);

  const counter = new Map<string, number>();

  for (const word of words) {
    if (stopWords.has(word)) {
      continue;
    }

    counter.set(word, (counter.get(word) ?? 0) + 1);
  }

  return [...counter.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
