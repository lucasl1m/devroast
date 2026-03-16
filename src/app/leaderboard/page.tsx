import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { leaderboardData, leaderboardStats } from "@/data/leaderboard";

export const metadata: Metadata = {
  title: "Shame Leaderboard | DevRoast",
  description: "The most roasted code on the internet",
};

export default function LeaderboardPage() {
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

          <div className="flex items-center gap-8">
            <span className="font-code text-xs text-text-tertiary">
              {leaderboardStats.totalSubmissions.toLocaleString()} submissions
            </span>
            <span className="text-text-tertiary">·</span>
            <span className="font-code text-xs text-text-tertiary">
              avg score: {leaderboardStats.averageScore}/10
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          {leaderboardData.map((entry) => {
            const linesCount = entry.code.split("\n").length;
            const scoreColor =
              entry.score < 4
                ? "text-accent-red"
                : entry.score < 7
                  ? "text-accent-amber"
                  : "text-accent-green";

            return (
              <div
                key={entry.id}
                className="flex flex-col rounded-md border border-border-primary bg-bg-surface overflow-hidden"
              >
                <div className="flex items-center justify-between h-12 px-5 border-b border-border-primary">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[13px] text-text-tertiary">
                        #
                      </span>
                      <span className="font-mono text-[13px] font-bold text-text-tertiary">
                        {entry.rank}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-text-tertiary">
                        score:
                      </span>
                      <span
                        className={`font-mono text-[13px] font-bold ${scoreColor}`}
                      >
                        {entry.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-text-secondary">
                      {entry.language}
                    </span>
                    <span className="font-mono text-xs text-text-tertiary">
                      {linesCount} lines
                    </span>
                  </div>
                </div>
                <div className="h-[120px] rounded-b-md bg-bg-input">
                  <CodeBlock>
                    <CodeBlock.Content
                      code={entry.code}
                      lang={entry.language}
                    />
                  </CodeBlock>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
