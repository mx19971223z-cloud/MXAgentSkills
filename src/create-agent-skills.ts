import { loadConfig } from "./core/config.js";
import { AgentSkillsEngine } from "./core/engine.js";
import { Logger } from "./core/logger.js";
import { SkillRegistry } from "./core/registry.js";
import { HybridLlmService } from "./services/llm/llm-service.js";
import { FileVaultService } from "./services/obsidian/vault-service.js";
import { LocalRagService } from "./services/rag/rag-service.js";
import { registerSkills } from "./skills/register-skills.js";

/**
 * Factory to create a fully wired AgentSkills engine instance.
 */
export function createAgentSkills(): AgentSkillsEngine {
  const config = loadConfig();
  const logger = new Logger(config.logLevel);
  const vault = new FileVaultService(config);
  const rag = new LocalRagService(vault);
  const llm = new HybridLlmService(config);

  const registry = new SkillRegistry();
  registerSkills(registry);

  return new AgentSkillsEngine(registry, {
    config,
    logger,
    llm,
    rag,
    vault
  });
}
