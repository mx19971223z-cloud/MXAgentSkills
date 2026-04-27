# note_auto_format

- 技能ID: `note_auto_format`
- 功能说明: 自动格式化 Markdown 并覆盖保存。
- 入参格式:

```json
{
  "notePath": "docs/guide.md"
}
```

- 出参格式:

```json
{
  "notePath": "docs/guide.md",
  "changed": true
}
```

- 调用示例:

```text
npm run skill note_auto_format --notePath=docs/guide.md
```

- 使用场景: 文档规范化、发布前清理、批量风格统一。
