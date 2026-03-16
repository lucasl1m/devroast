import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "../index";
import type { diffLines } from "../schema";

export type DiffLineRow = InferSelectModel<typeof diffLines>;

export type CreateDiffLineInput = {
  submissionId: string;
  lineNumber: number;
  type: DiffLineRow["type"];
  content: string;
};

export async function createDiffLine(input: CreateDiffLineInput) {
  const result = await db.execute<{ id: string }>(
    sql`INSERT INTO diff_lines (submission_id, line_number, type, content)
    VALUES (${input.submissionId}, ${input.lineNumber}, ${input.type}, ${input.content})
    RETURNING id`
  );
  return result.rows[0];
}

export async function createManyDiffLines(lines: CreateDiffLineInput[]) {
  for (const line of lines) {
    await createDiffLine(line);
  }
}

export async function getDiffLinesBySubmissionId(submissionId: string) {
  const result = await db.execute<DiffLineRow>(
    sql`SELECT id, submission_id, line_number, type, content
    FROM diff_lines
    WHERE submission_id = ${submissionId}
    ORDER BY line_number ASC`
  );
  return result.rows;
}

export async function deleteDiffLinesBySubmissionId(submissionId: string) {
  await db.execute(
    sql`DELETE FROM diff_lines WHERE submission_id = ${submissionId}`
  );
}
