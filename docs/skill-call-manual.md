# 技能调用手册

## 统一入口

AgentSkills 所有技能均通过统一执行器 `AgentSkillsEngine` 调用。

函数签名：

```ts
run(skillId: SkillId, input: Record<string, unknown>): Promise<SkillResult>
```

返回结构：

```json
{
  "success": true,
  "skillId": "note_summary",
  "data": {}
}
```

错误结构：

```json
{
  "success": false,
  "skillId": "note_summary",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "..."
  }
}
```

## MCP 调用

工具名：`skill.run`

参数：

```json
{
  "skillId": "note_summary",
  "params": {
    "notePath": "inbox/today.md",
    "mode": "short"
  }
}
```

## 代码调用

```ts
import { createAgentSkills } from "agentskills-obsidianmcp";

const agentSkills = createAgentSkills();
const result = await agentSkills.run("note_translate", {
  text: "你好，世界",
  targetLanguage: "en"
});
```

## CLI 调用

```bash
npm run skill <skillId> --key=value --arr=a,b,c
```

示例：

```bash
npm run skill batch_note_tag --folderPath=inbox --tags=ai,knowledge --mode=append
```

## 技能文档索引

完整技能文档见 `docs/skills/`。
