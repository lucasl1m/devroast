# DevRoast 🔥

Your code, brutally roasted.

DevRoast is a platform where developers submit their code and receive brutally honest feedback from AI. Think of it as a code review from that one coworker who's never afraid to tell you the truth.

## About

This is a **Mini SaaS** project built during [NLW](https://www.rocketseat.com.br/nlw) (Next Level Week) from [Rocketseat](https://rocketseat.com.br).

In this edition, we focused on:
- **Agentic Workflows** - Using AI as an agent for architectural decisions
- **Specialized Sub-agents** - Automating development tasks
- **Full-Stack Modern Stack** - React, Next.js, tRPC, Node.js, Postgres, Drizzle

## Features

- **Paste & Roast** - Submit your code and get instant AI feedback
- **Score System** - See how bad (or good) your code really is (0-10)
- **Leaderboard** - Compare your roasts with other developers
- **Detailed Analysis** - Get line-by-line feedback with suggested fixes
- **Share Results** - Share your roast on social media with auto-generated OG images

## Tech Stack

- **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend:** tRPC, Node.js
- **Database:** PostgreSQL (Neon), Drizzle ORM
- **AI:** Google Gemini API
- **Deployment:** Vercel

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your keys

# Push database schema
pnpm db:push

# Run development server
pnpm dev
```

## Environment Variables

```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Demo

Live at: https://devroast-drab.vercel.app

---

*Warning: Side effects may include improved coding skills and hurt feelings.*
