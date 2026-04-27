# knowledge_graph_extract

- 技能ID: `knowledge_graph_extract`
- 功能说明: 从单篇笔记提取图谱节点与关系。
- 入参格式:

```json
{
  "notePath": "research/agent.md"
}
```

- 出参格式:

```json
{
  "nodes": [{ "id": "heading_1", "label": "...", "type": "heading" }],
  "edges": [{ "source": "heading_1", "target": "entity_1", "relation": "contains" }]
}
```

- 调用示例:

```text
agentSkills.run("knowledge_graph_extract", { notePath })
```

- 使用场景: 图谱构建、关系分析、可视化准备。
