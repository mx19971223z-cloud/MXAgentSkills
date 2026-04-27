import fs from "node:fs/promises";
import path from "node:path";

import { ValidationError } from "../../core/errors.js";
import type { AppConfig, VaultService } from "../../core/types.js";

/**
 * File-system based Obsidian vault access service.
 */
export class FileVaultService implements VaultService {
  private readonly vaultPath: string;

  public constructor(config: AppConfig) {
    this.vaultPath = config.vaultPath;
  }

  public resolvePath(inputPath: string): string {
    const absolute = path.isAbsolute(inputPath) ? inputPath : path.join(this.vaultPath, inputPath);
    const normalized = path.normalize(absolute);

    if (!normalized.startsWith(path.normalize(this.vaultPath))) {
      throw new ValidationError("Path escapes vault root.", { inputPath });
    }

    return normalized;
  }

  public async readNote(notePath: string): Promise<string> {
    const resolved = this.resolvePath(notePath);
    return fs.readFile(resolved, "utf8");
  }

  public async writeNote(notePath: string, content: string): Promise<void> {
    const resolved = this.resolvePath(notePath);
    await fs.writeFile(resolved, content, "utf8");
  }

  public async appendNote(notePath: string, content: string): Promise<void> {
    const resolved = this.resolvePath(notePath);
    await fs.appendFile(resolved, content, "utf8");
  }

  public async listMarkdownFiles(folderPath?: string): Promise<string[]> {
    const resolvedRoot = this.resolvePath(folderPath ?? ".");
    const result: string[] = [];

    await this.walkMarkdownFiles(resolvedRoot, result);

    return result.map((item) => path.relative(this.vaultPath, item).replaceAll("\\", "/"));
  }

  public async renameNote(oldPath: string, newPath: string): Promise<void> {
    const oldResolved = this.resolvePath(oldPath);
    const newResolved = this.resolvePath(newPath);
    await fs.mkdir(path.dirname(newResolved), { recursive: true });
    await fs.rename(oldResolved, newResolved);
  }

  public async ensureDir(folderPath: string): Promise<void> {
    const resolved = this.resolvePath(folderPath);
    await fs.mkdir(resolved, { recursive: true });
  }

  private async walkMarkdownFiles(folderPath: string, result: string[]): Promise<void> {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(folderPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name.startsWith(".")) {
            return;
          }

          await this.walkMarkdownFiles(fullPath, result);
          return;
        }

        if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
          result.push(fullPath);
        }
      })
    );
  }
}
