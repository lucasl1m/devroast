import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "../index";
import type { feedbacks } from "../schema";

export type FeedbackRow = InferSelectModel<typeof feedbacks>;

export type CreateFeedbackInput = {
  submissionId: string;
  lineNumber?: number;
  severity: FeedbackRow["severity"];
  title: string;
  message: string;
};

export async function createFeedback(input: CreateFeedbackInput) {
  const result = await db.execute<{ id: string }>(
    sql`INSERT INTO feedbacks (submission_id, line_number, severity, title, message)
    VALUES (${input.submissionId}, ${input.lineNumber}, ${input.severity}, ${input.title}, ${input.message})
    RETURNING id`
  );
  return result.rows[0];
}

export async function getFeedbacksBySubmissionId(submissionId: string) {
  const result = await db.execute<FeedbackRow>(
    sql`SELECT id, submission_id, line_number, severity, title, message
    FROM feedbacks
    WHERE submission_id = ${submissionId}
    ORDER BY 
      CASE severity
        WHEN 'critical' THEN 1
        WHEN 'warning' THEN 2
        WHEN 'info' THEN 3
        WHEN 'good' THEN 4
      END`
  );
  return result.rows;
}

export async function deleteFeedbacksBySubmissionId(submissionId: string) {
  await db.execute(
    sql`DELETE FROM feedbacks WHERE submission_id = ${submissionId}`
  );
}
