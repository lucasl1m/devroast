# DevRoast - Project Standards

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind v4 with CSS variables
- pnpm

## Theme

### Colors
| Tailwind | CSS Variable |
|----------|--------------|
| `bg-bg-page` | `--bg-page` |
| `bg-bg-input` | `--bg-input` |
| `text-text-primary` | `--text-primary` |
| `text-text-secondary` | `--text-secondary` |
| `bg-accent-green` | `--accent-green` |
| `text-accent-red` | `--accent-red` |
| `text-accent-amber` | `--accent-amber` |

### Fonts
- `font-mono` → JetBrains Mono
- `font-code` → IBM Plex Mono

## Conventions

- Named exports only (no `export default`)
- Function components (not arrow functions)
- Use theme variables, never hardcoded colors
- Compound components pattern (e.g., `Card.Header`, `Card.Title`)

## Commands

```bash
pnpm dev      # Dev server
pnpm build    # Production build
pnpm lint     # Biome lint
pnpm format   # Biome format
pnpm db:push  # Drizzle push schema
pnpm db:seed  # Seed database
```

## Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── trpc/          # tRPC API
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # UI components
│   ├── home-stats.tsx     # Stats com tRPC
│   └── home-editor.tsx    # Editor client component
├── server/
│   └── trpc/              # tRPC setup
│       ├── init.ts
│       ├── client.tsx
│       ├── server.tsx
│       ├── query-client.ts
│       └── routers/
└── db/                    # Database
    ├── schema/
    └── queries/
```

## Specs

Specs devem ser criadas em `specs/` antes de implementar features.

Ver `specs/AGENTS.md` para formato de specs.

## tRPC

Ver `src/server/trpc/AGENTS.md` para padrões de tRPC.

## Components

Ver `src/components/AGENTS.md` para padrões de componentes.
