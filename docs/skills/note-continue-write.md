# note_continue_write

- 技能ID: `note_continue_write`
- 功能说明: 根据已有内容自动续写并追加到原文。
- 入参格式:

```json
{
  "notePath": "writing/idea.md",
  "hint": "补充实现步骤"
}
```

- 出参格式:

```json
{
  "appended": "...",
  "notePath": "writing/idea.md"
}
```

- 调用示例:

```text
skill.run("note_continue_write", { notePath: "writing/idea.md", hint: "技术路线" })
```

- 使用场景: 草稿续写、结构扩展、思路补全。
