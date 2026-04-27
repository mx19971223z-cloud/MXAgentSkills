# note_backup

- 技能ID: `note_backup`
- 功能说明: 支持单文件/目录级备份并生成时间戳目录。
- 入参格式:

```json
{
  "targetPath": "inbox",
  "mode": "folder",
  "destinationPath": "backup"
}
```

- 出参格式:

```json
{
  "backupPath": "D:/Knowledge/MyVault/backup/2026-04-27T...",
  "files": 12
}
```

- 调用示例:

```text
agentSkills.run("note_backup", { targetPath: "daily/today.md", mode: "single" })
```

- 使用场景: 误删恢复、版本归档、周期性备份。
