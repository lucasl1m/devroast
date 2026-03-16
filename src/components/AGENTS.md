# Component Patterns

## Homepage Components

### Estrutura

```
src/components/
├── home-stats.tsx    # Stats com tRPC + NumberFlow
├── home-editor.tsx   # CodeEditor + Toggle (client component)
└── ui/
```

### home-stats.tsx

Componente client que busca dados do tRPC e usa NumberFlow para animação.

```typescript
'use client';

import NumberFlow from '@number-flow/react';
import { trpc } from '@/server/trpc/client';
import { useEffect, useState } from 'react';

export function HomeStats() {
  const { data: stats } = trpc.getStats.useQuery();
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayAvg, setDisplayAvg] = useState(0);

  useEffect(() => {
    if (stats) {
      setDisplayTotal(stats.totalRoasted);
      setDisplayAvg(stats.avgScore);
    }
  }, [stats]);

  return (
    <div className="...">
      <NumberFlow value={displayTotal} ... />
    </div>
  );
}
```

### home-editor.tsx

Componente client para editor de código.

```typescript
'use client';

import { useState } from 'react';
import { Button, CodeEditor, Toggle } from '@/components/ui';

export function HomeEditor() {
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState('');
  const [isOverLimit, setIsOverLimit] = useState(false);

  return (
    <>
      <CodeEditor value={code} onChange={setCode} ... />
      <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
      <Button>roast_my_code</Button>
    </>
  );
}
```

## page.tsx (Server Component)

```typescript
import { HomeEditor } from '@/app/home-editor';
import { HomeStats } from '@/components/home-stats';
import { HydrateClient, trpc } from '@/server/trpc/server';

export default async function HomePage() {
  void trpc.getStats.prefetch();

  return (
    <HydrateClient>
      <main>
        <HomeEditor />
        <div className="w-[316px] mx-auto mb-[60px]">
          <HomeStats />
        </div>
      </main>
    </HydrateClient>
  );
}
```

## Regras

- Server Components: busc dados via tRPC prefetch
- Client Components: usam hooks `trpc.*.useQuery()`
- NumberFlow: usar `useState` + `useEffect` para detectar mudanças e animar
- Separar partes interativas (useState) em componentes client
- Usar `HydrateClient` para hydrar dados do servidor
