import path from "node:path";

import type { AppConfig } from "./types.js";

/**
 * Loads runtime configuration from environment variables.
 */
export function loadConfig(): AppConfig {
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH;

  if (!vaultPath) {
    throw new Error("Missing OBSIDIAN_VAULT_PATH in environment.");
  }

  return {
    vaultPath,
    backupDir: process.env.BACKUP_DIR ?? path.join(vaultPath, ".backups"),
    ragIndexDir: process.env.RAG_INDEX_DIR ?? path.join(vaultPath, ".cache", "rag"),
    logLevel: (process.env.LOG_LEVEL as AppConfig["logLevel"]) ?? "info",
    openAi: {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL,
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini"
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
      model: process.env.OLLAMA_MODEL ?? "qwen2.5:7b"
    }
  };
}
