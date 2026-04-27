import type { SkillHandler } from "../core/types.js";
import { formatMarkdown } from "../services/markdown/formatter.js";

interface Input {
  notePath: string;
}

/**
 * note_auto_format: format markdown and overwrite.
 */
export const noteAutoFormatSkill: SkillHandler<Input, { notePath: string; changed: boolean }> = {
  doc: {
    skillId: "note_auto_format",
    title: "笔记自动排版",
    description: "自动规范 Markdown 格式并覆盖保存。",
    useCases: ["统一文档风格", "清理空行", "提交前格式化"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "笔记路径" }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "处理后的笔记路径" },
        changed: { type: "boolean", description: "文件内容是否发生变化" }
      }
    },
    example: {
      mcp: 'skill.run("note_auto_format", { notePath: "docs/guide.md" })',
      code: 'agentSkills.run("note_auto_format", { notePath: "docs/guide.md" })',
      cli: "npm run skill note_auto_format --notePath=docs/guide.md"
    }
  },
  async run(context, input) {
    const content = await context.vault.readNote(input.notePath);
    const formatted = formatMarkdown(content);
    const changed = formatted !== content;

    if (changed) {
      await context.vault.writeNote(input.notePath, formatted);
    }

    return { notePath: input.notePath, changed };
  }
};
