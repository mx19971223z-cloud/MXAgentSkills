import type { SkillHandler } from "../core/types.js";

interface Input {
  notePath: string;
}

interface GraphNode {
  id: string;
  label: string;
  type: "heading" | "entity";
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

/**
 * knowledge_graph_extract: parse nodes and relations from one note.
 */
export const knowledgeGraphExtractSkill: SkillHandler<Input, { nodes: GraphNode[]; edges: GraphEdge[] }> = {
  doc: {
    skillId: "knowledge_graph_extract",
    title: "知识图谱提取",
    description: "从单篇笔记中提取节点与关系，输出 JSON 图谱结构。",
    useCases: ["图谱分析", "关系挖掘", "知识库可视化"],
    inputSchema: {
      type: "object",
      properties: {
        notePath: { type: "string", description: "目标笔记路径" }
      },
      required: ["notePath"]
    },
    outputSchema: {
      type: "object",
      properties: {
        nodes: { type: "string", description: "图谱节点数组（JSON 序列）" },
        edges: { type: "string", description: "图谱关系数组（JSON 序列）" }
      }
    },
    example: {
      mcp: 'skill.run("knowledge_graph_extract", { notePath: "research/agent.md" })',
      code: 'agentSkills.run("knowledge_graph_extract", { notePath })',
      cli: "npm run skill knowledge_graph_extract --notePath=research/agent.md"
    }
  },
  async run(context, input) {
    const content = await context.vault.readNote(input.notePath);
    const lines = content.split(/\r?\n/);

    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    const headingNodes = lines
      .filter((line) => line.startsWith("#"))
      .map((line, index) => ({
        id: `heading_${index + 1}`,
        label: line.replace(/^#+\s*/, "").trim(),
        type: "heading" as const
      }));

    nodes.push(...headingNodes);

    const entities = Array.from(new Set(content.match(/\b[A-Z][a-zA-Z]{2,}\b/g) ?? [])).slice(0, 20);

    entities.forEach((entity, index) => {
      const nodeId = `entity_${index + 1}`;
      nodes.push({ id: nodeId, label: entity, type: "entity" });

      if (headingNodes.length > 0) {
        edges.push({
          source: headingNodes[index % headingNodes.length]!.id,
          target: nodeId,
          relation: "contains"
        });
      }
    });

    return { nodes, edges };
  }
};
