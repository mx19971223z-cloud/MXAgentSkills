import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { createAgentSkills } from "../create-agent-skills.js";
import type { SkillId } from "../core/types.js";

/**
 * MCP bridge server exposing skill.run for ObsidianMCP.
 */
export async function startMcpServer(): Promise<void> {
  const agentSkills = createAgentSkills();

  const server = new Server(
    {
      name: "agentskills-obsidianmcp",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: "skill.run",
        description: "Run a registered AgentSkill by id.",
        inputSchema: {
          type: "object",
          properties: {
            skillId: { type: "string", description: "Registered skill id" },
            params: { type: "object", description: "Skill parameters" }
          },
          required: ["skillId"]
        }
      }
    ]
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "skill.run") {
      return {
        content: [{ type: "text", text: `Unsupported tool: ${request.params.name}` }],
        isError: true
      };
    }

    const args = (request.params.arguments ?? {}) as {
      skillId?: SkillId;
      params?: Record<string, unknown>;
    };

    if (!args.skillId) {
      return {
        content: [{ type: "text", text: "Missing required argument: skillId" }],
        isError: true
      };
    }

    const result = await agentSkills.run(args.skillId, args.params ?? {});

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ],
      isError: !result.success
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void startMcpServer();
}
