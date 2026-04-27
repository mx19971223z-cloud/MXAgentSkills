import { SkillNotFoundError } from "./errors.js";
import type { SkillDoc, SkillHandler, SkillId } from "./types.js";

/**
 * In-memory skill registry.
 */
export class SkillRegistry {
  private readonly skills = new Map<SkillId, SkillHandler>();

  public register<TInput, TOutput>(handler: SkillHandler<TInput, TOutput>): void {
    this.skills.set(handler.doc.skillId, handler as SkillHandler);
  }

  public get(skillId: SkillId): SkillHandler {
    const skill = this.skills.get(skillId);

    if (!skill) {
      throw new SkillNotFoundError(skillId);
    }

    return skill;
  }

  public listDocs(): SkillDoc[] {
    return Array.from(this.skills.values()).map((skill) => skill.doc);
  }
}
