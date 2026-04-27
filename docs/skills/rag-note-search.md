# rag_note_search

- 技能ID: `rag_note_search`
- 功能说明: 语义检索笔记，返回 TopN 相关结果。
- 入参格式:

```json
{
  "query": "obsidian skill routing",
  "topK": 5
}
```

- 出参格式:

```json
{
  "items": [
    { "notePath": "mcp/route.md", "score": 0.93, "snippet": "..." }
  ]
}
```

- 调用示例:

```text
skill.run("rag_note_search", { query: "本地知识图谱" })
```

- 使用场景: 语义搜索、上下文收集、资料定位。
