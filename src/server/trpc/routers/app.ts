import { z } from "zod";
import {
  type AnalysisData,
  type CodeSubmissionRow,
  createSubmissionWithAnalysis,
  getLeaderboard as getLeaderboardDb,
  getStats as getStatsDb,
  getSubmissionById,
} from "@/db/queries/submissions";
import { openai } from "@/lib/openai";
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
  "verdict": "A sarcastic, creative insult about the code quality",
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
      "content": "The code line"
    }
  ]
}

Be harsh but fair. Focus on real issues.`
          : `You are a supportive code mentor. Analyze the code and provide constructive feedback in JSON format.

Score: 0-10 where 0 = needs work, 10 = excellent code.

Your response must be valid JSON with this exact structure:
{
  "verdict": "An encouraging but honest assessment",
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
      "content": "The code line"
    }
  ]
}

Be constructive and helpful. Focus on teaching, not insulting.`;

      const userPrompt = `Analyze this ${input.language} code:

\`\`\`${input.language}
${input.code}
\`\`\`

Provide your analysis in the JSON format specified.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(
        completion.choices[0].message.content || "{}"
      ) as AnalysisData;

      const result = await createSubmissionWithAnalysis({
        code: input.code,
        language: input.language as CodeSubmissionRow["language"],
        roastMode: input.roastMode as CodeSubmissionRow["roastMode"],
        lineCount,
        score: analysis.score,
        analysis,
      });

      return { id: result.id };
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
