import type { SkillHandler } from "../core/types.js";

interface Input {
  notePath: string;
  hint?: string;
}

/**
 * note_continue_write: generate continuation and append.
 */
export const noteContinueWriteSkill: SkillHandler<Input, { appended: string; notePath: string }> = {
  doc: {
    skillId: "note_continue_write",
    title: "笔记自动续写",
    description: "读取当前笔记语境并自动续写，直接追加到原文件末尾。",
    useCases: ["灵感扩展", "写作辅助", "草稿补全"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "笔记路径" },
        hint: { type: "string", description: "续写方向提示" }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        appended: { type: "string", description: "追加文本" },
        notePath: { type: "string", description: "目标笔记路径" }
      }
    },
    example: {
      mcp: 'skill.run("note_continue_write", { notePath: "writing/idea.md", hint: "技术方案" })',
      code: 'agentSkills.run("note_continue_write", { notePath, hint: "next section" })',
      cli: "npm run skill note_continue_write --notePath=writing/idea.md --hint='继续补全实施步骤'"
    }
  },
  async run(context, input) {
    const content = await context.vault.readNote(input.notePath);
    const appended = await context.llm.continueWrite({ content, hint: input.hint });
    await context.vault.appendNote(input.notePath, `\n\n${appended.trim()}\n`);

    return {
      appended,
      notePath: input.notePath
    };
  }
};
