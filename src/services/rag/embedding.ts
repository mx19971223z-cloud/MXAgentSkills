/**
 * Generates deterministic lightweight embeddings without remote dependencies.
 */
export function buildEmbedding(text: string, dimension = 256): number[] {
  const vector = new Array<number>(dimension).fill(0);
  const normalized = text.toLowerCase();

  for (let index = 0; index < normalized.length; index += 1) {
    const code = normalized.charCodeAt(index);
    const bucket = code % dimension;
    vector[bucket] = (vector[bucket] ?? 0) + 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, item) => sum + item * item, 0)) || 1;

  return vector.map((item) => item / magnitude);
}

export function cosineSimilarity(left: number[], right: number[]): number {
  const size = Math.min(left.length, right.length);
  let score = 0;

  for (let index = 0; index < size; index += 1) {
    score += left[index]! * right[index]!;
  }

  return score;
}
