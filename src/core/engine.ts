import { AppError } from "./errors.js";
import type { SkillContext, SkillDoc, SkillId, SkillResult } from "./types.js";
import type { SkillRegistry } from "./registry.js";

/**
 * Unified engine entry for code/MCP/CLI invocation.
 */
export class AgentSkillsEngine {
  public constructor(
    private readonly registry: SkillRegistry,
    private readonly context: SkillContext
  ) {}

  public listSkills(): SkillDoc[] {
    return this.registry.listDocs();
  }

  public async run<TData = unknown>(skillId: SkillId, input: Record<string, unknown>): Promise<SkillResult<TData>> {
    try {
      const handler = this.registry.get(skillId);
      const data = await handler.run(this.context, input);

      return {
        success: true,
        skillId,
        data: data as TData
      };
    } catch (error) {
      this.context.logger.error("Skill execution failed", { skillId, input, error });

      if (error instanceof AppError) {
        return {
          success: false,
          skillId,
          error: {
            code: error.code,
            message: error.message,
            details: error.details
          }
        };
      }

      return {
        success: false,
        skillId,
        error: {
          code: "UNKNOWN_ERROR",
          message: error instanceof Error ? error.message : "Unknown error"
        }
      };
    }
  }
}
