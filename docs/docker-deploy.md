# Docker 一键部署

## 前置条件

- 已安装 Docker 与 Docker Compose
- 本地已有 Obsidian Vault 目录
- 可选：本地 Ollama 服务可访问

## 1. 配置环境变量

在项目根目录创建 `.env`，至少配置以下变量：

```env
OBSIDIAN_VAULT_HOST_PATH=D:/Knowledge/MyVault
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=qwen2.5:7b
LOG_LEVEL=info
```

可选云端兜底：

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=gpt-4o-mini
```

## 2. 一键启动

```bash
docker compose up -d --build
```

## 3. 查看日志

```bash
docker compose logs -f agentskills
```

## 4. 一键停止

```bash
docker compose down
```

## 说明

- 容器默认启动 MCP 服务入口：`node dist/mcp/server.js`
- 容器内 Vault 路径固定为 `/data/vault`
- 通过挂载卷把宿主机 Vault 映射到容器内路径
