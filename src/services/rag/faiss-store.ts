import { cosineSimilarity } from "./embedding.js";
import { createRequire } from "node:module";

const requireModule = createRequire(import.meta.url);

export interface VectorItem {
  id: string;
  vector: number[];
  payload: {
    notePath: string;
    chunk: string;
  };
}

interface FaissLikeIndex {
  add(vectors: number[][]): void;
  search(vector: number[], topK: number): { distances: number[]; labels: number[] };
}

/**
 * FAISS optional adapter with in-memory cosine fallback.
 */
export class VectorStore {
  private readonly items: VectorItem[] = [];
  private readonly faissIndex?: FaissLikeIndex;

  public constructor(private readonly dimension: number) {
    this.faissIndex = this.tryCreateFaissIndex(dimension);
  }

  public upsert(items: VectorItem[]): void {
    for (const item of items) {
      this.items.push(item);
    }

    if (this.faissIndex) {
      this.faissIndex.add(items.map((item) => item.vector));
    }
  }

  public search(queryVector: number[], topK: number): Array<{ item: VectorItem; score: number }> {
    if (this.faissIndex) {
      const { distances, labels } = this.faissIndex.search(queryVector, topK);

      return labels
        .map((label, index) => {
          const item = this.items[label];

          if (!item) {
            return null;
          }

          return {
            item,
            score: distances[index] ?? 0
          };
        })
        .filter((entry): entry is { item: VectorItem; score: number } => Boolean(entry));
    }

    return this.items
      .map((item) => ({
        item,
        score: cosineSimilarity(queryVector, item.vector)
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, topK);
  }

  private tryCreateFaissIndex(dimension: number): FaissLikeIndex | undefined {
    try {
      const faiss = requireModule("faiss-node") as {
        IndexFlatL2: new (dimension: number) => FaissLikeIndex;
      };

      return new faiss.IndexFlatL2(dimension);
    } catch {
      return undefined;
    }
  }
}
