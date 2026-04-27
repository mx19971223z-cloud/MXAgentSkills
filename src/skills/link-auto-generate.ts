import type { SkillHandler } from "../core/types.js";
import { extractTopKeywords, getBaseNameWithoutExt } from "./utils.js";

interface Input {
  notePath: string;
  maxLinks?: number;
}

/**
 * link_auto_generate: suggest and append wikilinks.
 */
export const linkAutoGenerateSkill: SkillHandler<Input, { linkedContent: string; links: string[] }> = {
  doc: {
    skillId: "link_auto_generate",
    title: "自动双链生成",
    description: "为新笔记自动匹配知识库已有笔记并追加双链关系。",
    useCases: ["知识网络构建", "新笔记入库", "链接缺失补全"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "目标笔记路径" },
        maxLinks: { type: "number", description: "最大关联数量" }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        linkedContent: { type: "string", description: "生成双链后的完整内容" },
        links: { type: "string", description: "命中的笔记双链列表" }
      }
    },
    example: {
      mcp: 'skill.run("link_auto_generate", { notePath: "inbox/new.md" })',
      code: 'agentSkills.run("link_auto_generate", { notePath: "inbox/new.md" })',
      cli: "npm run skill link_auto_generate --notePath=inbox/new.md"
    }
  },
  async run(context, input) {
    const maxLinks = input.maxLinks ?? 6;
    const content = await context.vault.readNote(input.notePath);
    const files = await context.vault.listMarkdownFiles();
    const currentName = getBaseNameWithoutExt(input.notePath);

    const keywords = extractTopKeywords(content, 15);
    const candidates = files
      .filter((file) => file !== input.notePath)
      .map((file) => ({
        file,
        score: keywords.reduce((sum, keyword) => {
          const name = getBaseNameWithoutExt(file).toLowerCase();
          return sum + (name.includes(keyword) ? 1 : 0);
        }, 0)
      }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, maxLinks)
      .map((item) => `[[${getBaseNameWithoutExt(item.file)}]]`);

    const deduped = Array.from(new Set(candidates)).filter((item) => item !== `[[${currentName}]]`);
    const relatedSection = deduped.length > 0 ? `\n\n## Related Notes\n${deduped.map((item) => `- ${item}`).join("\n")}\n` : "";
    const linkedContent = content.includes("## Related Notes") ? content : `${content.trimEnd()}${relatedSection}`;

    return {
      linkedContent,
      links: deduped
    };
  }
};
