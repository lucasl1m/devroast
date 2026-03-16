import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { codeSubmissions } from "./code-submissions";
import { feedbackSeverityEnum } from "./enums";

export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => codeSubmissions.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number"),
  severity: feedbackSeverityEnum("severity").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
});
