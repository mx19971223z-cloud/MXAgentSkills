# note_summary

- 技能ID: `note_summary`
- 功能说明: 自动总结指定笔记，支持 `short` 与 `long` 模式。
- 入参格式:

```json
{
  "notePath": "inbox/today.md",
  "mode": "short"
}
```

- 出参格式:

```json
{
  "summary": "..."
}
```

- 调用示例:

```text
skill.run("note_summary", { notePath: "inbox/today.md", mode: "short" })
```

- 使用场景: 日报总结、会议纪要提炼、长文速览。
