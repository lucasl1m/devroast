import { pgEnum } from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode", ["full", "light"]);

export const feedbackSeverityEnum = pgEnum("feedback_severity", [
  "critical",
  "warning",
  "good",
  "info",
]);

export const programmingLanguageEnum = pgEnum("programming_language", [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "cpp",
  "csharp",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "bash",
  "other",
]);

export const diffLineTypeEnum = pgEnum("diff_line_type", [
  "added",
  "removed",
  "context",
]);
