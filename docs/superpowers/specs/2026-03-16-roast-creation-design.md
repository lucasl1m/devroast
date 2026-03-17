# Roast Creation Feature - Design Spec

## Overview

Implementar o fluxo completo para criação de roasts: usuário cola código na home → análise via OpenAI → salva no banco → exibe resultados em `/roast/[id]`.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Provider | OpenAI | Usuário já tem API key configurada |
| Streaming | No | Análise completa antes de exibir |
| Analysis Storage | JSONB column | Flexível, permite evolução |
| Model | gpt-4o-mini | Melhor custo-benefício |

## Database Schema

A tabela `code_submissions` já existe com as colunas:
- `id` (uuid, PK)
- `code` (text)
- `language` (programming_language enum)
- `roastMode` (roast_mode enum) - **já existe**
- `score` (decimal) - já existe
- `lineCount` (integer)
- `createdAt` (timestamp)

Adicionar apenas a coluna `analysis` (jsonb):

```typescript
analysis: jsonb("analysis").$type<{
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
}>()
```

## tRPC API

### Mutation: `createRoast`

**Input:**
```typescript
{
  code: string;
  language: ProgrammingLanguage;
  roastMode: "full" | "light";
}
```

**Processo:**
1. Valida código (não vazio, dentro do limite de 10k chars)
2. Conta linhas de código
3. Chama OpenAI API com prompt adequado
4. Parseia resposta JSON
5. Salva no banco com score + analysis
6. Retorna `{ id: string }`

**Output:**
```typescript
{ id: string }
```

### Query: `getRoastById`

**Input:**
```typescript
{ id: string }
```

**Output:**
```typescript
{
  id: string;
  code: string;
  language: ProgrammingLanguage;
  roastMode: "full" | "light";
  score: number;
  lineCount: number;
  analysis: {
    verdict: string;
    feedbacks: Array<{...}>;
    diff: Array<{...}>;
  };
  createdAt: Date;
}
```

## Prompt Engineering

### System Prompt - Full Mode (Sarcástico)

```
You are a brutal but constructive code reviewer. Analyze the code and provide feedback in JSON format.

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

Be harsh but fair. Focus on real issues.
```

### System Prompt - Light Mode (Gentil)

```
You are a supportive code mentor. Analyze the code and provide constructive feedback in JSON format.

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

Be constructive and helpful. Focus on teaching, not insulting.
```

### User Prompt

```
Analyze this {language} code:

```{language}
{code}
```

Provide your analysis in the JSON format specified.
```

## Frontend Changes

### `home-editor.tsx`

Conectar botão "roast_my_code" ao tRPC mutation:

```typescript
const router = useRouter();
const createRoast = trpc.createRoast.useMutation({
  onSuccess: ({ id }) => {
    router.push(`/roast/${id}`);
  },
});
```

### `roast/[id]/page.tsx`

Buscar dados via tRPC query:

```typescript
const { data: roast } = trpc.getRoastById.useQuery({ id });
```

Renderizar dados reais (atualmente está hardcoded).

## Error Handling

| Error | Handling |
|-------|----------|
| Empty code | Validate before mutation, show inline error |
| Over limit (10k) | Already handled by CodeEditor |
| Invalid language enum | Validate using zod enum, reject with error message |
| Invalid roastMode | Validate using zod enum ("full" or "light"), reject with error message |
| JSON parse failure | Show toast "Failed to analyze code. Please try again.", do not save |
| API error | Show toast "Service unavailable. Please try again later.", do not save |
| Timeout | Auto-retry max 2x with exponential backoff (1s, 2s), then show error |
| Non-existent roast (404) | Show "Roast not found" page with link to home |

## Components to Modify

1. `src/db/schema/code-submissions.ts` - add analysis column
2. `src/server/trpc/routers/app.ts` - add mutation + query
3. `src/app/home-editor.tsx` - connect button to mutation
4. `src/app/roast/[id]/page.tsx` - fetch real data

## Dependencies

```bash
pnpm add openai
```

## Out of Scope (v1)

- Share roast functionality
- Feedback voting
- User authentication
- Streaming responses
