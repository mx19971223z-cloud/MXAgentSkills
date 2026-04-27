import type { SkillHandler } from "../core/types.js";

interface Input {
  question: string;
  topK?: number;
}

/**
 * rag_local_qa: answer with local vault context and citations.
 */
export const ragLocalQaSkill: SkillHandler<Input, { answer: string; citations: string[] }> = {
  doc: {
    skillId: "rag_local_qa",
    title: "本地 RAG 问答",
    description: "基于 Obsidian 私有知识库完成问答，并返回引用来源。",
    useCases: ["私有知识问答", "文档核对", "本地智能助手"],
    inputSchema: {
      type: "object",
      properties: {
        question: { type: "string", description: "问题文本" },
        topK: { type: "number", description: "检索上下文数量" }
      },
      required: ["question"]
    },
    outputSchema: {
      type: "object",
      properties: {
        answer: { type: "string", description: "带引用标记的回答" },
        citations: { type: "string", description: "引用笔记路径列表" }
      }
    },
    example: {
      mcp: 'skill.run("rag_local_qa", { question: "What is MCP?" })',
      code: 'agentSkills.run("rag_local_qa", { question })',
      cli: "npm run skill rag_local_qa --question='How to use Obsidian MCP?'"
    }
  },
  async run(context, input) {
    const topK = input.topK ?? 5;
    const hits = await context.rag.semanticSearch(input.question, topK);
    const answer = await context.llm.answerWithContext({
      question: input.question,
      context: hits.map((item) => ({ path: item.notePath, chunk: item.snippet }))
    });

    return {
      answer,
      citations: Array.from(new Set(hits.map((item) => item.notePath)))
    };
  }
};
