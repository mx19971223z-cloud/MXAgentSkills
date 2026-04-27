import type { SkillHandler } from "../core/types.js";

interface Input {
  text: string;
  targetLanguage: "zh" | "en" | "ja" | "de";
}

/**
 * note_translate: multilingual markdown translation.
 */
export const noteTranslateSkill: SkillHandler<Input, { translatedText: string }> = {
  doc: {
    skillId: "note_translate",
    title: "笔记多语言翻译",
    description: "支持中/英/日/德四种语言互译，保留 Markdown 结构。",
    useCases: ["跨语言分享", "国际化协作", "双语知识库"],
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "待翻译文本" },
        targetLanguage: { type: "string", description: "目标语言 zh|en|ja|de", enum: ["zh", "en", "ja", "de"] }
      },
      required: ["text", "targetLanguage"]
    },
    outputSchema: {
      type: "object",
      properties: {
        translatedText: { type: "string", description: "翻译结果" }
      }
    },
    example: {
      mcp: 'skill.run("note_translate", { text: "Hello", targetLanguage: "ja" })',
      code: 'agentSkills.run("note_translate", { text, targetLanguage: "en" })',
      cli: "npm run skill note_translate --text='你好，世界' --targetLanguage=en"
    }
  },
  async run(context, input) {
    const translatedText = await context.llm.translate(input);
    return { translatedText };
  }
};
