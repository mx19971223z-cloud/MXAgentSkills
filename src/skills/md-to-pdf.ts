import fs from "node:fs/promises";
import path from "node:path";
import { createWriteStream } from "node:fs";

import MarkdownIt from "markdown-it";
import PDFDocument from "pdfkit";

import type { SkillHandler } from "../core/types.js";

interface Input {
  notePath: string;
  outputPath?: string;
}

/**
 * md_to_pdf: convert markdown note to local PDF.
 */
export const mdToPdfSkill: SkillHandler<Input, { pdfPath: string }> = {
  doc: {
    skillId: "md_to_pdf",
    title: "Markdown 转 PDF",
    description: "将指定笔记转为 PDF 文件并保存到本地。",
    useCases: ["文档分发", "归档导出", "打印准备"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "Markdown 路径" },
        outputPath: { type: "string", description: "可选 PDF 输出路径" }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        pdfPath: { type: "string", description: "PDF 输出路径" }
      }
    },
    example: {
      mcp: 'skill.run("md_to_pdf", { notePath: "publish/weekly.md" })',
      code: 'agentSkills.run("md_to_pdf", { notePath, outputPath: "exports/weekly.pdf" })',
      cli: "npm run skill md_to_pdf --notePath=publish/weekly.md"
    }
  },
  async run(context, input) {
    const resolvedNote = context.vault.resolvePath(input.notePath);
    const outputPath = input.outputPath
      ? context.vault.resolvePath(input.outputPath)
      : resolvedNote.replace(/\.md$/i, ".pdf");

    const markdown = await fs.readFile(resolvedNote, "utf8");
    const plainText = markdownToPlainText(markdown);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await writePdf(outputPath, plainText);

    return {
      pdfPath: outputPath
    };
  }
};

function markdownToPlainText(markdown: string): string {
  const md = new MarkdownIt();
  const html = md.render(markdown);
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function writePdf(targetPath: string, text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const stream = createWriteStream(targetPath);

    stream.on("finish", () => resolve());
    stream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(stream);
    doc.fontSize(11).text(text, {
      lineGap: 4,
      width: 500
    });
    doc.end();
  });
}
