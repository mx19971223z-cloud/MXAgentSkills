import fs from "node:fs/promises";
import path from "node:path";

import type { SkillHandler } from "../core/types.js";

interface Input {
  targetPath: string;
  mode?: "single" | "folder";
  destinationPath?: string;
}

/**
 * note_backup: backup one note or a folder.
 */
export const noteBackupSkill: SkillHandler<Input, { backupPath: string; files: number }> = {
  doc: {
    skillId: "note_backup",
    title: "笔记自动备份",
    description: "支持单文件和目录级备份，自动生成时间戳目录。",
    useCases: ["版本保护", "定时备份", "误删恢复"],
    inputSchema: {
      type: "object",
      properties: {
        targetPath: { type: "string", description: "待备份目标路径" },
        mode: { type: "string", description: "single 或 folder", enum: ["single", "folder"] },
        destinationPath: { type: "string", description: "可选备份目录" }
      },
      required: ["targetPath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        backupPath: { type: "string", description: "备份目录路径" },
        files: { type: "number", description: "备份文件数量" }
      }
    },
    example: {
      mcp: 'skill.run("note_backup", { targetPath: "inbox", mode: "folder" })',
      code: 'agentSkills.run("note_backup", { targetPath: "daily/today.md", mode: "single" })',
      cli: "npm run skill note_backup --targetPath=inbox --mode=folder"
    }
  },
  async run(context, input) {
    const mode = input.mode ?? "single";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const destinationRoot = input.destinationPath
      ? context.vault.resolvePath(input.destinationPath)
      : context.vault.resolvePath(context.config.backupDir);
    const backupPath = path.join(destinationRoot, timestamp);

    await fs.mkdir(backupPath, { recursive: true });

    if (mode === "single") {
      const source = context.vault.resolvePath(input.targetPath);
      const fileName = path.basename(source);
      await fs.copyFile(source, path.join(backupPath, fileName));
      return { backupPath, files: 1 };
    }

    const files = await context.vault.listMarkdownFiles(input.targetPath);

    await Promise.all(
      files.map(async (file) => {
        const source = context.vault.resolvePath(file);
        const target = path.join(backupPath, file.replaceAll("/", "_"));
        await fs.copyFile(source, target);
      })
    );

    return {
      backupPath,
      files: files.length
    };
  }
};
