# batch_note_rename

- 技能ID: `batch_note_rename`
- 功能说明: 批量规范化笔记文件名（slug/date-prefix）。
- 入参格式:

```json
{
  "folderPath": "inbox",
  "strategy": "slug"
}
```

- 出参格式:

```json
{
  "renamed": [
    { "from": "inbox/Old Name.md", "to": "inbox/old-name.md" }
  ]
}
```

- 调用示例:

```text
agentSkills.run("batch_note_rename", { folderPath: "inbox", strategy: "slug" })
```

- 使用场景: 历史清理、命名治理、目录标准化。
