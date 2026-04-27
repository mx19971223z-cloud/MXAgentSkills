import type { SkillHandler } from "../core/types.js";
import { normalizeTag } from "./utils.js";

interface Input {
  folderPath: string;
  tags: string[];
  mode?: "append" | "replace";
}

/**
 * batch_note_tag: add/replace tags in markdown notes.
 */
export const batchNoteTagSkill: SkillHandler<Input, { updatedFiles: string[] }> = {
  doc: {
    skillId: "batch_note_tag",
    title: "批量标签处理",
    description: "批量为笔记添加或替换标签，支持 append/replace。",
    useCases: ["标签治理", "主题归档", "批量分类"],
    inputSchema: {
      type: "object",
      properties: {
        folderPath: { type: "string", description: "目录路径" },
        tags: { type: "string", description: "标签数组" },
        mode: { type: "string", description: "append 或 replace", enum: ["append", "replace"] }
      },
      required: ["folderPath", "tags"]
    },
    outputSchema: {
      type: "object",
      properties: {
        updatedFiles: { type: "string", description: "更新成功的文件列表（JSON 序列）" }
      }
    },
    example: {
      mcp: 'skill.run("batch_note_tag", { folderPath: "inbox", tags: ["project", "ai"] })',
      code: 'agentSkills.run("batch_note_tag", { folderPath: "meeting", tags: ["review"], mode: "replace" })',
      cli: "npm run skill batch_note_tag --folderPath=inbox --tags=ai,agent --mode=append"
    }
  },
  async run(context, input) {
    const mode = input.mode ?? "append";
    const incomingTags = input.tags.map(normalizeTag);
    const files = await context.vault.listMarkdownFiles(input.folderPath);
    const updatedFiles: string[] = [];

    for (const file of files) {
      const content = await context.vault.readNote(file);
      const lines = content.split(/\r?\n/);
      const existingTags = Array.from(new Set((content.match(/#[\p{L}\p{N}_-]+/gu) ?? []).map(normalizeTag)));
      const mergedTags = mode === "replace" ? incomingTags : Array.from(new Set([...existingTags, ...incomingTags]));

      const bodyWithoutTagLine = lines.filter((line) => !line.startsWith("tags:"));
      const nextContent = `tags: [${mergedTags.join(", ")}]\n${bodyWithoutTagLine.join("\n")}`;

      await context.vault.writeNote(file, nextContent);
      updatedFiles.push(file);
    }

    return { updatedFiles };
  }
};
