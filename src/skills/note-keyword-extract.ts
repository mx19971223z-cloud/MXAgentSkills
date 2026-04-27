import type { SkillHandler } from "../core/types.js";
import { extractTopKeywords } from "./utils.js";

interface Input {
  content: string;
  maxKeywords?: number;
}

/**
 * note_keyword_extract: extract entities and key points.
 */
export const noteKeywordExtractSkill: SkillHandler<Input, { keywords: string[] }> = {
  doc: {
    skillId: "note_keyword_extract",
    title: "关键词与实体提取",
    description: "从笔记内容提取关键词、实体和核心观点。",
    useCases: ["构建标签", "知识点索引", "快速抽取实体"],
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", description: "原始笔记文本" },
        maxKeywords: { type: "number", description: "关键词上限" }
      },
      required: ["content"]
    },
    outputSchema: {
      type: "object",
      properties: {
        keywords: { type: "string", description: "关键词数组（JSON 序列）" }
      }
    },
    example: {
      mcp: 'skill.run("note_keyword_extract", { content: "..." })',
      code: 'agentSkills.run("note_keyword_extract", { content })',
      cli: "npm run skill note_keyword_extract --content='Large language model and retrieval augmentation'"
    }
  },
  async run(context, input) {
    const maxKeywords = input.maxKeywords ?? 8;

    try {
      const keywords = await context.llm.extractKeywords({ content: input.content, maxKeywords });
      return { keywords };
    } catch {
      return {
        keywords: extractTopKeywords(input.content, maxKeywords)
      };
    }
  }
};
