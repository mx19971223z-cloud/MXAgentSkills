import { createAgentSkills } from "../create-agent-skills.js";
import type { SkillId } from "../core/types.js";

function parseArgs(argv: string[]): { skillId: string; params: Record<string, unknown> } {
  const [skillId, ...rest] = argv;
  const params: Record<string, unknown> = {};

  for (const token of rest) {
    if (!token.startsWith("--")) {
      continue;
    }

    const [rawKey, ...valueParts] = token.slice(2).split("=");
    const key = (rawKey ?? "").trim();
    const value = valueParts.join("=").trim();

    if (!key) {
      continue;
    }

    params[key] = normalizeValue(value);
  }

  return { skillId: skillId ?? "", params };
}

function normalizeValue(value: string): unknown {
  if (value.includes(",")) {
    return value.split(",").map((item) => item.trim());
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (!Number.isNaN(Number(value)) && value.length > 0) {
    return Number(value);
  }

  return value;
}

async function main(): Promise<void> {
  const engine = createAgentSkills();
  const { skillId, params } = parseArgs(process.argv.slice(2));

  if (!skillId) {
    process.stderr.write("Usage: npm run skill <skillId> --key=value\n");
    process.exitCode = 1;
    return;
  }

  const result = await engine.run(skillId as SkillId, params);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);

  if (!result.success) {
    process.exitCode = 1;
  }
}

void main();
