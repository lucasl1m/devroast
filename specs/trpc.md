# tRPC Specification

## Overview

Type-safe API layer for Next.js App Router with Server Components support.

---

## Requirements

1. **Type-safe API** - End-to-end type safety between backend and frontend
2. **Server Components** - Prefetch queries em Server Components
3. **Client Components** - Hooks para Client Components
4. **Zod validation** - Input validation com Zod

---

## Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod server-only
```

---

## File Structure

```
src/
├── app/api/trpc/[trpc]/route.ts   # API route handler
└── server/trpc/
    ├── init.ts                    # tRPC init + context
    ├── query-client.ts            # QueryClient factory
    ├── client.tsx                 # Client Provider
    ├── server.tsx                # Server helpers (RSC)
    └── routers/
        └── app.ts                # Main router
```

---

## Implementation

### 1. Install deps

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod server-only
```

### 2. Create `src/server/trpc/init.ts`

```typescript
import { initTRPC } from '@trpc/server';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  return { userId: null };
});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
```

### 3. Create `src/server/trpc/query-client.ts`

```typescript
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}
```

### 4. Create `src/server/trpc/routers/app.ts`

```typescript
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({ greeting: `hello ${input.text}` })),
});

export type AppRouter = typeof appRouter;
```

### 5. Create API route `src/app/api/trpc/[trpc]/route.ts`

```typescript
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '~/server/trpc/init';
import { appRouter } from '~/server/trpc/routers/app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 6. Create Client Provider `src/server/trpc/client.tsx`

```typescript
'use client';

import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/app';

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  return (clientQueryClientSingleton ??= makeQueryClient());
}

function getUrl() {
  if (typeof window !== 'undefined') return '';
  return `http://localhost:3000/api/trpc`;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: getUrl() })],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 7. Create Server helpers `src/server/trpc/server.tsx`

```typescript
import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/app';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers(caller, getQueryClient);
```

### 8. Wrap app with Provider in `src/app/layout.tsx`

```typescript
import { TRPCProvider } from '~/server/trpc/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

---

## Usage

### Server Component (prefetch)

```typescript
import { trpc, HydrateClient } from '~/server/trpc/server';

export default async function Page() {
  void trpc.hello.prefetch({ text: 'world' });
  return <HydrateClient>...</HydrateClient>;
}
```

### Client Component (hook)

```typescript
import { trpc } from '~/server/trpc/client';

export function ClientComponent() {
  const { data } = trpc.hello.useQuery({ text: 'world' });
  return <div>{data?.greeting}</div>;
}
```

### Mutation

```typescript
const mutation = trpc.createSubmission.useMutation();
mutation.mutate({ code: '...', language: 'typescript' });
```

---

## Answers

1. **Framework**: Next.js App Router (Next.js 16)
2. **SSR**: Sim, com prefetch + HydrateClient
3. **Validation**: Zod
4. **State**: TanStack React Query (v5)
