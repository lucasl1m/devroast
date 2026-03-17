"use client";

import { CodeBlockCollapsible } from "@/components/ui/code-block-collapsible";
import { trpc } from "@/server/trpc/client";

interface LeaderboardRowProps {
  index: number;
  code: string;
  language: string;
  score: number | null;
}

function LeaderboardRow({ index, code, language, score }: LeaderboardRowProps) {
  const linesCount = code.split("\n").length;
  const scoreColor =
    score !== null
      ? score < 4
        ? "text-accent-red"
        : score < 7
          ? "text-accent-amber"
          : "text-accent-green"
      : "text-text-tertiary";

  return (
    <div className="flex flex-col rounded-md border border-border-primary bg-bg-surface overflow-hidden">
      <div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[13px] text-text-tertiary">#</span>
            <span className="font-mono text-[13px] font-bold text-text-tertiary">
              {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-text-tertiary">score:</span>
            <span className={`font-mono text-[13px] font-bold ${scoreColor}`}>
              {score ? score.toFixed(1) : "0.0"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary">
            {language}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {linesCount} lines
          </span>
        </div>
      </div>
      <div className="rounded-b-md bg-bg-input overflow-hidden">
        <CodeBlockCollapsible
          code={code}
          lang={language}
          maxLines={3}
          threshold={3}
        />
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-md border border-border-primary bg-bg-surface overflow-hidden"
        >
          <div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-6 bg-bg-input animate-pulse rounded" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-10 bg-bg-input animate-pulse rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-bg-input animate-pulse rounded" />
              <div className="h-4 w-12 bg-bg-input animate-pulse rounded" />
            </div>
          </div>
          <div className="h-[120px] bg-bg-input animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function HomeLeaderboard() {
  const { data, isPending } = trpc.getWorstSubmissions.useQuery(
    { limit: 3, offset: 0 },
    {
      placeholderData: (previousData) => previousData,
    }
  );

  const submissions = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="w-[960px] mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
          <span className="text-accent-green">{"//"}</span>
          <span className="text-text-primary">shame_leaderboard</span>
        </h2>
      </div>

      <p className="font-code text-text-tertiary text-sm mb-4">
        {"//"} the worst code on the internet, ranked by shame
      </p>

      <div className="flex flex-col gap-4">
        {isPending ? (
          <LeaderboardSkeleton />
        ) : submissions.length === 0 ? (
          <div className="flex items-center px-5 py-8 text-center text-text-tertiary font-code text-sm">
            No codes roasted yet. Be the first!
          </div>
        ) : (
          <>
            {submissions.map((item, index) => (
              <LeaderboardRow
                key={item.id}
                index={index}
                code={item.code}
                language={item.language}
                score={item.score ? Number(item.score) : null}
              />
            ))}

            <div className="flex items-center justify-center py-3 text-xs font-code text-text-tertiary">
              showing top {submissions.length} of {total} ·{" "}
              <a
                href="/leaderboard"
                className="text-accent-green hover:underline ml-1 font-bold"
              >
                view full leaderboard &gt;&gt;
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
