import { z } from "zod";
import {
  type AnalysisData,
  type CodeSubmissionRow,
  createSubmissionWithAnalysis,
  getLeaderboard as getLeaderboardDb,
  getStats as getStatsDb,
  getSubmissionById,
} from "@/db/queries/submissions";
import { generateRoast } from "@/lib/openai";
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    return getStatsDb();
  }),
  getWorstSubmissions: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(3),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      return getLeaderboardDb(input.limit, input.offset);
    }),
  createRoast: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.enum([
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
          "scss",
          "json",
          "yaml",
          "markdown",
          "bash",
          "shell",
          "plaintext",
          "other",
        ]),
        roastMode: z.enum(["full", "light"]).default("full"),
      })
    )
    .mutation(async ({ input }) => {
      const lineCount = input.code.split("\n").length;

      const systemPrompt =
        input.roastMode === "full"
          ? `You are a brutal but constructive code reviewer. Analyze the code and provide feedback in JSON format.

Score: 0-10 where 0 = terrible code, 10 = perfect code.

Your response must be valid JSON with this exact structure:
{
  "verdict": "A SHORT sarcastic roast (MAX 50 characters)",
  "score": number,
  "feedbacks": [
    {
      "lineNumber": number | null,
      "severity": "critical" | "warning" | "good" | "info",
      "title": "Short title of the issue",
      "message": "Detailed explanation"
    }
  ],
  "diff": [
    {
      "lineNumber": number,
      "type": "added" | "removed" | "context",
      "content": "The code line (include ALL lines - use 'context' for unchanged lines, 'added' for new lines, 'removed' for deleted lines)"
    }
  ]
}

IMPORTANT: 
- The verdict MUST be MAX 50 characters. Be creative but brief.
- The diff must include ALL lines from the original code. Use type "context" for lines that are NOT changed, "added" for new lines, and "removed" for deleted lines. Show the complete improved code as a unified diff.

Be harsh but fair. Focus on real issues.`
          : `You are a supportive code mentor. Analyze the code and provide constructive feedback in JSON format.

Score: 0-10 where 0 = needs work, 10 = excellent code.

Your response must be valid JSON with this exact structure:
{
  "verdict": "A SHORT encouraging message (MAX 50 characters)",
  "score": number,
  "feedbacks": [
    {
      "lineNumber": number | null,
      "severity": "critical" | "warning" | "good" | "info",
      "title": "Short title of the issue",
      "message": "Detailed explanation"
    }
  ],
  "diff": [
    {
      "lineNumber": number,
      "type": "added" | "removed" | "context",
      "content": "The code line (include ALL lines - use 'context' for unchanged lines, 'added' for new lines, 'removed' for deleted lines)"
    }
  ]
}

IMPORTANT: 
- The verdict MUST be MAX 50 characters.
- The diff must include ALL lines from the original code. Use type "context" for lines that are NOT changed, "added" for new lines, and "removed" for deleted lines. Show the complete improved code as a unified diff.

Be constructive and helpful. Focus on teaching, not insulting.`;

      const userPrompt = `Analyze this ${input.language} code:

\`\`\`${input.language}
${input.code}
\`\`\`

Provide your analysis in the JSON format specified.`;

      const responseText = await generateRoast(systemPrompt, userPrompt);

      const analysis = JSON.parse(responseText || "{}") as AnalysisData;

      const submission = await createSubmissionWithAnalysis({
        code: input.code,
        language: input.language as CodeSubmissionRow["language"],
        roastMode: input.roastMode as CodeSubmissionRow["roastMode"],
        lineCount,
        score: analysis.score,
        analysis,
      });

      return { id: submission.id };
    }),
  getRoastById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const submission = await getSubmissionById(input.id);
      if (!submission) {
        throw new Error("Roast not found");
      }
      return submission;
    }),
});

export type AppRouter = typeof appRouter;
