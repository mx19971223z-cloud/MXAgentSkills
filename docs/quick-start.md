# 快速开始

## 1. 安装依赖

```bash
npm install
```

## 2. 环境配置

复制 `.env.example` 为 `.env`，至少配置：

```env
OBSIDIAN_VAULT_PATH=D:/Knowledge/MyVault
```

可选配置：

- 本地 LLM：`OLLAMA_BASE_URL`、`OLLAMA_MODEL`
- 云端兜底：`OPENAI_API_KEY`、`OPENAI_MODEL`

## 3. 构建与运行

```bash
npm run build
npm run mcp
```

## 4. 一行调用

### MCP

```text
skill.run("note_summary", { notePath: "inbox/today.md", mode: "short" })
```

### 代码

```ts
import { createAgentSkills } from "agentskills-obsidianmcp";

const agentSkills = createAgentSkills();
const result = await agentSkills.run("rag_note_search", { query: "MCP 工具路由" });
console.log(result.data);
```

### CLI

```bash
npm run skill rag_local_qa --question="如何构建 Obsidian MCP 技能系统？"
```

## 5. Docker 一键部署

```bash
npm run docker:up
```

查看日志：

```bash
npm run docker:logs
```

停止服务：

```bash
npm run docker:down
```

更多说明见 `docs/docker-deploy.md`。
