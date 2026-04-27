export type SkillId =
  | "note_summary"
  | "note_keyword_extract"
  | "note_auto_format"
  | "link_auto_generate"
  | "knowledge_graph_extract"
  | "rag_local_qa"
  | "rag_note_search"
  | "note_continue_write"
  | "note_translate"
  | "batch_note_rename"
  | "batch_note_tag"
  | "md_to_pdf"
  | "note_backup";

export interface SkillInputSchema {
  type: "object";
  properties: Record<string, { type: string; description: string; enum?: string[] }>;
  required?: string[];
}

export interface SkillOutputSchema {
  type: "object";
  properties: Record<string, { type: string; description: string }>;
}

export interface SkillDoc {
  skillId: SkillId;
  title: string;
  description: string;
  useCases: string[];
  inputSchema: SkillInputSchema;
  outputSchema: SkillOutputSchema;
  example: {
    mcp: string;
    code: string;
    cli: string;
  };
}

export interface SkillResult<TData = unknown> {
  success: boolean;
  skillId: SkillId;
  data?: TData;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: Record<string, unknown>;
}

export interface AppConfig {
  vaultPath: string;
  backupDir: string;
  ragIndexDir: string;
  logLevel: "debug" | "info" | "warn" | "error";
  openAi: {
    apiKey?: string;
    baseUrl?: string;
    model: string;
  };
  ollama: {
    baseUrl: string;
    model: string;
  };
}

export interface LanguageModelService {
  summarize(input: { text: string; mode: "short" | "long" }): Promise<string>;
  extractKeywords(input: { content: string; maxKeywords: number }): Promise<string[]>;
  continueWrite(input: { content: string; hint?: string }): Promise<string>;
  translate(input: { text: string; targetLanguage: "zh" | "en" | "ja" | "de" }): Promise<string>;
  answerWithContext(input: { question: string; context: Array<{ path: string; chunk: string }> }): Promise<string>;
}

export interface RagSearchItem {
  notePath: string;
  score: number;
  snippet: string;
}

export interface RagService {
  semanticSearch(query: string, topK: number): Promise<RagSearchItem[]>;
}

export interface VaultService {
  resolvePath(inputPath: string): string;
  readNote(notePath: string): Promise<string>;
  writeNote(notePath: string, content: string): Promise<void>;
  listMarkdownFiles(folderPath?: string): Promise<string[]>;
  renameNote(oldPath: string, newPath: string): Promise<void>;
  appendNote(notePath: string, content: string): Promise<void>;
  ensureDir(folderPath: string): Promise<void>;
}

export interface SkillContext {
  config: AppConfig;
  llm: LanguageModelService;
  rag: RagService;
  vault: VaultService;
  logger: {
    debug(message: string, data?: unknown): void;
    info(message: string, data?: unknown): void;
    warn(message: string, data?: unknown): void;
    error(message: string, data?: unknown): void;
  };
}

export interface SkillHandler<TInput = Record<string, unknown>, TOutput = unknown> {
  doc: SkillDoc;
  run(context: SkillContext, input: TInput): Promise<TOutput>;
}
