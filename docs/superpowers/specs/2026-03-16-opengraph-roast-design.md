# OpenGraph Image Generation for Roast Results

## Overview

Generate OpenGraph images automatically when roast results are shared on social media (Twitter, Discord, etc.). Uses Takumi library to render JSX to images.

## Goals

- Automatic OG image generation for shared roast URLs
- Match design from frame "Screen 4 - OG Image" (node ID: 4J5QT in devroast.pen)
- Simple implementation without storage requirements

## Architecture

### 1. API Route

Create `/api/og/[id]` route that:
- Receives roast ID from URL
- Fetches roast data directly from database using `getSubmissionById` (not via tRPC)
- Renders OG image using Takumi
- Returns image with appropriate cache headers

### Error Handling

- Invalid UUID → 400 Bad Request
- Roast not found → 404 Not Found
- DB error → 500 Internal Server Error

### 2. Meta Tags

Update `/roast/[id]` page to include:
- `og:image` → `/api/og/[id]`
- `og:image:width` → 1200
- `og:image:height` → 630
- `twitter:card` → "summary_large_image"

### 3. Share Button

Update `$ share_roast` button in roast result page to copy shareable URL to clipboard.

## Component Design

### OG Image Layout

```
┌─────────────────────────────────────────────┐
│                                             │
│              > devroast                      │
│                                             │
│                 3.5                         │
│                /10                          │
│                                             │
│           (badge circle)                     │
│         needs_serious_help                  │
│                                             │
│        lang: javascript · 7 lines           │
│                                             │
│   "this code was written during a          │
│            power outage..."                 │
│                                             │
└─────────────────────────────────────────────┘
```

### Data Mapping

| Element | Source |
|---------|--------|
| Score | `analysis.score` (e.g., 3.5) |
| Denominator | Fixed "/10" |
| Badge + Label | Derived from score: <2 critical, <4 warning, >=4 good |
| Lang + Lines | `language` + `line_count` fields |
| Quote | `analysis.verdict` |

### Badge Colors

| Score Range | Label | Badge Variant |
|-------------|-------|---------------|
| < 2 | needs_serious_help | critical (red) |
| 2 - 3.9 | could_be_better | warning (amber) |
| >= 4 | not_bad | good (green) |

## Implementation

### Dependencies

```bash
pnpm add @takumi-rs/image-response
```

### Configuration

Update `next.config.ts`:
```typescript
export const config = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};
```

### Files to Create/Modify

1. **Create** `src/app/api/og/[id]/route.ts` - API route
2. **Create** `src/components/og/roast-image.tsx` - Takumi component
3. **Modify** `src/app/roast/[id]/page.tsx` - Add meta tags + share button

## Considerations

- Takumi uses JSX with Tailwind CSS (similar to Next.js ImageResponse)
- Use default Geist fonts bundled with Takumi (no custom font config needed)
- Use `ImageResponse` from Takumi for response
- Cache headers: set `Cache-Control: public, max-age=86400` for performance (1 day)
- Handle error cases gracefully (invalid ID, missing data)
