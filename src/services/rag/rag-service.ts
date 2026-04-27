import type { RagSearchItem, RagService, VaultService } from "../../core/types.js";

import { buildEmbedding } from "./embedding.js";
import { VectorStore } from "./faiss-store.js";

const EMBEDDING_DIMENSION = 256;
const CHUNK_SIZE = 700;

/**
 * Local RAG service over markdown notes with FAISS-compatible vector retrieval.
 */
export class LocalRagService implements RagService {
  private readonly vectorStore = new VectorStore(EMBEDDING_DIMENSION);
  private indexed = false;

  public constructor(private readonly vault: VaultService) {}

  public async semanticSearch(query: string, topK: number): Promise<RagSearchItem[]> {
    if (!this.indexed) {
      await this.rebuildIndex();
    }

    const queryVector = buildEmbedding(query, EMBEDDING_DIMENSION);
    const hits = this.vectorStore.search(queryVector, topK);

    return hits.map((hit) => ({
      notePath: hit.item.payload.notePath,
      score: hit.score,
      snippet: hit.item.payload.chunk.slice(0, 180)
    }));
  }

  public async rebuildIndex(): Promise<void> {
    const files = await this.vault.listMarkdownFiles();
    const allItems: Array<{ id: string; vector: number[]; payload: { notePath: string; chunk: string } }> = [];

    for (const file of files) {
      const content = await this.vault.readNote(file);
      const chunks = chunkText(content, CHUNK_SIZE);

      chunks.forEach((chunk, index) => {
        allItems.push({
          id: `${file}::${index}`,
          vector: buildEmbedding(chunk, EMBEDDING_DIMENSION),
          payload: {
            notePath: file,
            chunk
          }
        });
      });
    }

    this.vectorStore.upsert(allItems);
    this.indexed = true;
  }
}

function chunkText(text: string, size: number): string[] {
  const chunks: string[] = [];

  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }

  return chunks;
}
