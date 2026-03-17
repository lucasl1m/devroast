"use client";

import { use, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { trpc } from "@/server/trpc/client";

type AnalysisFeedback = {
  severity: string;
  title: string;
  message: string;
};

type AnalysisDiff = {
  type: "added" | "removed" | "context";
  content: string;
};

type Analysis = {
  score: number;
  verdict: string;
  feedbacks: AnalysisFeedback[];
  diff: AnalysisDiff[];
} | null;

export default function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [shareUrl, setShareUrl] = useState("");
  const { data: roast, isLoading, error } = trpc.getRoastById.useQuery({ id });

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert("URL copied to clipboard!");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-page flex items-center justify-center">
        <span className="font-mono text-accent-green">Loading...</span>
      </main>
    );
  }

  if (error || !roast) {
    return (
      <main className="min-h-screen bg-bg-page flex flex-col items-center justify-center gap-4">
        <h1 className="font-mono text-accent-red">Roast not found</h1>
        <a href="/" className="font-mono text-accent-green">
          ← Back to home
        </a>
      </main>
    );
  }

  const SAMPLE_CODE = roast.code;
  const analysis = roast.analysis as Analysis;

  const ISSUES =
    analysis?.feedbacks?.map(
      (
        f: AnalysisFeedback
      ): { type: "critical" | "good"; title: string; description: string } => ({
        type: f.severity === "critical" ? "critical" : "good",
        title: f.title,
        description: f.message,
      })
    ) || [];

  const DIFF_LINES =
    analysis?.diff?.map((d: AnalysisDiff) => ({
      variant: d.type,
      prefix: d.type === "added" ? "+ " : d.type === "removed" ? "- " : " ",
      code: d.content,
    })) || [];
  return (
    <main className="min-h-screen bg-bg-page">
      <div className="flex flex-col gap-10 px-20 py-10 max-w-[1440px] mx-auto">
        <section className="flex items-center gap-12">
          <ScoreRing score={analysis?.score || 0} />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <span className="font-mono text-sm font-medium text-accent-red">
                verdict: {analysis?.verdict || "unknown"}
              </span>
            </div>
            <h1 className="font-code text-xl text-text-primary leading-relaxed">
              "{analysis?.verdict || "no verdict"}"
            </h1>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-tertiary">
                lang: javascript
              </span>
              <span className="text-text-tertiary">·</span>
              <span className="font-mono text-xs text-text-tertiary">
                7 lines
              </span>
              <Button
                variant="secondary"
                className="ml-auto px-4 py-2 text-xs font-mono"
                onClick={handleShare}
              >
                $ share_roast
              </Button>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              your_submission
            </h2>
          </div>
          <div className="h-[424px] rounded-md border border-border-primary bg-bg-input overflow-hidden p-4">
            <pre className="font-mono text-sm text-text-primary whitespace-pre-wrap">
              {SAMPLE_CODE}
            </pre>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              detailed_analysis
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {ISSUES.map(
              (
                issue: {
                  type: "critical" | "good";
                  title: string;
                  description: string;
                },
                index: number
              ) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-5 rounded-md border border-border-primary"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={issue.type}>{issue.type}</Badge>
                  </div>
                  <h3 className="font-mono text-sm font-medium text-text-primary">
                    {issue.title}
                  </h3>
                  <p className="font-code text-xs text-text-secondary leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <h2 className="font-mono text-sm font-bold text-text-primary">
              suggested_fix
            </h2>
          </div>
          <div className="flex flex-col rounded-md border border-border-primary bg-bg-input overflow-hidden">
            <div className="flex items-center h-10 px-4 border-b border-border-primary">
              <span className="font-mono text-xs text-text-secondary">
                your_code.ts → improved_code.ts
              </span>
            </div>
            <div className="py-1">
              {DIFF_LINES.map(
                (
                  line: {
                    variant: "added" | "removed" | "context";
                    prefix: string;
                    code: string;
                  },
                  index: number
                ) => (
                  <DiffLine
                    key={index}
                    variant={line.variant}
                    prefix={line.prefix}
                    code={line.code}
                  />
                )
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
