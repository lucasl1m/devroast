import { HomeEditor } from "@/app/home-editor";
import { HomeStats } from "@/components/home-stats";
import { HydrateClient, trpc } from "@/server/trpc/server";

const mockLeaderboard = [
  {
    rank: 1,
    id: "1",
    code: "function sum(a, b) { return a + b }",
    lang: "javascript",
    score: 2.1,
  },
  {
    rank: 2,
    id: "2",
    code: "const x = 1",
    lang: "javascript",
    score: 3.5,
  },
  {
    rank: 3,
    id: "3",
    code: "console.log('hello')",
    lang: "javascript",
    score: 4.8,
  },
];

export default async function HomePage() {
  void trpc.getStats.prefetch();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-bg-page">
        <div className="w-full max-w-[1440px] mx-auto px-10 pt-[80px]">
          {/* Hero Title - Centralizado */}
          <div className="w-[660px] mx-auto flex flex-col gap-3 mb-12 text-center">
            <h1 className="flex items-center justify-center gap-3 text-[36px] font-bold font-mono">
              <span className="text-accent-green">$</span>
              <span className="text-text-primary">
                paste your code. get roasted.
              </span>
            </h1>
            <p className="font-code text-text-secondary text-sm">
              {"//"} drop your code below and we&apos;ll rate it — brutally
              honest or full roast mode
            </p>
          </div>

          <HomeEditor />

          {/* Footer Hint - Centralizado */}
          <div className="w-[316px] mx-auto mb-[60px]">
            <HomeStats />
          </div>

          {/* Leaderboard Preview - Centralizado */}
          <div className="w-[960px] mx-auto">
            {/* Title */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
                <span className="text-accent-green">{"//"}</span>
                <span className="text-text-primary">shame_leaderboard</span>
              </h2>
            </div>

            <p className="font-code text-text-tertiary text-sm mb-4">
              {"//"} the worst code on the internet, ranked by shame
            </p>

            {/* Table */}
            <div className="border border-border-primary rounded-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center h-10 px-5 border-b border-border-primary bg-bg-surface">
                <span className="w-[50px] font-mono text-xs text-text-tertiary">
                  #
                </span>
                <span className="w-[70px] font-mono text-xs text-text-tertiary">
                  score
                </span>
                <span className="flex-1 font-mono text-xs text-text-tertiary">
                  code
                </span>
                <span className="w-[100px] font-mono text-xs text-text-tertiary">
                  language
                </span>
              </div>

              {/* Rows */}
              {mockLeaderboard.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center px-5 py-4 border-b border-border-primary last:border-b-0"
                >
                  <span className="w-[50px] font-mono text-sm text-text-tertiary">
                    #{index + 1}
                  </span>
                  <span className="w-[70px] font-mono text-sm font-bold">
                    <span
                      className={
                        item.score < 4
                          ? "text-accent-red"
                          : item.score < 7
                            ? "text-accent-amber"
                            : "text-accent-green"
                      }
                    >
                      {item.score.toFixed(1)}
                    </span>
                    <span className="text-text-tertiary">/10</span>
                  </span>
                  <span className="flex-1 font-mono text-sm text-text-secondary truncate">
                    {item.code}
                  </span>
                  <span className="w-[100px] font-mono text-xs text-text-tertiary">
                    {item.lang}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
