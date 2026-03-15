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
```
