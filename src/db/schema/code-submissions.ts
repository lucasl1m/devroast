import {
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { programmingLanguageEnum, roastModeEnum } from "./enums";

export const codeSubmissions = pgTable("code_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: programmingLanguageEnum("language").notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("full"),
  score: decimal("score", { precision: 3, scale: 1 }),
  lineCount: integer("line_count").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
