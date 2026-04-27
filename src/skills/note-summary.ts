import type { SkillHandler } from "../core/types.js";

interface Input {
  notePath: string;
  mode?: "short" | "long";
}

/**
 * note_summary: summarize one markdown note.
 */
export const noteSummarySkill: SkillHandler<Input, { summary: string }> = {
  doc: {
    skillId: "note_summary",
    title: "笔记自动总结",
    description: "对指定笔记进行长/短模式总结，返回纯文本总结结果。",
    useCases: ["每日笔记摘要", "会议纪要提炼", "长文速览"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "笔记相对路径或绝对路径" },
        mode: { type: "string", description: "总结模式 short|long", enum: ["short", "long"] }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "总结文本" }
      }
    },
    example: {
      mcp: 'skill.run("note_summary", { notePath: "inbox/today.md", mode: "short" })',
      code: 'agentSkills.run("note_summary", { notePath: "inbox/today.md" })',
      cli: "npm run skill note_summary --notePath=inbox/today.md --mode=short"
    }
  },
  async run(context, input) {
    const mode = input.mode ?? "short";
    const content = await context.vault.readNote(input.notePath);
    const summary = await context.llm.summarize({ text: content, mode });

    return { summary };
  }
};
