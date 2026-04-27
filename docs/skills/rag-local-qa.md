# rag_local_qa

- 技能ID: `rag_local_qa`
- 功能说明: 基于本地 Obsidian 知识库进行私有化问答。
- 入参格式:

```json
{
  "question": "如何设计 MCP 技能注册中心？",
  "topK": 5
}
```

- 出参格式:

```json
{
  "answer": "... [1] ...",
  "citations": ["architecture/skills.md", "notes/mcp.md"]
}
```

- 调用示例:

```text
npm run skill rag_local_qa --question="如何做本地RAG？"
```

- 使用场景: 私有知识问答、知识核验、助手对话。
