type LogLevel = "debug" | "info" | "warn" | "error";

const levelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

export class Logger {
  private readonly level: LogLevel;

  public constructor(level: LogLevel) {
    this.level = level;
  }

  public debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  public error(message: string, data?: unknown): void {
    this.log("error", message, data);
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (levelWeight[level] < levelWeight[this.level]) {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    // Structured JSON log for easier observability integration.
    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }
}
