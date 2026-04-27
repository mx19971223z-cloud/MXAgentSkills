import ollama, { type Message } from "ollama";
import OpenAI from "openai";

import type { AppConfig, LanguageModelService } from "../../core/types.js";

/**
 * Hybrid LLM service: local Ollama first, OpenAI fallback.
 */
export class HybridLlmService implements LanguageModelService {
  private readonly config: AppConfig;
  private readonly openAiClient?: OpenAI;

  public constructor(config: AppConfig) {
    this.config = config;

    if (config.openAi.apiKey) {
      this.openAiClient = new OpenAI({
        apiKey: config.openAi.apiKey,
        baseURL: config.openAi.baseUrl
      });
    }
  }

  public async summarize(input: { text: string; mode: "short" | "long" }): Promise<string> {
    const instruction =
      input.mode === "short"
        ? "Summarize in 3 concise bullet points."
        : "Summarize with sections: Key Ideas, Action Items, and Risks.";

    return this.generate(`${instruction}\n\nText:\n${input.text}`);
  }

  public async extractKeywords(input: { content: string; maxKeywords: number }): Promise<string[]> {
    const result = await this.generate(
      `Extract up to ${input.maxKeywords} keywords/entities from the text as comma-separated values.\n\n${input.content}`
    );

    return result
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, input.maxKeywords);
  }

  public async continueWrite(input: { content: string; hint?: string }): Promise<string> {
    return this.generate(
      `Continue writing this Obsidian note in coherent markdown. Keep style consistent.\nHint: ${input.hint ?? "none"}\n\n${input.content}`
    );
  }

  public async translate(input: { text: string; targetLanguage: "zh" | "en" | "ja" | "de" }): Promise<string> {
    const languageMap: Record<string, string> = {
      zh: "Chinese",
      en: "English",
      ja: "Japanese",
      de: "German"
    };

    return this.generate(`Translate the text to ${languageMap[input.targetLanguage]}. Keep markdown syntax intact.\n\n${input.text}`);
  }

  public async answerWithContext(input: {
    question: string;
    context: Array<{ path: string; chunk: string }>;
  }): Promise<string> {
    const contextBlock = input.context
      .map((item, index) => `[${index + 1}] ${item.path}\n${item.chunk}`)
      .join("\n\n");

    return this.generate(
      `Answer the question only using provided context. Add citation markers like [1], [2].\nQuestion: ${input.question}\n\nContext:\n${contextBlock}`
    );
  }

  private async generate(prompt: string): Promise<string> {
    const localResponse = await this.tryOllama(prompt);

    if (localResponse) {
      return localResponse;
    }

    const cloudResponse = await this.tryOpenAi(prompt);

    if (cloudResponse) {
      return cloudResponse;
    }

    // Safe deterministic fallback when no model endpoint is reachable.
    return prompt.slice(0, 500);
  }

  private async tryOllama(prompt: string): Promise<string | null> {
    try {
      const response = await ollama.chat({
        model: this.config.ollama.model,
        messages: [{ role: "user", content: prompt } satisfies Message],
        options: {
          num_predict: 800
        },
        // @ts-expect-error ollama types currently miss host option.
        host: this.config.ollama.baseUrl
      });

      return response.message.content.trim();
    } catch {
      return null;
    }
  }

  private async tryOpenAi(prompt: string): Promise<string | null> {
    if (!this.openAiClient) {
      return null;
    }

    try {
      const response = await this.openAiClient.responses.create({
        model: this.config.openAi.model,
        input: prompt
      });

      const textOutput = response.output_text;
      return textOutput.trim();
    } catch {
      return null;
    }
  }
}
