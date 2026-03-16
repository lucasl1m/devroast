# tRPC Patterns

## Estrutura

```
src/server/trpc/
├── init.ts           # tRPC init + context
├── query-client.ts   # QueryClient factory
├── client.tsx        # Client Provider (use client)
├── server.tsx        # Server helpers (RSC)
└── routers/
    └── app.ts        # Main router
```

## Setup

### 1. Dependencies

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod server-only
```

### 2. init.ts

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

### 3. query-client.ts

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

### 4. routers/app.ts

```typescript
import { baseProcedure, createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  getStats: baseProcedure.query(async () => {
    return getStatsDb();
  }),
});

export type AppRouter = typeof appRouter;
```

### 5. API Route

```typescript
// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/server/trpc/init';
import { appRouter } from '@/server/trpc/routers/app';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });

export { handler as GET, handler as POST };
```

### 6. client.tsx

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

let clientQueryClientSingleton: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient();
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = makeQueryClient();
  }
  return clientQueryClientSingleton;
}

function getUrl() {
  return '/api/trpc';
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

### 7. server.tsx

```typescript
import 'server-only';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter, type AppRouter } from './routers/app';

export const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)(createTRPCContext);
export const { trpc, HydrateClient } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
```

## Provider Setup

Adicionar no `src/app/layout.tsx`:

```typescript
import { TRPCProvider } from '@/server/trpc/client';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```

## Usage

### Server Component (prefetch)

```typescript
import { trpc, HydrateClient } from '@/server/trpc/server';

export default async function Page() {
  void trpc.getStats.prefetch();
  return (
    <HydrateClient>
      <ClientComponent />
    </HydrateClient>
  );
}
```

### Client Component (hook)

```typescript
import { trpc } from '@/server/trpc/client';

export function ClientComponent() {
  const { data } = trpc.getStats.useQuery();
  return <div>{data?.totalRoasted}</div>;
}
```

### With placeholderData (for animations)

```typescript
const { data: stats } = trpc.getStats.useQuery(undefined, {
  placeholderData: { totalRoasted: 0, avgScore: 0 },
});
```

## Regras

- Usar `httpBatchLink` com URL `/api/trpc`
- Exportar tipo `AppRouter` do router principal
- Server components usam `trpc` de `@/server/trpc/server`
- Client components usam `trpc` de `@/server/trpc/client`
- Sempre usar `createCallerFactory` para Server helpers
- Adicionar `server-only` no server.tsx
