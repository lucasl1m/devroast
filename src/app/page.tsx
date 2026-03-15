"use client";

import { useState } from "react";
import { Button, Toggle } from "@/components/ui";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

function applyTax(total) {
  return total * 1.1;
}

function formatCurrency(amount) {
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return "$" + amount.toFixed(2);
}`;

const leaderboardData = [
  {
    rank: 1,
    score: 2.1,
    code: "function calculateTotal(items) { var total = 0; ...",
    lang: "javascript",
  },
  {
    rank: 2,
    score: 3.5,
    code: "const fetchData = async () => { await db.query...",
    lang: "typescript",
  },
  {
    rank: 3,
    score: 4.8,
    code: "export default function App() { return <div>...</div> }",
    lang: "tsx",
  },
];

export default function HomePage() {
  const [roastMode, setRoastMode] = useState(true);

  return (
    <main className="min-h-screen bg-bg-page">
      <div className="max-w-[960px] mx-auto px-10 pt-20 pb-20">
        {/* Hero Title */}
        <div className="mb-12">
          <h1 className="flex items-center gap-3 text-[36px] font-bold font-mono">
            <span className="text-accent-green">$</span>
            <span className="text-text-primary">
              paste your code. get roasted.
            </span>
          </h1>
          <p className="font-code text-text-secondary text-sm mt-3">
            {"//"} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </div>

        {/* Code Editor */}
        <div className="w-[780px] border border-border-primary rounded-md overflow-hidden bg-bg-input mb-6">
          {/* Window Header */}
          <div className="flex items-center justify-between h-10 px-4 border-b border-border-primary">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent-red" />
              <span className="h-3 w-3 rounded-full bg-accent-amber" />
              <span className="h-3 w-3 rounded-full bg-accent-green" />
            </div>
          </div>

          {/* Code Content */}
          <div className="flex h-[360px]">
            {/* Line Numbers */}
            <div className="flex flex-col gap-1 pr-3 pl-3 py-3 border-r border-border-primary bg-bg-surface text-right text-text-tertiary font-mono text-xs select-none w-12">
              {Array.from({ length: 17 }).map((_, i) => (
                <span key={i} className="leading-6">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Code */}
            <pre className="flex-1 p-4 font-mono text-sm text-text-secondary leading-6 overflow-x-auto">
              <code>{sampleCode}</code>
            </pre>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="w-[780px] flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[10px]">
              <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
              <span
                className={`font-mono text-sm ${roastMode ? "text-accent-green" : "text-text-secondary"}`}
              >
                roast mode
              </span>
            </div>
            <span className="font-code text-text-tertiary text-xs">
              {"//"} maximum sarcasm enabled
            </span>
          </div>

          <Button variant="primary" size="default">
            $ roast_my_code
          </Button>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-center gap-6 mb-[60px] font-code text-text-tertiary text-xs">
          <span>2,847 codes roasted</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>

        {/* Leaderboard Preview */}
        <div className="w-[960px]">
          {/* Title */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
              <span className="text-accent-green">{"//"}</span>
              <span className="text-text-primary">shame_leaderboard</span>
            </h2>
            <Button variant="secondary" size="sm" className="text-text-secondary">
              $ view_all &gt;&gt;
            </Button>
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
            {leaderboardData.map((item) => (
              <div
                key={item.rank}
                className="flex items-center px-5 py-4 border-b border-border-primary last:border-b-0"
              >
                <span className="w-[50px] font-mono text-sm text-text-tertiary">
                  #{item.rank}
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

          {/* Footer */}
          <div className="text-center py-4 font-code text-text-tertiary text-xs">
            showing top 3 of 2,847 · view full leaderboard &gt;&gt;
          </div>
        </div>
      </div>
    </main>
  );
}
