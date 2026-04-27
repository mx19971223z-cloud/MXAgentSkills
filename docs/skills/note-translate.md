# note_translate

- 技能ID: `note_translate`
- 功能说明: 笔记内容多语言翻译（中/英/日/德）。
- 入参格式:

```json
{
  "text": "你好，世界",
  "targetLanguage": "en"
}
```

- 出参格式:

```json
{
  "translatedText": "Hello, world"
}
```

- 调用示例:

```text
npm run skill note_translate --text='你好，世界' --targetLanguage=en
```

- 使用场景: 双语文档、国际化协作、内容复用。
