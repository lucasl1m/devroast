# OpenGraph Image Generation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate OpenGraph images automatically when roast results are shared on social media

**Architecture:** API route `/api/og/[id]` uses Takumi to render JSX to image. Page metadata points to this route. Share button copies URL.

**Tech Stack:** Takumi (`@takumi-rs/image-response`), Next.js API Routes

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── og/
│   │       └── [id]/
│   │           └── route.ts    # NEW: OG image API
│   └── roast/
│       └── [id]/
│           └── page.tsx       # MODIFY: add meta tags + share
└── components/
    └── og/
        └── roast-image.tsx   # NEW: Takumi component
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`

- [ ] **Step 1: Install Takumi**

Run: `pnpm add @takumi-rs/image-response`

- [ ] **Step 2: Configure next.config.ts**

Modify: `next.config.ts:1-5`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@takumi-rs/image-response"],
};

export default nextConfig;
```

- [ ] **Step 3: Commit**

```bash
pnpm add @takumi-rs/image-response
git add package.json pnpm-lock.yaml next.config.ts
git commit -m "feat: add @takumi-rs/image-response for OG generation"
```

---

## Task 2: Create OG Image Component

**Files:**
- Create: `src/components/og/roast-image.tsx`

- [ ] **Step 1: Create roast-image.tsx**

```tsx
import { getSubmissionById } from "@/db/queries/submissions";

interface RoastImageProps {
  id: string;
}

function getBadgeVariant(score: number): { label: string; color: string; bgColor: string } {
  if (score < 2) {
    return { label: "needs_serious_help", color: "#EF4444", bgColor: "#FEE2E2" };
  }
  if (score < 4) {
    return { label: "could_be_better", color: "#F59E0B", bgColor: "#FEF3C7" };
  }
  return { label: "not_bad", color: "#22C55E", bgColor: "#DCFCE7" };
}

export async function generateRoastImage(id: string) {
  const submission = await getSubmissionById(id);
  if (!submission) {
    throw new Error("Roast not found");
  }

  const analysis = submission.analysis as { score: number; verdict: string } | null;
  const score = analysis?.score ?? 0;
  const badge = getBadgeVariant(score);
  const language = submission.language;
  const lineCount = submission.lineCount ?? 1;
  const verdict = analysis?.verdict ?? "no verdict";

  return {
    score,
    badge,
    language,
    lineCount,
    verdict,
  };
}

export function RoastImage({
  score,
  badge,
  language,
  lineCount,
  verdict,
}: {
  score: number;
  badge: { label: string; color: string; bgColor: string };
  language: string;
  lineCount: number;
  verdict: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "28px",
        padding: "64px",
        backgroundColor: "#0A0A0A",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: "#22C55E", fontSize: "24px", fontWeight: "700" }}>&gt;</span>
        <span style={{ color: "#FAFAFA", fontSize: "20px", fontWeight: "500" }}>devroast</span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span style={{ color: "#F59E0B", fontSize: "160px", fontWeight: "900", lineHeight: 1 }}>
          {score.toFixed(1)}
        </span>
        <span style={{ color: "#525252", fontSize: "56px", fontWeight: "400", lineHeight: 1 }}>
          /10
        </span>
      </div>

      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: badge.color,
          }}
        />
        <span style={{ color: badge.color, fontSize: "20px", fontWeight: "400" }}>
          {badge.label}
        </span>
      </div>

      {/* Lang + Lines */}
      <span style={{ color: "#525252", fontSize: "16px", fontFamily: "monospace" }}>
        lang: {language} · {lineCount} lines
      </span>

      {/* Quote */}
      <p
        style={{
          color: "#FAFAFA",
          fontSize: "22px",
          fontFamily: "monospace",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "100%",
        }}
      >
        "{verdict}"
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/og/roast-image.tsx
git commit -m "feat: add RoastImage Takumi component"
```

---

## Task 3: Create API Route

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Create API route**

```typescript
import { ImageResponse } from "@takumi-rs/image-response";
import { NextRequest, NextResponse } from "next/server";
import { generateRoastImage, RoastImage } from "@/components/og/roast-image";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  try {
    const { score, badge, language, lineCount, verdict } = await generateRoastImage(id);

    const image = new ImageResponse(
      <RoastImage
        score={score}
        badge={badge}
        language={language}
        lineCount={lineCount}
        verdict={verdict}
      />,
      {
        width: 1200,
        height: 630,
      }
    );

    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Roast not found") {
      return new NextResponse("Not Found", { status: 404 });
    }
    console.error("OG image generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/og/
git commit -m "feat: add /api/og/[id] route for OG image generation"
```

---

## Task 4: Add Meta Tags to Roast Page

**Files:**
- Create: `src/app/roast/[id]/layout.tsx`

- [ ] **Step 1: Create layout.tsx**

Since `page.tsx` is a client component ("use client"), we need to add metadata in a separate layout file.

```typescript
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://devroast.com";
  
  return {
    openGraph: {
      images: [`${baseUrl}/api/og/${id}`],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${baseUrl}/api/og/${id}`],
    },
  };
}

export default function RoastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/\[id\]/layout.tsx
git commit -m "feat: add OG meta tags via layout"
```

---

## Task 5: Implement Share Button

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Add share functionality**

Modify: `src/app/roast/[id]/page.tsx:206-211` - replace button:

```tsx
"use client";

import { use, useEffect, useState } from "react";
// ... existing imports

// Add after other state:
const [shareUrl, setShareUrl] = useState("");

// Add useEffect to set shareUrl
useEffect(() => {
  setShareUrl(window.location.href);
}, []);

const handleShare = async () => {
  await navigator.clipboard.writeText(shareUrl);
  alert("URL copied to clipboard!");
};
```

Replace the button (lines 205-210):

```tsx
<Button
  variant="secondary"
  className="ml-auto px-4 py-2 text-xs font-mono"
  onClick={handleShare}
>
  $ share_roast
</Button>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/\[id\]/page.tsx
git commit -m "feat: add share button to roast page"
```

---

## Task 6: Add Environment Variable

**Files:**
- Modify: `.env`

- [ ] **Step 1: Add NEXT_PUBLIC_BASE_URL**

Append to `.env`:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 2: Commit**

```bash
git add .env
git commit -m "chore: add NEXT_PUBLIC_BASE_URL for OG images"
```

---

## Verification

- [ ] Run `pnpm dev`
- [ ] Create a roast and get the ID
- [ ] Visit `/api/og/[id]` - should return OG image
- [ ] Test share button - should copy URL
- [ ] Test meta tags - inspect page source for og:image
- [ ] Run `pnpm lint` - should pass
