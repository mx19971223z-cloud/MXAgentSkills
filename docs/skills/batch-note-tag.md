# batch_note_tag

- 技能ID: `batch_note_tag`
- 功能说明: 批量添加或替换标签。
- 入参格式:

```json
{
  "folderPath": "inbox",
  "tags": ["ai", "obsidian"],
  "mode": "append"
}
```

- 出参格式:

```json
{
  "updatedFiles": ["inbox/a.md", "inbox/b.md"]
}
```

- 调用示例:

```text
skill.run("batch_note_tag", { folderPath: "inbox", tags: ["ai", "knowledge"], mode: "append" })
```

- 使用场景: 标签治理、主题归档、批量分类。
