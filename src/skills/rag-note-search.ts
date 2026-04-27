import type { SkillHandler } from "../core/types.js";

interface Input {
  query: string;
  topK?: number;
}

/**
 * rag_note_search: semantic retrieval for notes.
 */
export const ragNoteSearchSkill: SkillHandler<Input, { items: Array<{ notePath: string; score: number; snippet: string }> }> = {
  doc: {
    skillId: "rag_note_search",
    title: "语义笔记检索",
    description: "基于向量语义相似度检索最相关笔记，默认返回 Top5。",
    useCases: ["替代关键词搜索", "检索相关上下文", "知识发现"],
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "查询语句" },
        topK: { type: "number", description: "返回数量" }
      },
      required: ["query"]
    },
    outputSchema: {
      type: "object",
      properties: {
        items: { type: "string", description: "检索结果数组（JSON 序列）" }
      }
    },
    example: {
      mcp: 'skill.run("rag_note_search", { query: "MCP skill routing" })',
      code: 'agentSkills.run("rag_note_search", { query: "local rag" })',
      cli: "npm run skill rag_note_search --query='obsidian agent skill'"
    }
  },
  async run(context, input) {
    const topK = input.topK ?? 5;
    const items = await context.rag.semanticSearch(input.query, topK);
    return { items };
  }
};
