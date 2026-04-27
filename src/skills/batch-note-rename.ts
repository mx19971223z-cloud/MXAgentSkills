import path from "node:path";

import type { SkillHandler } from "../core/types.js";
import { getBaseNameWithoutExt, toKebabCase } from "./utils.js";

interface Input {
  folderPath: string;
  strategy?: "slug" | "date-prefix";
}

/**
 * batch_note_rename: normalize file names in a folder.
 */
export const batchNoteRenameSkill: SkillHandler<Input, { renamed: Array<{ from: string; to: string }> }> = {
  doc: {
    skillId: "batch_note_rename",
    title: "批量笔记重命名",
    description: "按策略批量规范化文件名，适合清理历史笔记命名。",
    useCases: ["命名标准化", "目录治理", "批量清理"],
    inputSchema: {
      type: "object",
      properties: {
        folderPath: { type: "string", description: "目标目录路径" },
        strategy: { type: "string", description: "命名策略 slug|date-prefix", enum: ["slug", "date-prefix"] }
      },
      required: ["folderPath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        renamed: { type: "string", description: "重命名映射数组（JSON 序列）" }
      }
    },
    example: {
      mcp: 'skill.run("batch_note_rename", { folderPath: "inbox" })',
      code: 'agentSkills.run("batch_note_rename", { folderPath: "projects", strategy: "date-prefix" })',
      cli: "npm run skill batch_note_rename --folderPath=inbox --strategy=slug"
    }
  },
  async run(context, input) {
    const strategy = input.strategy ?? "slug";
    const files = await context.vault.listMarkdownFiles(input.folderPath);
    const renamed: Array<{ from: string; to: string }> = [];

    for (const file of files) {
      const directory = path.dirname(file).replaceAll("\\", "/");
      const base = getBaseNameWithoutExt(file);
      const extension = path.extname(file);
      const slug = toKebabCase(base);
      const nextName = strategy === "date-prefix" ? `${new Date().toISOString().slice(0, 10)}-${slug}` : slug;
      const nextPath = `${directory === "." ? "" : `${directory}/`}${nextName}${extension}`;

      if (file !== nextPath) {
        await context.vault.renameNote(file, nextPath);
        renamed.push({ from: file, to: nextPath });
      }
    }

    return { renamed };
  }
};
