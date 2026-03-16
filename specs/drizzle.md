# Drizzle ORM Specification

## Overview

Database schema specification for DevRoast MVP with PostgreSQL and Drizzle ORM.

## Stack

- **Database**: PostgreSQL 16 (via Docker Compose)
- **ORM**: Drizzle ORM
- **Migration**: Drizzle Kit

---

## Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Enums

### roast_mode

Mode selection for roast intensity.

```typescript
export const roastModeEnum = pgEnum("roast_mode", ["full", "light"]);
```

| Value | Description |
|-------|-------------|
| `full` | Brutal roast mode - maximum sarcasm |
| `light` | Gentle feedback mode - constructive only |

### feedback_severity

Severity level for feedback items.

```typescript
export const feedbackSeverityEnum = pgEnum("feedback_severity", [
  "critical",
  "warning",
  "good",
  "info",
]);
```

| Value | Description |
|-------|-------------|
| `critical` | Major issue that must be fixed |
| `warning` | Should be addressed |
| `good` | Good practice to maintain |
| `info` | Informational note |

### programming_language

Supported programming languages for syntax highlighting.

```typescript
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
```

### diff_line_type

Type of line in a diff block.

```typescript
export const diffLineTypeEnum = pgEnum("diff_line_type", [
  "added",
  "removed",
  "context",
]);
```

| Value | Description |
|-------|-------------|
| `added` | Line added (+) |
| `removed` | Line removed (-) |
| `context` | Unchanged line |

---

## Tables

### code_submissions

Main table for storing code submissions/roasts. This is the core entity of the application.

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

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key` | Unique identifier |
| `code` | `text` | `not null` | Submitted code content |
| `language` | `programming_language` | `not null` | Programming language |
| `roast_mode` | `roast_mode` | `not null default 'full'` | Roast mode selection |
| `score` | `decimal(3,1)` | | Calculated score (0-10) |
| `line_count` | `integer` | `not null` | Number of lines in code |
| `created_at` | `timestamp` | `not null default now()` | Submission timestamp |

### feedbacks

Detailed feedback cards for each submission. Each submission can have multiple feedback items.

```typescript
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key` | Unique identifier |
| `submission_id` | `uuid` | `foreign key` → code_submissions.id | Parent submission |
| `line_number` | `integer` | | Line number in code (optional) |
| `severity` | `feedback_severity` | `not null` | Issue severity |
| `title` | `text` | `not null` | Feedback title |
| `message` | `text` | `not null` | Detailed feedback message |

### diff_lines

Diff lines showing code changes (old → improved). Each submission can have multiple diff lines.

```typescript
export const diffLines = pgTable("diff_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  submissionId: uuid("submission_id")
    .notNull()
    .references(() => codeSubmissions.id, { onDelete: "cascade" }),
  lineNumber: integer("line_number").notNull(),
  type: diffLineTypeEnum("type").notNull(),
  content: text("content").notNull(),
});
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | `primary key` | Unique identifier |
| `submission_id` | `uuid` | `foreign key` → code_submissions.id | Parent submission |
| `line_number` | `integer` | `not null` | Line number in diff |
| `type` | `diff_line_type` | `not null` | added/removed/context |
| `content` | `text` | `not null` | Line content |

---

## Relationships

```
code_submissions 1──∞ feedbacks
code_submissions 1──∞ diff_lines
```

- One `code_submission` has many `feedbacks`
- One `code_submission` has many `diff_lines`
- Deleting a submission cascades to delete its feedbacks and diff_lines

---

## Indexes

```typescript
export const codeSubmissionsScoreIdx = index("code_submissions_score_idx")
  .on(codeSubmissions.score)
  .nullsLast();

export const codeSubmissionsCreatedAtIdx = index("code_submissions_created_at_idx")
  .on(codeSubmissions.createdAt)
  .sort("desc");

export const feedbacksSubmissionIdIdx = index("feedbacks_submission_id_idx")
  .on(feedbacks.submissionId);

export const diffLinesSubmissionIdIdx = index("diff_lines_submission_id_idx")
  .on(diffLines.submissionId);
```

---

## To-Do List

- [ ] Create `docker-compose.yml` for PostgreSQL
- [ ] Install Drizzle dependencies:
  - `pnpm add drizzle-orm pg`
  - `pnpm add -D drizzle-kit @types/pg`
- [ ] Create `drizzle.config.ts`
- [ ] Create database connection in `src/db/index.ts`
- [ ] Define schemas in `src/db/schema/index.ts`:
  - [ ] `src/db/schema/enums.ts`
  - [ ] `src/db/schema/code-submissions.ts`
  - [ ] `src/db/schema/feedbacks.ts`
  - [ ] `src/db/schema/diff-lines.ts`
- [ ] Run migration: `pnpm drizzle-kit push`
- [ ] Create typed queries in `src/db/queries/`
- [ ] Create repository functions:
  - [ ] `createSubmission(data)`
  - [ ] `getSubmissionById(id)`
  - [ ] `getLeaderboard(limit, offset)`
  - [ ] `createFeedback(submissionId, data)`
  - [ ] `createDiffLines(submissionId, lines[])`
- [ ] Set up environment variables:
  - `DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast`

---

## Environment Variables

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## Dependencies

```bash
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit @types/pg
```

---

## File Structure

```
src/db/
├── index.ts           # Database connection
├── schema/
│   ├── index.ts       # Re-exports all schemas
│   ├── enums.ts       # All enums
│   ├── code-submissions.ts
│   ├── feedbacks.ts
│   └── diff-lines.ts
└── queries/
    ├── submissions.ts
    ├── feedbacks.ts
    └── diff-lines.ts
```
