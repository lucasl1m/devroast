import type { InferSelectModel } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "../index";
import type { codeSubmissions } from "../schema";

export type CodeSubmissionRow = InferSelectModel<typeof codeSubmissions>;

export type CreateSubmissionInput = {
  code: string;
  language: CodeSubmissionRow["language"];
  roastMode: CodeSubmissionRow["roastMode"];
  lineCount: number;
};

export type AnalysisData = {
  score: number;
  verdict: string;
  feedbacks: Array<{
    lineNumber: number | null;
    severity: "critical" | "warning" | "good" | "info";
    title: string;
    message: string;
  }>;
  diff: Array<{
    lineNumber: number;
    type: "added" | "removed" | "context";
    content: string;
  }>;
};

export async function createSubmission(input: CreateSubmissionInput) {
  const result = await db.execute<{ id: string }>(
    sql`INSERT INTO code_submissions (code, language, roast_mode, line_count)
    VALUES (${input.code}, ${input.language}, ${input.roastMode}, ${input.lineCount})
    RETURNING id`
  );
  return result.rows[0];
}

export async function createSubmissionWithAnalysis(
  input: CreateSubmissionInput & { analysis: AnalysisData; score: number }
) {
  const result = await db.execute<{ id: string }>(
    sql`INSERT INTO code_submissions (code, language, roast_mode, line_count, score, analysis)
    VALUES (${input.code}, ${input.language}, ${input.roastMode}, ${input.lineCount}, ${input.score}, ${JSON.stringify(input.analysis)})
    RETURNING id`
  );
  return result.rows[0];
}

export async function getSubmissionById(id: string) {
  const result = await db.execute<CodeSubmissionRow>(
    sql`SELECT * FROM code_submissions WHERE id = ${id}`
  );
  return result.rows[0];
}

export async function getLeaderboard(limit = 10, offset = 0) {
  const result = await db.execute<CodeSubmissionRow>(
    sql`SELECT id, code, language, roast_mode, score, line_count, created_at
    FROM code_submissions
    WHERE score IS NOT NULL
    ORDER BY score ASC NULLS LAST
    LIMIT ${limit} OFFSET ${offset}`
  );

  const countResult = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*) as count FROM code_submissions WHERE score IS NOT NULL`
  );

  return {
    items: result.rows,
    total: parseInt(countResult.rows[0]?.count || "0", 10),
  };
}

export async function updateSubmissionScore(id: string, score: number) {
  const result = await db.execute<{ id: string }>(
    sql`UPDATE code_submissions
    SET score = ${score}
    WHERE id = ${id}
    RETURNING id`
  );
  return result.rows[0];
}

export async function deleteSubmission(id: string) {
  await db.execute(sql`DELETE FROM code_submissions WHERE id = ${id}`);
}

export async function getStats() {
  const totalResult = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*) as count FROM code_submissions WHERE score IS NOT NULL`
  );

  const avgResult = await db.execute<{ avg: string | null }>(
    sql`SELECT AVG(score::numeric) as avg FROM code_submissions WHERE score IS NOT NULL`
  );

  return {
    totalRoasted: parseInt(totalResult.rows[0]?.count || "0", 10),
    avgScore: parseFloat(avgResult.rows[0]?.avg || "0"),
  };
}
