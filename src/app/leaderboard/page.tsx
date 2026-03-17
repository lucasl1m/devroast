"use client";

import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { CodeBlockCollapsible } from "@/components/ui/code-block-collapsible";
import { trpc } from "@/server/trpc/client";

const PAGE_SIZE = 10;

interface LeaderboardRowProps {
  index: number;
  code: string;
  language: string;
  score: string | null;
}

function LeaderboardRow({ index, code, language, score }: LeaderboardRowProps) {
  const linesCount = code.split("\n").length;
  const numericScore = score ? Number(score) : null;
  const scoreColor =
    numericScore !== null
      ? numericScore < 4
        ? "text-accent-red"
        : numericScore < 7
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
              {numericScore ? numericScore.toFixed(1) : "0.0"}
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

function LeaderboardStats() {
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
    <div className="flex items-center gap-8">
      <span className="font-code text-xs text-text-tertiary">
        <NumberFlow value={displayTotal} format={{ notation: "compact" }} />{" "}
        submissions
      </span>
      <span className="text-text-tertiary">·</span>
      <span className="font-code text-xs text-text-tertiary">
        avg score:{" "}
        <NumberFlow
          value={displayAvg > 0 ? displayAvg : 0}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [offset, setOffset] = useState(0);
  const [allItems, setAllItems] = useState<
    Array<{
      id: string;
      code: string;
      language: string;
      score: string | null;
    }>
  >([]);
  const [total, setTotal] = useState(0);

  const { data, isLoading, isFetching } = trpc.getWorstSubmissions.useQuery({
    limit: PAGE_SIZE,
    offset,
  });

  const hasMore = allItems.length < total;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      if (offset === 0) {
        setAllItems(data.items);
      } else {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = data.items.filter(
            (item) => !existingIds.has(item.id)
          );
          return [...prev, ...newItems];
        });
      }
      setTotal(data.total);
    }
  }, [data, offset]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setOffset((prev) => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [isFetching, hasMore]);

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto">
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-12">
            <span className="text-accent-green font-mono text-[32px] font-bold">
              &gt;
            </span>
            <h1 className="font-mono text-[28px] font-bold text-text-primary">
              shame_leaderboard
            </h1>
          </div>

          <p className="font-code text-sm text-text-secondary">
            {"// the most roasted code on the internet"}
          </p>

          <LeaderboardStats />
        </section>

        <section className="flex flex-col gap-5">
          {isLoading && allItems.length === 0 ? (
            <LeaderboardSkeleton />
          ) : allItems.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-text-tertiary font-code text-sm">
              No codes roasted yet. Be the first!
            </div>
          ) : (
            <>
              {allItems.map((item, index) => (
                <LeaderboardRow
                  key={item.id}
                  index={index}
                  code={item.code}
                  language={item.language}
                  score={item.score}
                />
              ))}
              <div ref={loadMoreRef} className="py-4">
                {isFetching && <LeaderboardSkeleton />}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
