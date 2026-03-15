"use client";

import { useState } from "react";
import { Button, CodeEditor, Toggle } from "@/components/ui";

interface LeaderboardItem {
  rank: number;
  id: string;
  code: string;
  lang: string;
  score: number;
}

interface HomepageStats {
  totalRoasted: number;
  avgScore: number;
}

interface HomepageData {
  stats: HomepageStats;
  leaderboard: LeaderboardItem[];
}

interface HomepageClientProps {
  initialData: HomepageData;
}

export default function HomepageClient({ initialData }: HomepageClientProps) {
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [isOverLimit, setIsOverLimit] = useState(false);
  const data = initialData;

  return (
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
            {"//"} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </div>

        {/* Code Editor - Centralizado */}
        <div className="w-[780px] mx-auto mb-6">
          <CodeEditor
            value={code}
            onChange={setCode}
            onLimitChange={setIsOverLimit}
            size="default"
          />
        </div>

        {/* Actions Bar - Centralizado */}
        <div className="w-[780px] mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-[10px]">
              <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
              <span
                className={`font-mono text-sm ${
                  roastMode ? "text-accent-green" : "text-text-secondary"
                }`}
              >
                roast mode
              </span>
            </div>
            <span className="font-code text-text-tertiary text-xs">
              {"//"} maximum sarcasm enabled
            </span>
          </div>

          <Button variant="primary" size="default" disabled={isOverLimit}>
            $ roast_my_code
          </Button>
        </div>

        {/* Footer Hint - Centralizado */}
        <div className="w-[316px] mx-auto flex items-center justify-center gap-6 mb-[60px] font-code text-text-tertiary text-xs">
          <span>{data.stats.totalRoasted.toLocaleString()} codes roasted</span>
          <span>·</span>
          <span>
            avg score:{" "}
            {data.stats.avgScore > 0 ? data.stats.avgScore.toFixed(1) : "0.0"}
            /10
          </span>
        </div>

        {/* Leaderboard Preview - Centralizado */}
        <div className="w-[960px] mx-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 font-mono text-sm font-bold">
              <span className="text-accent-green">{"//"}</span>
              <span className="text-text-primary">shame_leaderboard</span>
            </h2>
            <Button
              variant="secondary"
              size="sm"
              className="text-text-secondary"
            >
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
            {data.leaderboard.length > 0 ? (
              data.leaderboard.map((item, index) => (
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
              ))
            ) : (
              <div className="flex items-center px-5 py-8 text-center text-text-tertiary font-code text-sm">
                No codes roasted yet. Be the first!
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-4 font-code text-text-tertiary text-xs">
            showing top {data.leaderboard.length} of{" "}
            {data.stats.totalRoasted.toLocaleString()} · view full leaderboard
            &gt;&gt;
          </div>
        </div>
      </div>
    </main>
  );
}
