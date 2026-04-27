# AgentSkills - ObsidianMCP 智能体技能引擎

AgentSkills 是一个工业级、模块化、可开源、可直接上线的技能引擎，为 ObsidianMCP 提供开箱即用的标准化技能库。

- 纯本地运行，默认无云依赖
- 支持 MCP / 代码 / CLI 三种统一调用
- 覆盖 Obsidian 笔记处理、知识提取、RAG 问答、批处理、工具增强全场景
- 内置本地 Ollama + 云端 OpenAI 自动适配

## 特性

- TypeScript + Node.js 工程化实现
- 插件化技能架构（Skill Registry + Unified Engine）
- 13 个生产可用标准技能（无空函数、无伪代码）
- 统一日志与异常处理
- FAISS 可选向量检索适配（安装失败自动降级内存检索）
- MIT 协议，可直接二次开发与商用

## 技术栈

- TypeScript / Node.js
- Obsidian API（依赖兼容）
- MCP 协议：@modelcontextprotocol/sdk
- 本地 LLM：Ollama
- 云 LLM：OpenAI SDK
- Markdown：markdown-it
- RAG：FAISS 可选 + 轻量向量回退

## 快速开始

### 1. 安装

```bash
npm install
```

### 2. 配置环境

复制 `.env.example` 到 `.env` 并填写：

- `OBSIDIAN_VAULT_PATH` 必填
- `OLLAMA_*` 可选（本地模型）
- `OPENAI_*` 可选（云模型兜底）

### 3. 构建

```bash
npm run build
```

### 4. 运行方式

1. MCP Server（给 ObsidianMCP 调度）：

```bash
npm run mcp
```

2. CLI 调用单技能：

```bash
npm run skill note_summary --notePath=inbox/today.md --mode=short
```

3. 代码调用：

```ts
import { createAgentSkills } from "agentskills-obsidianmcp";

const agentSkills = createAgentSkills();
const result = await agentSkills.run("note_summary", { notePath: "inbox/today.md" });
console.log(result);
```

## 统一调用规范

### MCP 调用

```text
skill.run(skillId, params)
```

### 代码调用

```text
agentSkills.run("skillID", { params })
```

### CLI 调用

```text
npm run skill <skillID> --参数=值
```

## 技能清单（13）

| 场景 | Skill ID | 功能 |
|---|---|---|
| 笔记处理 | note_summary | 自动总结（长/短） |
| 笔记处理 | note_keyword_extract | 关键词/实体提取 |
| 笔记处理 | note_auto_format | Markdown 自动排版 |
| 双链图谱 | link_auto_generate | 自动双链关联 |
| 双链图谱 | knowledge_graph_extract | 图谱节点与关系提取 |
| 本地 RAG | rag_local_qa | 私有知识问答 |
| 本地 RAG | rag_note_search | 语义检索 TopN |
| 内容增强 | note_continue_write | 自动续写并追加 |
| 内容增强 | note_translate | 中英日德翻译 |
| 批处理 | batch_note_rename | 批量规范命名 |
| 批处理 | batch_note_tag | 批量标签处理 |
| 工具增强 | md_to_pdf | Markdown 转 PDF |
| 工具增强 | note_backup | 单/批量备份 |

每个技能的详细文档见 `docs/skills/`。

## 与 ObsidianMCP 对接

本项目内置 MCP 桥接模块，暴露统一工具：

- 工具名：`skill.run`
- 参数：`{ skillId: string, params?: object }`

ObsidianMCP 直接调度，无需二次开发。

## 工程结构

```text
src/
  core/                # 引擎核心（配置/错误/日志/注册/执行）
  services/            # 通用服务（Vault/LLM/RAG/Markdown）
  skills/              # 13 个技能实现
  cli/                 # 命令行入口
  mcp/                 # MCP 服务入口
  create-agent-skills.ts
  index.ts

docs/
  quick-start.md
  skill-call-manual.md
  skills-manifest.md
  skills/*.md
```

## 开源与贡献

- 协议：MIT（见 LICENSE）
- 贡献指南：见 CONTRIBUTING.md

## 生产部署建议

- 使用 PM2/Systemd 托管 `npm run mcp`
- 使用 Docker 容器化部署（建议挂载 Obsidian Vault 目录）
- 对接企业日志系统收集 JSON 日志

