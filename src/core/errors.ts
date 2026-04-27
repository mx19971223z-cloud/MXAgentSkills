export class AppError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  public constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}

export class SkillNotFoundError extends AppError {
  public constructor(skillId: string) {
    super("SKILL_NOT_FOUND", `Skill '${skillId}' is not registered.`);
    this.name = "SkillNotFoundError";
  }
}

export class ValidationError extends AppError {
  public constructor(message: string, details?: unknown) {
    super("VALIDATION_ERROR", message, details);
    this.name = "ValidationError";
  }
}
