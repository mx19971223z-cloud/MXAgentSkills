import type { SkillRegistry } from "../core/registry.js";

import { batchNoteRenameSkill } from "./batch-note-rename.js";
import { batchNoteTagSkill } from "./batch-note-tag.js";
import { knowledgeGraphExtractSkill } from "./knowledge-graph-extract.js";
import { linkAutoGenerateSkill } from "./link-auto-generate.js";
import { mdToPdfSkill } from "./md-to-pdf.js";
import { noteAutoFormatSkill } from "./note-auto-format.js";
import { noteBackupSkill } from "./note-backup.js";
import { noteContinueWriteSkill } from "./note-continue-write.js";
import { noteKeywordExtractSkill } from "./note-keyword-extract.js";
import { noteSummarySkill } from "./note-summary.js";
import { noteTranslateSkill } from "./note-translate.js";
import { ragLocalQaSkill } from "./rag-local-qa.js";
import { ragNoteSearchSkill } from "./rag-note-search.js";

/**
 * Registers all built-in skills into registry.
 */
export function registerSkills(registry: SkillRegistry): void {
  registry.register(noteSummarySkill);
  registry.register(noteKeywordExtractSkill);
  registry.register(noteAutoFormatSkill);
  registry.register(linkAutoGenerateSkill);
  registry.register(knowledgeGraphExtractSkill);
  registry.register(ragLocalQaSkill);
  registry.register(ragNoteSearchSkill);
  registry.register(noteContinueWriteSkill);
  registry.register(noteTranslateSkill);
  registry.register(batchNoteRenameSkill);
  registry.register(batchNoteTagSkill);
  registry.register(mdToPdfSkill);
  registry.register(noteBackupSkill);
}
