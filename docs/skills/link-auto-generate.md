# link_auto_generate

- 技能ID: `link_auto_generate`
- 功能说明: 自动匹配知识库现有文件并生成双链建议。
- 入参格式:

```json
{
  "notePath": "inbox/new.md",
  "maxLinks": 6
}
```

- 出参格式:

```json
{
  "linkedContent": "...",
  "links": ["[[MCP]]", "[[Obsidian]]"]
}
```

- 调用示例:

```text
skill.run("link_auto_generate", { notePath: "inbox/new.md" })
```

- 使用场景: 新笔记入库、知识网络连接、双链补全。
