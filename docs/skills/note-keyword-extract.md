# note_keyword_extract

- 技能ID: `note_keyword_extract`
- 功能说明: 提取笔记关键词、实体和核心观点。
- 入参格式:

```json
{
  "content": "...",
  "maxKeywords": 8
}
```

- 出参格式:

```json
{
  "keywords": ["obsidian", "mcp", "agent"]
}
```

- 调用示例:

```text
agentSkills.run("note_keyword_extract", { content })
```

- 使用场景: 自动标签、知识索引、实体提取。
