import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { codeSubmissions } from "./code-submissions";
import { diffLineTypeEnum } from "./enums";

export const diffLines = pgTable("diff_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => codeSubmissions.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  type: diffLineTypeEnum("type").notNull(),
  content: text("content").notNull(),
});
