# Roast Creation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full roast creation flow: user submits code → OpenAI analysis → save to DB → display results at /roast/[id]

**Architecture:** 
- OpenAI SDK for API calls (gpt-4o-mini, non-streaming)
- tRPC mutation to create roast, query to fetch results
- JSONB column in code_submissions table for analysis data
- Frontend: connect editor button to mutation, update roast page to fetch real data

**Tech Stack:** Next.js 16, tRPC, Drizzle, OpenAI SDK, Tailwind v4

---

## File Structure

```
src/
├── lib/
│   └── openai.ts          # NEW: OpenAI client singleton
├── server/trpc/
│   └── routers/
│       └── app.ts         # MODIFY: add createRoast mutation + getRoastById query
├── db/
│   ├── schema/
│   │   └── code-submissions.ts  # MODIFY: add analysis column
│   └── queries/
│       └── submissions.ts       # MODIFY: add createSubmissionWithAnalysis, getSubmissionById
├── app/
│   ├── home-editor.tsx         # MODIFY: connect button to mutation
│   └── roast/[id]/
│       └── page.tsx            # MODIFY: fetch real data via tRPC
```

---

## Chunk 1: Database Schema & OpenAI Setup

### Task 1: Install OpenAI SDK

- [ ] **Step 1: Install dependency**

Run: `pnpm add openai`
Expected: Package added to package.json

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add openai dependency"
```

---

### Task 2: Add analysis column to database schema

**Files:**
- Modify: `src/db/schema/code-submissions.ts`

- [ ] **Step 1: Add analysis column to schema**

Current schema:
```typescript
export const codeSubmissions = pgTable("code_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull(),
  language: programmingLanguageEnum("language").notNull(),
  roastMode: roastModeEnum("roast_mode").notNull().default("full"),
  score: decimal("score", { precision: 3, scale: 1 }),
  lineCount: integer("line_count").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

Add analysis column:
```typescript
import { jsonb } from "drizzle-orm/pg-core";

// Add after createdAt line:
analysis: jsonb("analysis"),
```

- [ ] **Step 2: Generate migration**

Run: `pnpm drizzle-kit generate`
Expected: Migration file created in drizzle/ folder

- [ ] **Step 3: Run migration**

Run: `pnpm db:push`
Expected: Table updated with new column

- [ ] **Step 4: Commit**

```bash
git add drizzle/ src/db/schema/
git commit -m "feat: add analysis column to code_submissions"
```

---

### Task 3: Create OpenAI client

**Files:**
- Create: `src/lib/openai.ts`

- [ ] **Step 1: Write OpenAI client**

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/openai.ts
git commit -m "feat: add OpenAI client singleton"
```

---

## Chunk 2: Database Queries

### Task 4: Update database queries

**Files:**
- Modify: `src/db/queries/submissions.ts`

- [ ] **Step 1: Add types for analysis**

Add after existing types:
```typescript
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
```

- [ ] **Step 2: Update createSubmission to include analysis**

Current function:
```typescript
export async function createSubmission(input: CreateSubmissionInput) {
  const result = await db.execute<{ id: string }>(
    sql`INSERT INTO code_submissions (code, language, roast_mode, line_count)
    VALUES (${input.code}, ${input.language}, ${input.roastMode}, ${input.lineCount})
    RETURNING id`
  );
  return result.rows[0];
}
```

Add overload with analysis:
```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/db/queries/submissions.ts
git commit -m "feat: add createSubmissionWithAnalysis query"
```

---

## Chunk 3: tRPC Router

### Task 5: Add tRPC mutation and query

**Files:**
- Modify: `src/server/trpc/routers/app.ts`

- [ ] **Step 1: Add imports**

```typescript
import { z } from "zod";
import { openai } from "@/lib/openai";
import {
  createSubmissionWithAnalysis,
  getSubmissionById,
  type AnalysisData,
} from "@/db/queries/submissions";
import { programmingLanguageEnum, roastModeEnum } from "@/db/schema/enums";
```

- [ ] **Step 2: Add createRoast mutation**

Add to appRouter:
```typescript
createRoast: baseProcedure
  .input(
    z.object({
      code: z.string().min(1).max(10000),
      language: programmingLanguageEnum,
      roastMode: roastModeEnum.default("full"),
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

    const analysis: AnalysisData = JSON.parse(
      completion.choices[0].message.content
    );

    const result = await createSubmissionWithAnalysis({
      code: input.code,
      language: input.language,
      roastMode: input.roastMode,
      lineCount,
      score: analysis.score,
      analysis,
    });

    return { id: result.id };
  }),
```

- [ ] **Step 3: Add getRoastById query**

Add to appRouter:
```typescript
getRoastById: baseProcedure
  .input(z.object({ id: z.string().uuid() }))
  .query(async ({ input }) => {
    const submission = await getSubmissionById(input.id);
    if (!submission) {
      throw new Error("Roast not found");
    }
    return submission;
  }),
```

- [ ] **Step 4: Commit**

```bash
git add src/server/trpc/routers/app.ts
git commit -m "feat: add createRoast mutation and getRoastById query"
```

---

## Chunk 4: Frontend Integration

### Task 6: Connect home editor to mutation

**Files:**
- Modify: `src/app/home-editor.tsx`

- [ ] **Step 1: Add imports**

```typescript
import { useRouter } from "next/navigation";
import { trpc } from "@/server/trpc/client";
```

- [ ] **Step 2: Add mutation**

Add after useState declarations:
```typescript
const router = useRouter();
const utils = trpc.useUtils();

const createRoast = trpc.createRoast.useMutation({
  onSuccess: ({ id }) => {
    router.push(`/roast/${id}`);
  },
  onError: (error) => {
    alert(error.message);
  },
});
```

- [ ] **Step 3: Add language state**

The CodeEditor already exposes language detection, but we need to track it in HomeEditor.

Add after existing useState:
```typescript
const [language, setLanguage] = useState<"typescript" | "javascript" | "python" | "java" | "go" | "rust" | "cpp" | "csharp" | "php" | "ruby" | "swift" | "kotlin" | "sql" | "html" | "css" | "json" | "yaml" | "markdown" | "bash" | "other">("typescript");
```

- [ ] **Step 4: Pass language handler to CodeEditor**

Update CodeEditor props:
```typescript
<CodeEditor
  value={code}
  onChange={setCode}
  onLimitChange={setIsOverLimit}
  onLanguageChange={(lang) => setLanguage(lang as typeof language)}
  language={language}
  size="default"
/>
```

- [ ] **Step 5: Connect button to mutation**

Change Button onClick:
```typescript
<Button
  variant="primary"
  size="default"
  disabled={isOverLimit || !code.trim() || createRoast.isPending}
  onClick={() => {
    createRoast.mutate({
      code,
      language,
      roastMode: roastMode ? "full" : "light",
    });
  }}
>
  $ roast_my_code
</Button>
```

- [ ] **Step 6: Commit**

```bash
git add src/app/home-editor.tsx
git commit -m "feat: connect roast button to createRoast mutation"
```

---

### Task 7: Update roast page to fetch real data

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Make component client and add tRPC**

Change from server component to client:
```typescript
"use client";

import { use } from "react";
import { trpc } from "@/server/trpc/client";
```

- [ ] **Step 2: Fetch data with tRPC**

Replace hardcoded sample with:
```typescript
function RoastResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: roast, isLoading, error } = trpc.getRoastById.useQuery({ id });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-page flex items-center justify-center">
        <span className="font-mono text-accent-green">Loading...</span>
      </main>
    );
  }

  if (error || !roast) {
    return (
      <main className="min-h-screen bg-bg-page flex flex-col items-center justify-center gap-4">
        <h1 className="font-mono text-accent-red">Roast not found</h1>
        <a href="/" className="font-mono text-accent-green">← Back to home</a>
      </main>
    );
  }

  const analysis = roast.analysis as AnalysisData;
  // ... render with real data
}
```

- [ ] **Step 3: Add type import**

```typescript
import type { AnalysisData } from "@/db/queries/submissions";
```

- [ ] **Step 4: Replace hardcoded data with real data**

Replace SAMPLE_CODE, ISSUES, DIFF_LINES with:
```typescript
const SAMPLE_CODE = roast.code;

const ISSUES = analysis.feedbacks.map((f) => ({
  type: f.severity as "critical" | "good",
  title: f.title,
  description: f.message,
}));

const DIFF_LINES = analysis.diff.map((d) => ({
  variant: d.type as "added" | "removed" | "context",
  prefix: d.type === "added" ? "+ " : d.type === "removed" ? "- " : " ",
  code: d.content,
}));
```

- [ ] **Step 5: Use real score**

Replace ScoreRing with:
```typescript
<ScoreRing score={analysis.score} />
```

- [ ] **Step 6: Update verdict**

Replace hardcoded verdict with:
```typescript
<h1 className="font-code text-xl text-text-primary leading-relaxed">
  "{analysis.verdict}"
</h1>
```

- [ ] **Step 7: Update metadata**

Add dynamic metadata:
```typescript
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Roast #${id.slice(0, 8)} | DevRoast`,
  };
}
```

- [ ] **Step 8: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: fetch real roast data from tRPC"
```

---

## Chunk 5: Final Testing

### Task 8: End-to-end test

- [ ] **Step 1: Run dev server**

Run: `pnpm dev`
Expected: Server starts on localhost:3000

- [ ] **Step 2: Test flow**

1. Open http://localhost:3000
2. Paste some code in editor
3. Click "roast_my_code" button
4. Should redirect to /roast/[uuid]
5. Should display real analysis from OpenAI

- [ ] **Step 3: Test error cases**

1. Empty code - should show validation error
2. Non-existent roast ID - should show "Roast not found"

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: complete roast creation feature"
```

---

## Verification

Run these commands to verify:

```bash
pnpm lint    # Should pass
pnpm build   # Should build successfully
pnpm dev     # Should start without errors
```

---

**Plan complete.** Ready to execute?
