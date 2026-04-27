# Contributing Guide

感谢你为 AgentSkills 贡献代码。

## 开发约定

- Node.js >= 20.11
- TypeScript 严格模式
- 所有公开导出需有文档注释
- 变更需通过 `npm run lint` 和 `npm run build`

## 提交流程

1. Fork 并创建功能分支
2. 编写代码与文档
3. 本地执行：

```bash
npm run lint
npm run build
```

4. 提交 Pull Request，描述变更动机、实现细节、验证方法

## 新增技能规范

- 在 `src/skills/` 新增实现文件
- 在 `src/skills/register-skills.ts` 注册
- 在 `docs/skills/` 增加独立文档
- 在 `docs/skills-manifest.md` 更新清单

## 代码风格

- 文件名：kebab-case
- 变量/函数：camelCase
- 类型/接口：PascalCase
- 常量：UPPER_SNAKE_CASE

