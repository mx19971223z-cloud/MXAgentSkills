# md_to_pdf

- 技能ID: `md_to_pdf`
- 功能说明: 将 Markdown 笔记导出为本地 PDF。
- 入参格式:

```json
{
  "notePath": "publish/weekly.md",
  "outputPath": "exports/weekly.pdf"
}
```

- 出参格式:

```json
{
  "pdfPath": "D:/Knowledge/MyVault/exports/weekly.pdf"
}
```

- 调用示例:

```text
npm run skill md_to_pdf --notePath=publish/weekly.md --outputPath=exports/weekly.pdf
```

- 使用场景: 报告导出、资料分享、归档留存。
