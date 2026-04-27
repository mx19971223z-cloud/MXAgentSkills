import { createAgentSkills } from "./create-agent-skills.js";

export { createAgentSkills };

if (import.meta.url === `file://${process.argv[1]}`) {
  const engine = createAgentSkills();
  const docs = engine.listSkills();
  process.stdout.write(`AgentSkills loaded: ${docs.length} skills.\n`);
}
